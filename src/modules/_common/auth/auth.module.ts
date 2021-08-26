import { AuthConfigModule } from '@config/auth/config.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProviderService } from './provider.service';

@Module({
  imports: [AuthConfigModule, JwtModule],
  providers: [ProviderService],
})
export class AuthModule {}
