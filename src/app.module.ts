import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { AppsModule } from './modules/apps/apps.module';
import { CmsModule } from './modules/cms/cms.module';
import { CommonModule } from './modules/_common/common.module';
import { AppConfigModule } from './config/app/config.module';
import { CacheConfigModule } from './config/cache/config.module';
import { DBConfigModule } from './config/database/config.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AppsModule,
    CmsModule,
    CommonModule,
    AppConfigModule,
    CacheConfigModule,
    DBConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
