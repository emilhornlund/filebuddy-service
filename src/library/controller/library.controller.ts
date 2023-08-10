import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Authorities, AuthoritiesDto } from '../../auth';
import { CreateLibraryDto, LibraryDto } from '../model';
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
  @ApiOperation({
    summary: 'Create a new library',
    description:
      'Accepts a library name and path, and creates a new library resource.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'The library was successfully created. Returns the created library data.',
    type: LibraryDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Validation failed. One or more input properties are incorrect or missing.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'The provided library path is not unique. A library with the same path already exists.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() createLibraryDto: CreateLibraryDto,
  ): Promise<LibraryDto> {
    return this.libraryService.create(
      createLibraryDto.name,
      createLibraryDto.path,
    );
  }
}
