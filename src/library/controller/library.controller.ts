import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Authorities, AuthoritiesDto } from '../../auth';

@ApiTags('Libraries')
@ApiBearerAuth()
@Authorities(AuthoritiesDto.LIBRARY_MANAGEMENT)
@Controller('libraries')
export class LibraryController {
  @Post()
  @HttpCode(HttpStatus.OK)
  public async createLibrary(): Promise<void> {
    return;
  }
}
