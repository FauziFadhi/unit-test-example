import { PermissionGuard } from '@_common/auth/guard/permissions.guard';
import { User } from '@models/core/User';
import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User as LoggedUser } from '@utils/decorators';
import { generateViewModel } from '@utils/helper';
import { ResponseInterceptor } from '@utils/interceptors';

import { UserViewModel } from '../viewmodel/user.viewmodel';

@UseGuards(AuthGuard(['anonym', 'auth']), PermissionGuard)
// @Permissions(PERMISSION.CAN_ADD_USER)
@Controller({ version: '1', path: 'user' })
export class UserController {
  @Get(':id')
  // @Permissions(PERMISSION.CAN_VIEW_USER)
  @UseInterceptors(new ResponseInterceptor('users'))
  async getUser(@Param('id', ParseIntPipe) id: number, @LoggedUser() loggedUser): Promise<UserViewModel> {
    const user = await User.findOne();

    return generateViewModel(UserViewModel, user);
  }
}
