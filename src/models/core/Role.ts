import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Table,
} from 'sequelize-typescript';
import { IUnfilledAtt, Optional } from '@utils/base-class/base.interface';

type INullableAttr = IUnfilledAtt;

/**
   * auto generated attributes, cause of that removed from iModelCreate
 */
interface AutoGeneratedAttr {
  id: number;
}

export interface IModel extends Optional<INullableAttr>, AutoGeneratedAttr {
  name: string;
}

export type IModelCreate = Omit<IModel, keyof AutoGeneratedAttr> & Partial<AutoGeneratedAttr>;

@Cache()
@Table({
  tableName: 'role',
  paranoid: true,
  indexes: [{ fields: ['name'], where: { deleted_at: null } }],
})
export class Role extends Model<IModel, IModelCreate> implements IModel {
  id: number;

  @AllowNull(false)
  @Column
    name: string;
}
