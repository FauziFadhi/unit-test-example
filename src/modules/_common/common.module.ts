import { Module } from '@nestjs/common';

import { AuthCommonModule } from './auth/auth.module';

@Module({
  imports: [AuthCommonModule],
  exports: [],
})
export class CommonModule {}
