import { Global, Module } from '@nestjs/common';

import { AuthCommonModule } from './auth/auth.module';

@Global()
@Module({
  imports: [AuthCommonModule],
  exports: [AuthCommonModule],
})
export class CommonModule {}
