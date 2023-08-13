import { validate } from 'class-validator';

import { IsOptionalPageNumber } from './is-optional-page-number.decorator';

class TestClass {
  @IsOptionalPageNumber()
  pageNumber?: number;
}

describe('IsOptionalPageNumber', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it('should validate a positive integer', async () => {
    testInstance.pageNumber = 5;
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should validate 0 as a valid number', async () => {
    testInstance.pageNumber = 0;
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate negative numbers', async () => {
    testInstance.pageNumber = -1;
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate non-integer numbers', async () => {
    testInstance.pageNumber = 1.5;
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should consider the property optional', async () => {
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });
});
