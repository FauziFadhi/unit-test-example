import { DmVoucher, IWhereCriteria } from '@models/core/DmVoucher';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class VoucherService {
  constructor(
    private readonly sequelize: Sequelize,
  ) {

  }

  async findOneByCriteriaCache(voucherId: number, criteria: Required<IWhereCriteria>) {
    const whereCriteria = criteria ? DmVoucher.whereCriteria(criteria)[Op.and] : [];
    return DmVoucher.findOneCache({
      ttl: 2,
      where: {
        isDeleted: false,
        isActive: true,
        [Op.and]: [
          DmVoucher.whereDuring,
        ].concat(whereCriteria as any),
        // qty: DmVoucher.whereQtyAvail(),
        id: voucherId,
      },
      rejectOnEmpty: new NotFoundException('Can\'t use this voucher.'),
    });
  }

  async findActiveByIdCache(voucherId: number) {
    return DmVoucher.findOneCache({
      ttl: 5,
      where: {
        isDeleted: false,
        isActive: true,
        [Op.and]: [
          DmVoucher.whereDuring,
        ],
        // qty: DmVoucher.whereQtyAvail(),
        id: voucherId,
      },
      rejectOnEmpty: new NotFoundException('Voucher not available.'),
    });
  }
}
