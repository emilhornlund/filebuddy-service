import { validate } from 'class-validator';

import { IsOptionalPageSize } from './is-optional-page.size.decorator';

class TestClass {
  @IsOptionalPageSize()
  pageSize?: number;
}

describe('IsOptionalPageSize decorator', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it('should validate a correct page size', async () => {
    testInstance.pageSize = 10;
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate a negative page size', async () => {
    testInstance.pageSize = -5;
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a page size greater than 50', async () => {
    testInstance.pageSize = 51;
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate when page size is omitted', async () => {
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate a non-integer page size', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    testInstance.pageSize = 5.5; // Ignoring TypeScript error for test purposes
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });
});
