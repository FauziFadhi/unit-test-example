import { Expose } from 'class-transformer';

export class UserViewModel {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  gender = 'F';

  @Expose()
  nationality = 'ID';
}
