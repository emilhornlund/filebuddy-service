import { ArgumentMetadata } from '@nestjs/common';
import * as classValidator from 'class-validator';

import { ValidationFailedException } from '../exception';
import { ValidationTransformPipe } from './validation-transform.pipe';

describe('ValidationTransformPipe', () => {
  let validationTransformPipe: ValidationTransformPipe;

  beforeEach(() => {
    validationTransformPipe = new ValidationTransformPipe();
  });

  it('should validate and return the value if it is valid', async () => {
    const value = { prop: 'valid value' };
    const metatype = class {
      prop: string;
    }; // Create a mock metatype
    const metadata: ArgumentMetadata = { type: 'body', metatype, data: '' };

    // Mock the validate function to return an empty array
    jest.spyOn(classValidator, 'validate').mockResolvedValue([]);

    expect(await validationTransformPipe.transform(value, metadata)).toBe(
      value,
    );
  });

  it('should throw a ValidationFailedException if the value is not valid', async () => {
    const value = { prop: 'invalid value' };
    const metatype = class {
      prop: string;
    }; // Create a mock metatype
    const metadata: ArgumentMetadata = { type: 'body', metatype, data: '' };

    // Mock the validate function to return an array with errors
    const errors = [
      { property: 'prop', constraints: { isString: 'prop must be a string' } },
    ];
    jest.spyOn(classValidator, 'validate').mockResolvedValue(errors);

    await expect(
      validationTransformPipe.transform(value, metadata),
    ).rejects.toThrow(ValidationFailedException);
  });
});
