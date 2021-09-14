import { IModelCreate as ICreateUser } from '@models/core/User';
import { IModelCreate as ICreateUserLogin } from '@models/core/UserLogin';

export type ICreateUserAccount = ICreateUser & ICreateUserLogin;
