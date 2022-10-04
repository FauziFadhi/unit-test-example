import { Cache, Model } from 'base-repo';
import { IUnfilledAtt } from 'utils/base-class/base.interface';
import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { DmVoucher } from './DmVoucher';
import { User } from './User';

interface IModelOptional extends IUnfilledAtt {
  transactionNumber: string;
  isDeleted: boolean;
  isUsed: boolean;
  status: EVoucherUsedLogStatus;
}

export enum EVoucherUsedLogStatus {
  USED = 1,
  RECLAIMED,
}

export interface IModel extends Partial<IModelOptional> {
  id: number;
  voucherData: any
  transactionId: number;
  voucherId: number;
  userId: number;
}

export type ICreateModelAtt = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'voucher_used_log',
  indexes: [
    { fields: ['status'] },
  ],
})
export class VoucherUsedLog extends Model<IModel, ICreateModelAtt> implements IModel {
  id: number;

  @AllowNull(false)
  @Column(DataType.JSONB)
  voucherData: any;

  @AllowNull(false)
  @Column
  transactionId: number;

  @BelongsTo(() => User)
  user: User;

  @AllowNull(false)
  @Column
  @ForeignKey(() => User)
  userId : number;

  @BelongsTo(() => DmVoucher)
  voucher: DmVoucher;

  @AllowNull(false)
  @Column
  @ForeignKey(() => DmVoucher)
  voucherId : number;

  @Column
  transactionNumber?: string;

  @Column
  createdAt?: Date;

  @Default(false)
  @Column
  isUsed?: boolean;

  @Default(EVoucherUsedLogStatus.USED)
  @Column
  status: EVoucherUsedLogStatus;

  @Default(false)
  @Column
  isDeleted: boolean;
}
