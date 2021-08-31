import { Module } from '@nestjs/common';
import { AuthCommonModule } from 'modules/_common/auth/auth.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [AuthCommonModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
