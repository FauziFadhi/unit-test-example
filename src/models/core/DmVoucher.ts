import { Cache, Model } from 'base-repo';
import { IUnfilledAtt } from 'utils/base-class/base.interface';
import {
  AllowNull,
  Column,
  DataType,
  Default,
  Sequelize,
  Table,
} from 'sequelize-typescript';

export enum EVoucherType {
  fix = 'fix',
  percentage = 'percentage',
}

export interface IWhereCriteria {
  branchId?: number;

  transactionType?: number;

  appointmentType?: number;
}
export interface IVoucherCriteria {
  branchIds?: number[];
  transactionTypes?: number[];
  appointmentTypes?: number[];
}

interface IModelOptional extends IUnfilledAtt {
  id: number;

  /**
   * if null = unlimited
   */
  qty: number;

  /**
   * if null = unlimited
   */
  maxUsedQty: number;

  /**
   * for percentage, maximum discount
   */
  maxAmount: number;
  minimumSpend: number;
  isActive: boolean;
  criteria: IVoucherCriteria;
  isUsed: boolean;
  isDeleted: boolean;
}

export interface IModel extends Partial<IModelOptional> {
  id: number
  title: string;
  code: string;
  description: string;
  type: EVoucherType;

  /**
   * @example `20%` || `100.000`
   */
  amount: number;
  startDate: string;
  endDate: string;
}

export type ICreateModelAtt = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'dm_voucher',
  indexes: [
    { fields: ['code'], where: { is_deleted: false }, unique: true },
    { fields: ['start_date', 'end_date'], where: { is_deleted: false, is_active: true }, using: 'GIST' },
  ],
})
export class DmVoucher extends Model<IModel, ICreateModelAtt> implements IModel {
  id: number;

  @AllowNull(false)
  @Column
    title: string;

  @AllowNull(false)
  @Column
    code: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
    description: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
    type: EVoucherType;

  @AllowNull(false)
  @Column(DataType.TEXT)
    amount: number;

  @AllowNull(false)
  @Column(DataType.DATE)
    startDate: string;

  @AllowNull(false)
  @Column(DataType.DATE)
    endDate: string;

  // @AllowNull(false)
  // @Column(DataType.DATE)
  // endDate: string;

  @Default(null)
  @Column
    qty?: number;

  @Default(null)
  @Column
    maxUsedQty?: number;

  @Default(null)
  @Column
    maxAmount?: number;

  @Default(0)
  @Column
    minimumSpend?: number;

  @Default(false)
  @Column
    isActive?: boolean;

  @Default(false)
  @Column
    isUsed?: boolean;

  @Default(null)
  @Column(DataType.JSONB)
    criteria?: IVoucherCriteria;

  @Default(false)
  @Column
    isDeleted: boolean;

  static whereDuring = Sequelize.literal('tstzrange("DmVoucher".start_date, "DmVoucher".end_date, \'[]\') @> now()');

  static whereCriteria(criteria: IWhereCriteria) {

  }

  static whereQtyAvail() {
  }
}
