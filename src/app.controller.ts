import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Authorities, AuthoritiesDto } from './auth';

@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Authorities(AuthoritiesDto.HELLO_WORLD)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
