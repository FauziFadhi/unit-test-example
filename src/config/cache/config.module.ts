import { CacheModule, CACHE_MANAGER, Inject, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheConfigProvider } from './config.provider';
import config from './config';
import { RepositoryModule } from 'base-repo';
import { Store } from 'cache-manager';
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
      defaultTTL: 1000, // DEFINE TTL FOR ALL PROJECT millisecond
      callbackGet: async ({ key }) => {
        return CacheConfigModule.store.get(key); // DEFINE HOW TO GET CACHE FROM GIVEN KEY
      },
      callbackInvalidate: ({ key }) => {
        return CacheConfigModule.store.del(key); // DEFINE HOW TO INVALIDATE CACHE FROM GIVEN KEY
      },
      callbackSet: async ({ key, value, ttl }) => {
        return CacheConfigModule.store.set(key, value, { ttl: ttl }); // DEFINE HOW TO SET CACHE FROM GIVEN KEY VALUE AND TTL
      },
      callbackGetKey: async ({ keyPattern }) => {
        return CacheConfigModule.store.keys(keyPattern);
      },
    }),
  ],
})
export class CacheConfigModule {
  static store: Store;

  constructor(@Inject(CACHE_MANAGER) private store: Store) {
    CacheConfigModule.store = this.store;
  }
}
