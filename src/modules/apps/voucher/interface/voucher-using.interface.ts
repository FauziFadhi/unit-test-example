import { DmVoucher, IModel as DmVoucherEntity } from '@models/core/DmVoucher';
import { EVoucherUsedLogStatus } from '@models/core/VoucherUsedLog';

export interface IUseVoucherDTO {
  voucherId: number;
  transaction: {
    id: number;
    number: string;
    discountAmount: number;
  }
  userId: number;
}

export interface IReclaimVoucherDTO {
  voucherId: number;
  userId: number;
  transaction: {
    id: number;
    number: string;
  }
}

export interface IVoucherUsedLog {
  voucher: DmVoucherEntity;
  transactionId: number;
}

export interface ICalculateDiscountRsp {
  discount: number,
  total: number,
}

export interface ICalculateDiscountDTO {
  price: number;
  voucher: Pick<DmVoucherEntity, 'amount' | 'maxAmount'>;
}

export interface ILogUsedVoucherDTO {
  voucher: DmVoucherEntity;
  transaction: { id: number, number: string }
  userId: number;
  status?: EVoucherUsedLogStatus
}
