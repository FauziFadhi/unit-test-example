import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class AnonymStrategy extends PassportStrategy(Strategy, 'anonym') {
  authenticate() {
    this.pass();
  }
}
