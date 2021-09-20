import { Cache, Model } from 'base-repo';
import { AllowNull, Column, Default, Table } from 'sequelize-typescript';
import { IUnfilledAtt } from 'utils/base-class/base.interface';

interface IModelOptional {
  id: number;
}

interface IModel extends Partial<IUnfilledAtt>, Partial<IModelOptional> {
  name: string;
}

export type IModelCreate = Omit<IModel, 'id'> & Partial<IModelOptional>;

@Cache()
@Table({
  tableName: 'role',
  indexes: [{ fields: ['is_deleted', 'name'] }],
})
export class Role extends Model<IModel, IModelCreate> implements IModel {
  @AllowNull(false)
  @Column
  name: string;

  @Default(false)
  @Column
  isDeleted: boolean;
}
