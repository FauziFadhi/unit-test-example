import { Default } from '@utils/helper';
import { Expose } from 'class-transformer';

export class UserViewModel {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Default('F')
  @Expose()
  gender: string;

  @Default('ID')
  @Expose()
  nationality: string;
}
