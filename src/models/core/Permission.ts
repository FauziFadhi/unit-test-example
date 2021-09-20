import { Cache, Model } from 'base-repo';
import { AllowNull, BelongsToMany, Column, Default, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { RolePermission } from './RolePermission';

interface IModelOptional {
  id: number;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  name: string;
  key: string;
}

export type IModelCreate = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'permission',
  indexes: [{ fields: ['is_deleted', 'key'] }],
})
export class Permission extends Model<IModel, IModelCreate> implements IModel {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  key: string;

  @Default(false)
  @Column
  isDeleted: boolean;

  @BelongsToMany(() => Role, () => RolePermission)
  roles: Role[];
}
