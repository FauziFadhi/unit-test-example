import { Cache, Model } from 'base-repo';
import {
  AllowNull, Column, Table,
} from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

interface IModelOptional extends IUnfilledAtt {
  id: number;
}

interface IModel extends Partial<IModelOptional> {
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
  @AllowNull(false)
  @Column
    name: string;
}
