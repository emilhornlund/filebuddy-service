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

    expect(await validationTransformPipe.transform(value, metadata)).toEqual(
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

  it('should return the original value when metatype is not provided', async () => {
    const value = { prop: 'value without metatype' };
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: null,
      data: '',
    };

    const result = await validationTransformPipe.transform(value, metadata);

    expect(result).toEqual(value);
  });

  it('should return the original value when metatype is a basic type', async () => {
    const value = 'value with basic metatype';
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: String,
      data: '',
    };

    const result = await validationTransformPipe.transform(value, metadata);

    expect(result).toEqual(value);
  });

  it('should throw a ValidationFailedException if the class-validator validate function throws an error', async () => {
    const value = { prop: 'value that causes validate to throw' };
    const metatype = class {
      prop: string;
    };
    const metadata: ArgumentMetadata = { type: 'body', metatype, data: '' };

    jest
      .spyOn(classValidator, 'validate')
      .mockRejectedValue(new Error('Mock error'));

    await expect(
      validationTransformPipe.transform(value, metadata),
    ).rejects.toThrow(ValidationFailedException);
  });
});
