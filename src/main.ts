import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { install } from 'source-map-support';

import { AppModule } from './app.module';

async function bootstrap() {
  install();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    credentials: false,
  });

  await app.listen(3000);
}
bootstrap();
