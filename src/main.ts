import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app';

(async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableCors();
  app.use(helmet());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('FileBuddy Service')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Files')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api_docs', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get('HTTP_PORT');
  await app.listen(port);
})();
