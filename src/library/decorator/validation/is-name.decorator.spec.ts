import { validate } from 'class-validator';

import { IsName } from './is-name.decorator';

class TestNameClass {
  @IsName()
  name: string;
}

describe('IsName decorator', () => {
  let testInstance: TestNameClass;

  beforeEach(() => {
    testInstance = new TestNameClass();
  });

  it('should validate a correct name', async () => {
    testInstance.name = 'John_Doe';
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate an empty name', async () => {
    testInstance.name = '';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a name with special characters', async () => {
    testInstance.name = 'John$Doe!';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a name longer than 20 characters', async () => {
    testInstance.name = 'ThisNameIsWayTooLongForThisTest';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });
});
