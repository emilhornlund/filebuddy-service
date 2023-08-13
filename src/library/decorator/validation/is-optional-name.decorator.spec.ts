import { validate } from 'class-validator';

import { IsOptionalName } from './is-optional-name.decorator';

class TestOptionalNameClass {
  @IsOptionalName()
  name?: string;
}

describe('IsOptionalName decorator', () => {
  let testInstance: TestOptionalNameClass;

  beforeEach(() => {
    testInstance = new TestOptionalNameClass();
  });

  it('should validate a correct optional name', async () => {
    testInstance.name = 'Jane_Doe';
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should validate when name is omitted', async () => {
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate an incorrect optional name', async () => {
    testInstance.name = 'Jane$Doe!';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });
});
