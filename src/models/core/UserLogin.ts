import { IUnfilledAtt } from 'utils/base-class/base.interface';
import { AllowNull, Column, Table } from 'sequelize-typescript';
import { BaseModel, Cache } from 'base-repo';

interface IModelOptional {
  id: number;
  isActive: boolean;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  username: string;
  password: string;
}

type IModelCreate = Omit<IModel, 'id' | keyof IModelOptional>;

@Cache({})
@Table({ tableName: 'user_login' })
export class UserLogin extends BaseModel<IModel, IModelCreate> {
  @Column
  username: string;

  @Column
  password: string;

  @AllowNull(false)
  @Column
  isActive: boolean;

  @AllowNull(false)
  @Column
  isDeleted: boolean;
}
