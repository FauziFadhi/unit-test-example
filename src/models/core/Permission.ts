import { Cache, Model } from 'base-repo';
import {
  AllowNull, BelongsToMany, Column, Default, Table,
} from 'sequelize-typescript';
import { Attributes } from 'sequelize/types';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

import { Role } from './Role';
import { RolePermission } from './RolePermission';

interface IRelation {
  roles: Attributes<Role>[]
}

interface IModelOptional extends IUnfilledAtt, IRelation {
  id: number;
}

interface IModel extends Partial<IModelOptional> {
  name: string;
  key: string;
}

export type IModelCreate = Omit<IModel, 'id'>;

@Cache()
@Table({
  tableName: 'permission',
  paranoid: true,
  indexes: [{ fields: ['key'], where: { deleted_at: null } }],
})
export class Permission extends Model<IModel, IModelCreate> implements IModel {
  @AllowNull(false)
  @Column
    name: string;

  @AllowNull(false)
  @Column
    key: string;

  @BelongsToMany(() => Role, () => RolePermission)
    roles: Role[];
}
