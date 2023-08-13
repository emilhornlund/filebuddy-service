import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsOptional } from 'class-validator';

import { LibrarySortOrder } from '../../model/enum';

/**
 * Decorator that marks a property as an optional sort order for libraries.
 * Validates that if the property is provided, its value must be one of the possible sort orders defined in `LibrarySortOrder`.
 *
 * Rules:
 * 1. The property value, if provided, should be one of the predefined values in the `LibrarySortOrder` enum.
 * 2. The property is optional, meaning it can be omitted without causing a validation error. However, if it is provided, it must adhere to rule 1.
 *
 * @returns A set of decorators from `class-validator` that enforce the sort order rules.
 *
 * @example
 * class MyDto {
 *   @IsOptionalSortOrder()
 *   sortOrder?: LibrarySortOrder;
 * }
 */
export const IsOptionalSortOrder = () =>
  applyDecorators(IsEnum(LibrarySortOrder), IsOptional());
