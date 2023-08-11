import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Authorities, AuthoritiesDto } from '../../auth';
import {
  ApiLibraryCreateOperation,
  ApiLibraryForbiddenResponse,
  ApiLibraryPathConflictResponse,
  ApiLibraryUnauthorizedResponse,
  ApiLibraryValidationFailedResponse,
} from '../decorator';
import { CreateLibraryRequest } from '../model/request';
import { LibraryResponse } from '../model/response';
import { LibraryService } from '../service';

/**
 * The `LibraryController` class defines the API routes associated with libraries.
 * It exposes an endpoint for creating new libraries and may be expanded with additional
 * endpoints for other library-related operations in the future.
 *
 * @remarks
 * This controller requires bearer authentication and is tagged under 'Libraries' for API documentation.
 * Access is restricted to roles having `LIBRARY_MANAGEMENT` authority.
 */
@ApiTags('Libraries')
@ApiBearerAuth()
@Authorities(AuthoritiesDto.LIBRARY_MANAGEMENT)
@Controller('libraries')
export class LibraryController {
  /**
   * Constructs a new `LibraryController` instance.
   *
   * @param libraryService - The service responsible for executing library-related operations.
   */
  constructor(private libraryService: LibraryService) {}

  /**
   * Endpoint to create a new library.
   *
   * @param createLibraryDto - The DTO containing the data for the new library.
   * @returns A promise that resolves to the created `LibraryDto`.
   */
  @ApiLibraryCreateOperation()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The library was successfully created.',
    type: () => LibraryResponse,
  })
  @ApiLibraryValidationFailedResponse()
  @ApiLibraryUnauthorizedResponse()
  @ApiLibraryForbiddenResponse()
  @ApiLibraryPathConflictResponse()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createLibraryDto: CreateLibraryRequest,
  ): Promise<LibraryResponse> {
    return this.libraryService.create(
      createLibraryDto.name,
      createLibraryDto.path,
    );
  }
}
