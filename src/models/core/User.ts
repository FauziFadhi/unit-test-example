import { IUnfilledAtt } from 'utils/base-class/base.interface';
import { AllowNull, Column, Default, Table } from 'sequelize-typescript';
import { BaseModel, Cache } from 'base-repo';

interface IModelOptional {
  id: number;
  phone: string;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  name: string;
  email: string;
}

type IModelCreate = Omit<IModel, 'id' | keyof IModelOptional>;

@Cache()
@Table({
  tableName: 'user_login',
  indexes: [{ fields: ['is_deleted', 'email'] }],
})
export class User extends BaseModel<IModel, IModelCreate> implements IModel {
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
