import { applyDecorators } from '@nestjs/common';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

import {
  MAXIMUM_PAGE_NUMBER,
  MINIMUM_PAGE_NUMBER,
} from '../../utility/page-constants.utility';

/**
 * Decorator that marks a property as an optional page number.
 * Validates that the property is an integer, is optional, has a minimum value of `MINIMUM_PAGE_NUMBER`, and a maximum value of `MAXIMUM_PAGE_NUMBER`.
 *
 * Rules:
 * 1. The property should be an integer. Non-integer values are considered invalid.
 * 2. The property value should be between `MINIMUM_PAGE_NUMBER` and `MAXIMUM_PAGE_NUMBER` inclusive. Values outside this range are considered invalid.
 * 3. The property is optional, meaning it can be omitted without causing a validation error. However, if it is provided, it must adhere to rules 1 and 2.
 *
 * @returns A set of decorators from `class-validator` that enforce the page number rules.
 *
 * @example
 * class MyDto {
 *   @IsOptionalPageNumber()
 *   pageNumber?: number;
 * }
 */
export const IsOptionalPageNumber = () =>
  applyDecorators(
    IsInt(),
    Min(MINIMUM_PAGE_NUMBER),
    Max(MAXIMUM_PAGE_NUMBER),
    IsOptional(),
  );
