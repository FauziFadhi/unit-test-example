import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'uauth') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      algorithms: configService.get('JWT_ALGORITHM'),
      audience: authService.encrypt(AUTH_AUDIENCE_USERAPP),
      issuer: configService.get('JWT_ALGORITHM'),
      secretOrKey: fs.readFileSync(
        `${configService.get('JWT_KEY_FOLDER')}
        ${configService.get('JWT_USER_PUBLIC_KEY')}`,
      ),
    });
  }

  async validate(payload: any) {
    const validation: ILoggedUser = await this.authService.validateLoggedUser(
      payload,
    );
    if (isEmpty(validation)) {
      throw new UnauthorizedException();
    }

    return validation;
  }
}
