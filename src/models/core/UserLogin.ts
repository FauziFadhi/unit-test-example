import { Cache, Model } from 'base-repo';
import { AllowNull, Column, Default, HasOne, Scopes, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { IModelCreate as IModelCreateUser, User } from './User';

interface IModelOptional {
  id: number;
  isActive: boolean;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  username: string;
  password: string;
}

interface IModelCreate extends Omit<IModel, 'id'>, Partial<IModelOptional> {
  user?: IModelCreateUser;
}

@Scopes(() => ({
  active: ({
    where: {
      isDeleted: false,
      isActive: true,
    },
  }),
}))
@Cache()
@Table({
  tableName: 'user_login',
  indexes: [{ fields: ['is_deleted', 'is_active', 'username'] }],
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

  @AllowNull(false)
  @Default(false)
  @Column
  isDeleted: boolean;

  @HasOne(() => User)
  user: User;
}
