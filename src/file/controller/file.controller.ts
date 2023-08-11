import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Authorities, AuthoritiesDto } from '../../auth';
import { FileIdParam } from '../model/param';
import { FileQuery } from '../model/query';
import { FileResponse, PagedFileResponse } from '../model/response';
import { FileService } from '../service';

/**
 * Controller responsible for handling file operations.
 * The FileController is decorated with the @Controller decorator at the class level,
 * with 'files' as the route path prefix for all methods in this controller.
 *
 * The @ApiTags decorator is used for grouping routes in the Swagger UI, and @ApiBearerAuth is
 * used to specify that these routes are protected and require a bearer token for access.
 */
@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  /**
   * Constructs a new instance of the FileController,
   * initializing it with an instance of the FileService.
   *
   * @param fileService - An instance of the FileService to be used for file operations
   */
  constructor(private fileService: FileService) {}

  /**
   * Returns a paginated list of files based on the provided query parameters.
   * @param fileQuery - Query parameters including page, size, sort order, sort direction, and name filter
   * @returns A Promise that resolves to a PagedFileResponse object representing a page of files
   */
  @ApiOperation({ summary: '', description: '' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
    type: PagedFileResponse,
  })
  @Authorities(AuthoritiesDto.FILE_MANAGEMENT)
  @HttpCode(HttpStatus.OK)
  @Get()
  public async findAll(
    @Query() fileQuery: FileQuery,
  ): Promise<PagedFileResponse> {
    return this.fileService.findAll(
      fileQuery.page,
      fileQuery.size,
      fileQuery.order,
      fileQuery.direction,
      fileQuery.name,
    );
  }

  /**
   * Returns the file with the specified ID.
   * @param fileIdParam - An object containing the ID of the file to retrieve
   * @returns A Promise that resolves to a FileResponse object representing the retrieved file
   */
  @ApiOperation({ summary: '', description: '' })
  @ApiResponse({ status: HttpStatus.OK, description: '', type: FileResponse })
  @Authorities(AuthoritiesDto.FILE_MANAGEMENT)
  @HttpCode(HttpStatus.OK)
  @Get(':fileId')
  public async findById(
    @Param() fileIdParam: FileIdParam,
  ): Promise<FileResponse> {
    return this.fileService.findById(fileIdParam.fileId);
  }
}
