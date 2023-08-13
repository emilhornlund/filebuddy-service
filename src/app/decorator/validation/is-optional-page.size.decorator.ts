import { applyDecorators } from '@nestjs/common';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import {
  MAXIMUM_PAGE_SIZE,
  MINIMUM_PAGE_SIZE,
} from '../../utility/page-constants.utility';

/**
 * Decorator that marks a property as an optional page size.
 * Validates that the property is an integer, is optional, has a minimum value of `MINIMUM_PAGE_SIZE`, and a maximum value of `MAXIMUM_PAGE_SIZE`.
 *
 * Rules:
 * 1. The property should be an integer. Non-integer values are considered invalid.
 * 2. The property value should be between `MINIMUM_PAGE_SIZE` and `MAXIMUM_PAGE_SIZE` inclusive. Values outside this range are considered invalid.
 * 3. The property is optional, meaning it can be omitted without causing a validation error. However, if it is provided, it must adhere to rules 1 and 2.
 *
 * @returns A set of decorators from `class-validator` that enforce the page size rules.
 *
 * @example
 * class MyDto {
 *   @IsOptionalPageSize()
 *   pageSize?: number;
 * }
 */
export const IsOptionalPageSize = () =>
  applyDecorators(
    IsInt(),
    Min(MINIMUM_PAGE_SIZE),
    Max(MAXIMUM_PAGE_SIZE),
    IsOptional(),
  );
