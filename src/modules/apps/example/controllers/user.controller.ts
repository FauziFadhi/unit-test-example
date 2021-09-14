import { User } from '@models/core/User';
import {
  Controller, Get, Param, ParseIntPipe, UseInterceptors,
} from '@nestjs/common';
import { generateViewModel } from '@utils/helper';
import { ResponseInterceptor } from '@utils/interceptors';
import { UserViewModel } from '../viewmodel/user.viewmodel';

@Controller({ version: '1', path: 'user' })
export class UserController {
  @Get(':id')
  // @UseInterceptors(new ResponseInterceptor('users'))
  async getUser(@Param('id', ParseIntPipe) id: string): Promise<UserViewModel> {
    const user = await User.findOne();

    return generateViewModel(UserViewModel, user);
  }
}
