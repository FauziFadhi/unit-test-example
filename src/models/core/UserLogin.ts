import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Default, HasOne, Scopes, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { User } from './User';

interface IRelation {
  user: Attributes<User>
}

interface IModelOptional extends IUnfilledAtt, IRelation {
  id: number;
  isActive: boolean;
}

interface IModel extends Partial<IModelOptional> {
  username: string;
  password: string;
}

export type IModelCreate = Omit<IModel, 'id'>;

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
  indexes: [{ fields: ['is_active', 'username'] }],
})
export class UserLogin
  extends Model<IModel, IModelCreate>
  implements IModel {
  @Column
    username: string;

  @Column
    password: string;

  @AllowNull(false)
  @Default(false)
  @Column
    isActive: boolean;

  @HasOne(() => User)
    user: User;
}
