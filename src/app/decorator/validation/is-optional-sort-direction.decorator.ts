import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsOptional } from 'class-validator';

import { SortDirection } from '../../model/response/enum';

/**
 * Decorator that marks a property as an optional sort direction.
 * Validates that if the property is provided, its value must be one of the possible directions defined in `SortDirection`.
 *
 * Rules:
 * 1. The property value, if provided, should be one of the predefined values in the `SortDirection` enum (i.e., 'ASC' or 'DESC').
 * 2. The property is optional, meaning it can be omitted without causing a validation error. However, if it is provided, it must adhere to rule 1.
 *
 * @returns A set of decorators from `class-validator` that enforce the sort direction rules.
 *
 * @example
 * class MyDto {
 *   @IsOptionalSortDirection()
 *   direction?: SortDirection;
 * }
 */
export const IsOptionalSortDirection = () =>
  applyDecorators(IsEnum(SortDirection), IsOptional());
