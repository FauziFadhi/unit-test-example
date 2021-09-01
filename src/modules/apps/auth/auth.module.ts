import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtStrategy } from './strategy/auth.strategy';

@Module({
  imports: [],
  providers: [AuthService, AuthJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
