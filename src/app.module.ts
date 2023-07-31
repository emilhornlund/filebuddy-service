import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth';
import {
  TransformRequestInterceptor,
  TransformResponseInterceptor,
} from './interceptors';

const DEFAULT_ENVIRONMENT = 'development';

/**
 * The root module of the application. It imports other modules,
 * sets up global configuration, and registers application-wide providers.
 *
 * @decorator @Module()
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV ?? DEFAULT_ENVIRONMENT}.env`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default(DEFAULT_ENVIRONMENT),
        HTTP_PORT: Joi.number().default(8080),
        SECURITY_JWT_SECRET: Joi.string(),
        SECURITY_JWT_PUBLIC_KEY: Joi.string(),
        SECURITY_JWT_PRIVATE_KEY: Joi.string(),
        SECURITY_JWT_ISSUER: Joi.string().default('filebuddy'),
        SECURITY_JWT_ACCESS_EXPIRES_IN: Joi.alternatives(
          Joi.string(),
          Joi.number(),
        ).default('15m'),
        SECURITY_JWT_REFRESH_EXPIRES_IN: Joi.alternatives(
          Joi.string(),
          Joi.number(),
        ).default('30d'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      expandVariables: true,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformRequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
