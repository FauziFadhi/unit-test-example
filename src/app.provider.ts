import { AppConfigModule } from '@config/app/config.module';
import { AuthConfigModule } from '@config/auth/config.module';
import { CacheConfigModule } from '@config/cache/config.module';
import { DBConfigModule } from '@config/database/config.module';

export const CONFIG_MODULES = [
  AppConfigModule,
  CacheConfigModule,
  DBConfigModule,
  AuthConfigModule,
];
