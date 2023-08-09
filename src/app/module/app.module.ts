import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import { AuthModule } from '../../auth';
import { FileModule } from '../../file';
import { LibraryModule } from '../../library';
import { AllExceptionsFilter } from '../filter';
import {
  TransformRequestInterceptor,
  TransformResponseInterceptor,
} from '../interceptor';
import { ValidationTransformPipe } from '../pipe';

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
        DB_TYPE: Joi.string().valid('sqlite').default('sqlite'),
        DB_DATABASE: Joi.string().required(),
        DB_SYNCHRONIZE: Joi.bool().default(false),
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
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: configService.get<'sqlite'>('DB_TYPE'),
        database: configService.get<string>('DB_DATABASE'),
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    FileModule,
    LibraryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformRequestInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationTransformPipe,
    },
  ],
})
export class AppModule {}
