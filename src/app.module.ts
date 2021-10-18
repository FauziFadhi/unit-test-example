import { ExampleModule } from '@apps/example/example.module';
import { AuthConfigModule } from '@config/auth/config.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppsModule } from 'modules/apps/apps.module';
import { S3Module } from 'modules/middleware/s3/s3.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/app/config.module';
import { CacheConfigModule } from './config/cache/config.module';
import { DBConfigModule } from './config/database/config.module';
import { CommonModule } from './modules/_common/common.module';
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
    ExampleModule,
    S3Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
