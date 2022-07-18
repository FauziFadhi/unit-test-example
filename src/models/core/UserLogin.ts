import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Default, HasOne, Scopes, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt, Optional } from 'utils/base-class/base.interface';

import { User } from './User';

interface IRelation {
  user: Attributes<User>
}

type INullableModel = IUnfilledAtt;

export interface IModel extends Optional<INullableModel>, Partial<IRelation> {
  id: number;
  username: string;
  password: string;
  isActive: boolean;
}

export type IModelCreate = Omit<IModel, 'id' | 'isActive'>;

@Scopes(() => ({
  active: ({
    where: {
      isActive: true,
    },
  }),
}))
@Cache()
@Table({
  tableName: 'user_login',
  paranoid: true,
  indexes: [{ fields: ['is_active', 'username'], where: { is_deleted: false } }],
})
export class UserLogin
  extends Model<IModel, IModelCreate>
  implements IModel {
  id: number;

  @AllowNull(false)
  @Column
    username: string;

  @AllowNull(false)
  @Column
    password: string;

  @Default(false)
  @Column
    isActive: boolean;

  @HasOne(() => User)
    user: User;
}
