import { User } from '@models/core/User';
import { UserLogin } from '@models/core/UserLogin';
import { Injectable } from '@nestjs/common';
import { AUTH } from '@utils/constant';
import { generateViewModel } from '@utils/helper';
import { hash } from 'bcrypt';
import { Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ICreateUserAccount } from '../interface/user.interface';
import { UserViewModel } from '../viewmodel/user.viewmodel';

@Injectable()
export class UserService {
  constructor(
    private readonly sequelize: Sequelize,
  ) {

  }

  async createUser(dto: ICreateUserAccount, transaction1?: Transaction) {
    return this.sequelize.transaction({ transaction: transaction1 }, async (transaction) => {
      const password = await hash(dto.password, AUTH.PAYLOAD_ALGORITHM);
      await UserLogin.create({ ...dto, password }, { transaction });

      const user = await User.create(dto, { transaction });

      return generateViewModel(UserViewModel, user);
    });
  }
}
