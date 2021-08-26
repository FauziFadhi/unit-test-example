import { Injectable } from '@nestjs/common';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import config from './config';

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor() { }
  createSequelizeOptions(): SequelizeModuleOptions {
    return config;
  }
}
