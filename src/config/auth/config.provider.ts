import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private readonly configService: ConfigService) {}

  get algorithm(): string {
    return this.configService.get<string>('auth.JWT_ALGORITHM');
  }

  get keyFolderPath(): string {
    return this.configService.get<string>('auth.JWT_KEY_FOLDER');
  }

  get defaultExpireTime(): number {
    return this.configService.get<number>('auth.JWT_DEFAULT_EXPIRE_TIME');
  }

  get secret(): string {
    return this.configService.get<string>('auth.JWT_SECRET_KEY');
  }

  get public(): string {
    return this.configService.get<string>('auth.JWT_PUBLIC_KEY');
  }
}
