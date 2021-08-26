import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { circularToJSON } from '@utils/helper';
import { hash } from 'bcrypt';
import * as fs from 'fs';

@Injectable()
export class ProviderService {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken({
    payload,
    key,
    audience,
    expiresIn = this.authConfigService.defaultExpireTime,
    issuer = this.configService.get('app.name'),
    expirationType = 's',
  }: {
    payload: any & { userId: number; userLoginId: number; username: string };
    key: string;
    audience: string;
    expiresIn: number;
    issuer: string;
    expirationType: 'd' | 's' | 'm';
  }): Promise<{ expiresIn: number; token: string }> {
    const { algorithm } = this.authConfigService;
    const secret = this.getKeyFile(key);
    const payloadJson = circularToJSON(payload);
    const expirationTime = `${expiresIn}${expirationType}`;
    const sessionPayload = this.sessionPayload(audience, payload);
    const sid = hash(sessionPayload, 8);

    const token = this.jwtService.sign(
      { ...payloadJson, sid },
      {
        secret,
        algorithm: algorithm as any,
        audience,
        expiresIn: expirationTime,
        issuer,
      },
    );

    return { expiresIn, token };
  }

  getKeyFile(filename: string) {
    const fileRoute = this.authConfigService.keyFolderPath;
    const filePath = `${fileRoute}${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('file secret not found');
    }

    return fs.readFileSync(filePath);
  }

  sessionPayload(audience: string, { userId, username, userLoginId }) {
    const appName = this.configService.get('app.name');
    return `${appName}${audience}${userId}${username}${userLoginId}`;
  }
}
