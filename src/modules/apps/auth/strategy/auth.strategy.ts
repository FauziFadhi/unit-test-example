import { AuthConfigService } from '@config/auth/config.provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import CONST from '@utils/constant';
import * as fs from 'fs';
import { AuthProvider } from 'modules/_common/auth/provider.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy, 'auth') {
  constructor(
    private readonly authProvider: AuthProvider,
    private readonly authConfig: AuthConfigService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: authConfig.algorithm,
      audience: authProvider.encrypt(CONST.auth.AUDIENCE_APP),
      issuer: configService.get('app.name'),
      secretOrKey: fs.readFileSync(`${authConfig.keyFolderPath}${authConfig.public}`),
    });
  }

  async validate(payload: any) {
    // const validation : ILoggedUser = await this.authService.validateLoggedUser(payload);
    // if (isEmpty(validation)) {
    // throw new UnauthorizedException();
    // }

    // return validation;
  }
}
