import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginRequest } from './request/login.request';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {

  }

  @Post('login')
  async login(@Body() body: LoginRequest) {
    return this.authService.login(body);
  }
}
