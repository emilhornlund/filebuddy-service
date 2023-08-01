import { IPageDto } from '../../app';
import { FileDto } from './file.dto';

/**
 * A DTO for pages that contain FileDto results.
 */
export type FilePageDto = IPageDto<FileDto>;
