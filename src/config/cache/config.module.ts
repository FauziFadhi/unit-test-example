import {
  CACHE_MANAGER, CacheModule, Inject, Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeCacheModule } from 'base-repo';
import { Store } from 'cache-manager';
import { CacheService } from './cache.service';

import config from './config';
import { CacheConfigProvider } from './config.provider';
import schema from './schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: schema,
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigProvider,
    }),
    SequelizeCacheModule.register({
      defaultTTL: 5, // DEFINE TTL FOR ALL PROJECT seconds
      // DEFINE HOW TO GET CACHE FROM GIVEN KEY
      callbackGet: async ({ key }) => CacheConfigModule.store.get(key),
      // DEFINE HOW TO INVALIDATE CACHE FROM GIVEN KEY
      callbackInvalidate: ({ key }) => (CacheConfigModule?.store?.del?.(key) || null),
      // DEFINE HOW TO SET CACHE FROM GIVEN KEY VALUE AND TTL
      callbackSet: async ({ key, value, ttl }) => CacheConfigModule.store.set(key, value, { ttl }),
      callbackGetKey: async ({ keyPattern }) => CacheConfigModule.store.keys?.(`${process.env.CACHE_PREFIX}${keyPattern}`) || [],
    }),
  ],
  providers: [CacheService],
  exports: [CacheModule, CacheService],
})
export class CacheConfigModule {
  static store: Store;

  constructor(@Inject(CACHE_MANAGER) private store: Store) {
    CacheConfigModule.store = this.store;
  }
}
