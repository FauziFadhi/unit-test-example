import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import CONST from '@utils/constant';
import { circularToJSON } from '@utils/helper';
import { hash } from 'bcrypt';
import * as fs from 'fs';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly authConfigService: AuthConfigService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * get token
   * @param param0
   * @returns Promise<{ expiresIn: number; token: string }>
   */
  async createToken({
    payload,
    key,
    audience,
    expiresIn = this.authConfigService.defaultExpireTime,
    issuer = this.configService.get('app.name'),
    expirationType = 's',
  }: {
    payload: { userId: number; userLoginId: number; username: string } & any;
    key: string;
    audience: string;
    expiresIn?: number;
    issuer?: string;
    expirationType?: 'd' | 's' | 'm';
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
        audience: await this.encrypt(audience),
        expiresIn: expirationTime,
        issuer,
      },
    );

    return { expiresIn, token };
  }

  /**
   * encrypt data based on auth config
   * @param text
   * @returns
   */
  async encrypt(text: string): Promise<string> {
    try {
      const crypto = await import('crypto');
      const constAuth = CONST.auth;
      const key = crypto.scryptSync(
        constAuth.PAYLOAD_PASSWORD,
        constAuth.PAYLOAD_SALT,
        constAuth.PAYLOAD_SALT_ROUND,
      );

      const iv = Buffer.alloc(16, 0); // Initialization vector.
      const cipher = crypto.createCipheriv(constAuth.PAYLOAD_ALGORITHM, key, iv);

      return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * get key of auth
   * @param filename
   * @returns
   */
  getKeyFile(filename: string): Buffer {
    const fileRoute = this.authConfigService.keyFolderPath;
    const filePath = `${fileRoute}${filename}`;

    if (!fs.existsSync(filePath)) {
      throw new InternalServerErrorException('file secret not found');
    }

    return fs.readFileSync(filePath);
  }

  sessionPayload(
    audience: string,
    { userId, username, userLoginId }: { userId: number, username: string, userLoginId: number },
  )
    : string {
    const appName = this.configService.get('app.name');
    return `${appName}${audience}${userId}${username}${userLoginId}`;
  }
}
