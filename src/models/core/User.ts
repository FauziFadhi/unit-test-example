import { Cache, Model } from 'base-repo';
import sequelize from 'sequelize';
import {
  AllowNull, BeforeCreate, BelongsTo, BelongsToMany, Column, ForeignKey, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt, Optional } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { UserLogin } from './UserLogin';
import { UserRole } from './UserRole';

interface IRelation {
  roles: Attributes<Role>[]
  userLogin: Attributes<UserLogin>
}

/**
   * auto generated attributes, cause of that removed from iModelCreate
 */
interface AutoGeneratedAttr {
  id: number;
  code: string;
}

interface INullableAttr extends IUnfilledAtt {
  phone: string;
}

export interface IModel extends
  Optional<INullableAttr>,
  Partial<IRelation>,
  AutoGeneratedAttr {
  name: string;
  email: string;
  userLoginId: number;
}

export type IModelCreate = Omit<IModel, 'id' | keyof AutoGeneratedAttr> & Partial<AutoGeneratedAttr>;

@Cache()
@Table({
  tableName: 'user',
  paranoid: true,
  indexes: [{ fields: ['email'] }],
})
export class User extends Model<IModel, IModelCreate> implements IModel {
  id: number;

  @BelongsTo(() => UserLogin)
    userLogin?: Attributes<UserLogin>;

  @AllowNull(false)
  @ForeignKey(() => UserLogin)
  @Column
    userLoginId: number;

  @AllowNull(false)
  @Column
    name: string;

  @AllowNull(false)
  @Column
    email: string;

  @Column
    code: string;

  @Column
    phone: string;

  @BelongsToMany(() => Role, () => UserRole)
    roles: Role[];

  @BeforeCreate
  static async generateCode(model: User, options) {
    model.code = sequelize.literal(`(
      with lastCount as (select count(*) as count from "user")
      select lastCount.count+1 from lastCount
    )`) as any;
  }
}
