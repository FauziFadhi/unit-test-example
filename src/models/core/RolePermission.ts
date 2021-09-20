import { Cache, Model } from 'base-repo';
import { BelongsTo, ForeignKey, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { Permission } from './Permission';
import { Role } from './Role';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IModelOptional {
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  roleId: number
  permissionId: number
}

export type IModelCreate = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'role_permission',
  timestamps: false,
})
export class RolePermission extends Model<IModel, IModelCreate> implements IModel {
  @BelongsTo(() => Permission)
  permission_id: Permission;

  @ForeignKey(() => Permission)
  permissionId: number;

  @BelongsTo(() => Role)
  role: Role;

  @ForeignKey(() => Role)
  roleId: number;
}
