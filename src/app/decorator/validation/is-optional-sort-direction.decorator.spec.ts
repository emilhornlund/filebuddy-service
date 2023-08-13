import { validate } from 'class-validator';

import { SortDirection } from '../../model/response/enum';
import { IsOptionalSortDirection } from './is-optional-sort-direction.decorator';

class TestClass {
  @IsOptionalSortDirection()
  direction?: SortDirection;
}

describe('IsOptionalSortDirection decorator', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it('should validate a correct sort direction', async () => {
    testInstance.direction = SortDirection.ASC;
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);

    testInstance.direction = SortDirection.DESC;
    const errorsDesc = await validate(testInstance);
    expect(errorsDesc.length).toBe(0);
  });

  it('should not validate an incorrect sort direction', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    testInstance.direction = 'INVALID_DIRECTION'; // Ignoring TypeScript error for test purposes
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate when sort direction is omitted', async () => {
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });
});
