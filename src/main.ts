import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { EcoModule } from './eco.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const environment = process.env.NODE_ENV || 'local';
  const envFile = path.resolve(__dirname, '../environment', `${environment}.env`);
  const envConfig = dotenv.parse(fs.readFileSync(envFile));

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });

  const app = await NestFactory.create(EcoModule, { cors: true });
  app.setGlobalPrefix('');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const options = new DocumentBuilder()
    .setTitle('Housekeeping identity Service')
    .setDescription('The Housekeeping identity API system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options, {
  });
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
