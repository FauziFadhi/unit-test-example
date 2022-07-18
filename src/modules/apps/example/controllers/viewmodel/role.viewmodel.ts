/* eslint-disable max-classes-per-file */
import { Expose } from 'class-transformer';

export class RoleVm {
  @Expose()
    id: number;

  @Expose()
    name: string;
}
