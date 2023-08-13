import { validate } from 'class-validator';

import { LibrarySortOrder } from '../../model/enum';
import { IsOptionalSortOrder } from './is-optional-sort-order.decorator';

class TestClass {
  @IsOptionalSortOrder()
  sortOrder?: LibrarySortOrder;
}

describe('IsOptionalSortOrder decorator', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it('should validate a correct sort order', async () => {
    testInstance.sortOrder = LibrarySortOrder.NAME;
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate an incorrect sort order', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    testInstance.sortOrder = 'INVALID_ORDER'; // Ignoring TypeScript error for test purposes
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate when sort order is omitted', async () => {
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });
});
