import {
  CACHE_MANAGER, CacheModule, Inject, Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RepositoryModule } from 'base-repo';
import { Store } from 'cache-manager';

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
    RepositoryModule.forRoot({
      defaultTTL: 5, // DEFINE TTL FOR ALL PROJECT seconds
      // DEFINE HOW TO GET CACHE FROM GIVEN KEY
      callbackGet: async ({ key }) => CacheConfigModule.store.get(key),
      // DEFINE HOW TO INVALIDATE CACHE FROM GIVEN KEY
      callbackInvalidate: ({ key }) => CacheConfigModule.store.del(key),
      // DEFINE HOW TO SET CACHE FROM GIVEN KEY VALUE AND TTL
      callbackSet: async ({ key, value, ttl }) => CacheConfigModule.store.set(key, value, { ttl }),
      callbackGetKey: async ({ keyPattern }) => CacheConfigModule.store.keys(`${process.env.CACHE_PREFIX}${keyPattern}`),
    }),
  ],
  exports: [CacheModule],
})
export class CacheConfigModule {
  static store: Store;

  constructor(@Inject(CACHE_MANAGER) private store: Store) {
    CacheConfigModule.store = this.store;
  }
}
