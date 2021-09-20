import { Cache, Model } from 'base-repo';
import { BelongsTo, ForeignKey, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { User } from './User';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IModelOptional {
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  userId: number
  roleId: number
}

export type IModelCreate = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'user_role',
  timestamps: false,
})
export class UserRole extends Model<IModel, IModelCreate> implements IModel {
  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Role)
  roleId: number;
}
