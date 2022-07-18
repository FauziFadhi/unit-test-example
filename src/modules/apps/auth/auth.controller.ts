import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginRequest } from './request/login.request';
import { LoginVm, TestVm } from './viewmodel/login.viewmodel';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {

  }

  @Post('login')
  async login(@Body() body: LoginRequest): Promise<LoginVm | TestVm> {
    return this.authService.login(body) as any;
  }
}
