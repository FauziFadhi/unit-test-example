import { IWhereCriteria, IModel as DmVoucherEntity, DmVoucher, EVoucherType } from '@models/core/DmVoucher';
import { VoucherUsed } from '@models/core/VoucherUsed';
import { EVoucherUsedLogStatus, VoucherUsedLog } from '@models/core/VoucherUsedLog';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import {
  ICalculateDiscountDTO, ICalculateDiscountRsp, ILogUsedVoucherDTO, IReclaimVoucherDTO, IUseVoucherDTO,
} from './interface/voucher-using.interface';
import { VoucherService } from './voucher.service';

@Injectable()
export class VoucherUsingService {
  constructor(
    private readonly voucherService: VoucherService,
    private readonly sequelize: Sequelize,
  ) {

  }

  /**
   * use voucher, decrease voucher amount for used by transaction and logging it
   * @param dto
   * @param transaction
   */
  async useVoucher(dto: IUseVoucherDTO, transaction?: Transaction): Promise<DmVoucher | null> {
    const voucher = await this.voucherService.findActiveByIdCache(dto.voucherId);

    if (voucher.maxUsedQty) {
      await this.validateMaxUsingVoucher(voucher.maxUsedQty, dto.userId, dto.voucherId);
    }

    if (dto.transaction.discountAmount <= 0) {
      return null;
    }

    if (Number.isInteger(voucher.qty)) {
      await voucher?.update({ qty: this.sequelize.Sequelize.literal('qty - 1'), isUsed: true }, { transaction })
        .catch((e) => {
          throw new BadRequestException('Voucher is not available.');
        });
    }

    await Promise.all([
      this.loggingUsedVoucher({ voucher, transaction: dto.transaction, userId: dto.userId }, transaction),
      this.adjustVoucherUsedCount({ userId: dto.userId, voucherId: dto.voucherId }, 'use', transaction),

    ]);

    return voucher;
  }

  /**
   * validate if user still has this voucher
   * @param maxUsedQty
   * @param userId
   * @param voucherId
   */
  async validateMaxUsingVoucher(maxUsedQty: number, userId: number, voucherId: number): Promise<void> {
    const voucherUsed = await VoucherUsed.findOneCache({
      // ttl: 60,
      where: {
        userId,
        voucherId,
      },
    });

    if (maxUsedQty && voucherUsed?.usedCount >= maxUsedQty) {
      throw new BadRequestException('You have reach limit for using this voucher.');
    }
  }

  /**
   * reclaim voucher if transaction not completed
   * @param dto
   * @param transaction
   */
  async reclaimVoucher(dto: IReclaimVoucherDTO, transaction?: Transaction): Promise<DmVoucherEntity | null> {
    const voucher = await DmVoucher.findByPkCache(dto.voucherId);

    if (!voucher) return null;

    await Promise.all([
      this.loggingUsedVoucher({
        transaction: dto.transaction,
        userId: dto.userId,
        voucher,
        status: EVoucherUsedLogStatus.RECLAIMED,
      }, transaction),
      voucher?.update({ qty: this.sequelize.Sequelize.literal('qty + 1') }, { transaction }),
      this.adjustVoucherUsedCount({ userId: dto.userId, voucherId: dto.voucherId }, 'reclaim', transaction),
    ]);

    return voucher;
  }

  /**
   * calculate discount price
   * @param price
   * @param voucherId
   * @param criteria
   * @returns
   */
  async calculate(
    price: number,
    voucherId: number,
    criteria: Required<IWhereCriteria>,
  ): Promise<ICalculateDiscountRsp & { voucher: DmVoucher }> {
    const voucher = await this.voucherService.findOneByCriteriaCache(voucherId, criteria);

    const defaultValue = {
      discount: 0,
      total: price,
      voucher,
    };
    if (voucher.minimumSpend && price < voucher.minimumSpend) {
      return defaultValue;
    }

    if (voucher.type === EVoucherType.fix) {
      return {
        ...this.calculateFix({ price, voucher }),
        voucher,
      };
    }

    if (voucher.type === EVoucherType.percentage) {
      return {
        ...this.calculatePercentage({ price, voucher }),
        voucher,
      };
    }

    return defaultValue;
  }

  /**
   * calculate discount for fix Amount discount
   * @param dto
   * @returns
   */
  private calculateFix(dto: ICalculateDiscountDTO): Omit<ICalculateDiscountRsp, 'voucher'> {
    return this.calculateDiscountAndTotal(dto.voucher.amount, dto.price);
  }

  /**
   * calculcate price for percentage discount
   * @param dto
   * @returns
   */
  private calculatePercentage(dto: ICalculateDiscountDTO): Omit<ICalculateDiscountRsp, 'voucher'> {
    const { voucher: { amount, maxAmount }, price } = dto;

    const calculatedDiscount = (price * amount) / 100;

    if (!maxAmount) { return this.calculateDiscountAndTotal(calculatedDiscount, dto.price); }

    const discountAmount = calculatedDiscount > maxAmount ? maxAmount : calculatedDiscount;

    return this.calculateDiscountAndTotal(discountAmount, dto.price);
  }

  /**
   * get total price from discount
   * @param discount
   * @param price
   * @returns
   */
  private calculateDiscountAndTotal(discount: number, price: number) {
    const roundedDiscount = Math.round(discount);
    if (discount > price) {
      return {
        total: 0,
        discount: Math.round(price),
      };
    }

    return {
      total: price - roundedDiscount,
      discount: roundedDiscount,
    };
  }

  /**
   * log used voucher data
   * @param dto
   * @param transaction
   */
  private async loggingUsedVoucher(
    dto: ILogUsedVoucherDTO,
    transaction?: Transaction,
  ): Promise<void> {
    const { voucher, transaction: { id: transactionId, number: transactionNumber } } = dto;
    await VoucherUsedLog.create({
      voucherId: voucher.id,
      voucherData: voucher,
      transactionId,
      transactionNumber,
      userId: dto.userId,
      status: dto.status,
    }, { transaction });
  }

  private async adjustVoucherUsedCount({ userId, voucherId }, state: 'use' | 'reclaim', transaction?: Transaction) {
    const voucherUsed = await VoucherUsed.findOneCache({
      ttl: 60,
      where: {
        userId,
        voucherId,
      },
    });

    if (!voucherUsed) {
      const usedCount = state === 'use' ? 1 : 0;
      return VoucherUsed.create({ userId, voucherId, usedCount });
    }

    if (state === 'use') {
      voucherUsed.update({ usedCount: this.sequelize.Sequelize.literal('used_count + 1') }, { transaction });
      return voucherUsed;
    }

    voucherUsed.update({ usedCount: this.sequelize.Sequelize.literal('used_count - 1') }, { transaction });
    return voucherUsed;
  }
}
