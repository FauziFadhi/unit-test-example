import { Injectable } from '@nestjs/common';
import { AUTH } from '@utils/constant';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await hash(password, AUTH.PAYLOAD_SALT_ROUND);

    return hashedPassword;
  }
}
