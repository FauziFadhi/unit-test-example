import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './service/role.service';

@Module({
  providers: [UserService, RoleService],
  controllers: [UserController, RoleController],
})
export class ExampleModule {}
