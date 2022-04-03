import { Cache, Model } from 'base-repo';
import {
  AllowNull, BelongsTo, BelongsToMany, Column, Default, ForeignKey, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { UserLogin } from './UserLogin';
import { UserRole } from './UserRole';

interface IRelation {
  roles: Attributes<Role>[]
  userLogin: Attributes<UserLogin>
}

interface IModelOptional extends IUnfilledAtt, IRelation {
  id: number;
  phone: string;
}

interface IModel extends Partial<IModelOptional> {
  name: string;
  email: string;
  userLoginId: number;
}

export type IModelCreate = Omit<IModel, 'id'>;

@Cache()
@Table({
  tableName: 'user',
  paranoid: true,
  indexes: [{ fields: ['email'] }],
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

  @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];
}
