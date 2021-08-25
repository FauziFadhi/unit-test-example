import { CacheModule, CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { CacheConfigService } from 'config/cache.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryModule } from 'base-repo';

import { Store } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { SequelizeCoreConfigService } from 'config/database/database-core.config';
import { AppsModule } from './modules/apps/apps.module';
import { CmsModule } from './modules/cms/cms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    SequelizeModule.forRootAsync({ useClass: SequelizeCoreConfigService }),
    RepositoryModule.forRoot({
      defaultTTL: 1000, // DEFINE TTL FOR ALL PROJECT millisecond
      callbackGet: async ({ key }) => {
        return AppModule.cacheStoreManager.get(key); // DEFINE HOW TO GET CACHE FROM GIVEN KEY
      },
      callbackInvalidate: ({ key }) => {
        return AppModule.cacheStoreManager.del(key); // DEFINE HOW TO INVALIDATE CACHE FROM GIVEN KEY
      },
      callbackSet: async ({ key, value, ttl }) => {
        return AppModule.cacheStoreManager.set(key, value, { ttl: ttl }); // DEFINE HOW TO SET CACHE FROM GIVEN KEY VALUE AND TTL
      },
      callbackGetKey: async ({ keyPattern }) => {
        return AppModule.cacheStoreManager.keys(keyPattern);
      },
    }),
    AppsModule,
    CmsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static configService: ConfigService;
  static cacheStoreManager: Store;

  constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheStoreManager: Store,
  ) {
    AppModule.configService = this.configService;
    AppModule.cacheStoreManager = this.cacheStoreManager;
  }
}
