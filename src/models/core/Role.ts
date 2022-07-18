import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Table,
} from 'sequelize-typescript';
import { IUnfilledAtt, Optional } from '@utils/base-class/base.interface';

type IModelOptional = IUnfilledAtt;

interface IModel extends Optional<IModelOptional> {
  id: number;
  name: string;
}

export type IModelCreate = Omit<IModel, 'id'>;

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
