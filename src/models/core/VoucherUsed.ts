import { Cache, Model } from 'base-repo';
import { IUnfilledAtt } from 'utils/base-class/base.interface';
import {
  AllowNull,
  Column,
  Default,
  Table,
} from 'sequelize-typescript';

interface IModelOptional extends IUnfilledAtt {
  id: number;
  usedCount: number;
}

export interface IModel extends Partial<IModelOptional> {
  voucherId: number;
  userId: number;
}

export type ICreateModelAtt = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'voucher_used',
  indexes: [
    { fields: ['user_id', 'voucher_id'], unique: true },
  ],
})
export class VoucherUsed extends Model<IModel, ICreateModelAtt> implements IModel {
  @AllowNull(false)
  @Column
  userId: number;

  @AllowNull(false)
  @Column
  voucherId: number;

  @Default(0)
  @Column
  usedCount: number;
}
