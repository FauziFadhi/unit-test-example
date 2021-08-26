import { AuthConfigModule } from '@config/auth/config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { CacheConfigModule } from './config/cache/config.module';
import { DBConfigModule } from './config/database/config.module';
import { ProviderService } from './modules/_common/auth/provider.service';
import { CommonModule } from './modules/_common/common.module';
import { AppsModule } from './modules/apps/apps.module';
import { CmsModule } from './modules/cms/cms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppsModule,
    CmsModule,
    CommonModule,
    AppConfigModule,
    CacheConfigModule,
    DBConfigModule,
    AuthConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProviderService],
})
export class AppModule {}
