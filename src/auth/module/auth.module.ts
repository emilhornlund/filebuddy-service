import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';

import { AuthController } from '../controller';
import { AuthGuard } from '../guard';
import { AuthService } from '../service';

/**
 * Asynchronously reads the contents of a file.
 *
 * @param filePath The path of the file to read.
 *
 * @returns A promise that resolves with the contents of the file,
 * or `undefined` if the file does not exist or no filePath is provided.
 */
const readFile = async (filePath?: string): Promise<Buffer | undefined> => {
  if (!filePath || !fs.existsSync(filePath)) {
    return undefined;
  }
  return fs.readFileSync(filePath);
};

/**
 * Defines a module that provides everything necessary for authentication.
 *
 * @decorator @Module()
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECURITY_JWT_SECRET'),
        publicKey: await readFile(
          configService.get<string>('SECURITY_JWT_PUBLIC_KEY'),
        ),
        privateKey: await readFile(
          configService.get<string>('SECURITY_JWT_PRIVATE_KEY'),
        ),
        signOptions: {
          algorithm: 'HS512',
          audience: configService.get<string>('NODE_ENV'),
          issuer: configService.get<string>('SECURITY_JWT_ISSUER'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
  ],
})
export class AuthModule {}
