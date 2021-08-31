import { Cache, Model } from 'base-repo';
import { AllowNull, BelongsTo, Column, Default, ForeignKey, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { UserLogin } from './UserLogin';

interface IModelOptional {
  id: number;
  phone: string;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  name: string;
  email: string;
}

export type IModelCreate = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'user',
  indexes: [{ fields: ['is_deleted', 'email'] }],
})
export class User extends Model<IModel, IModelCreate> implements IModel {
  @BelongsTo(() => UserLogin)
  userLogin: UserLogin;

  @ForeignKey(() => UserLogin)
  userLoginId: number;

  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(true)
  @Column
  phone: string;

  @Default(false)
  @Column
  isDeleted: boolean;
}
