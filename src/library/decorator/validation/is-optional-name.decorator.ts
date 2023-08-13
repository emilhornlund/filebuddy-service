import { applyDecorators } from '@nestjs/common';
import { IsOptional } from 'class-validator';

import { IsName } from './is-name.decorator';

/**
 * Decorator that marks a property as an optional name.
 * Validates the name using rules defined by the `IsName` decorator, but allows the property to be omitted.
 *
 * Rules:
 * 1. The property is optional, meaning it can be omitted without causing a validation error. However, if it is provided, it must adhere to the name validation rules specified by the `IsName` decorator.
 *
 * @returns A set of decorators that combine the rules from `IsName` and makes the name property optional.
 *
 * @example
 * class UpdateLibraryDto {
 *   @IsOptionalName()
 *   name?: string;
 * }
 */
export const IsOptionalName = () => applyDecorators(IsName(), IsOptional());
