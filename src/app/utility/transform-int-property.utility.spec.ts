import { plainToClass } from 'class-transformer';

import { TransformIntProperty } from './transform-int-property.utility';

describe('TransformIntProperty', () => {
  class TestClass {
    @TransformIntProperty()
    public value: number;
  }

  it('should transform a numeric string to an integer', () => {
    const instance = plainToClass(TestClass, { value: '1234' });
    expect(instance.value).toBe(1234);
  });

  it('should return NaN for non-numeric strings', () => {
    const instance = plainToClass(TestClass, { value: 'abc' });
    expect(Number.isNaN(instance.value)).toBe(true);
  });

  it('should handle non-string values by attempting conversion', () => {
    const instanceWithBoolean = plainToClass(TestClass, { value: true });
    expect(instanceWithBoolean.value).toBe(NaN);

    const instanceWithNumber = plainToClass(TestClass, { value: 1234.56 });
    expect(instanceWithNumber.value).toBe(1234);

    const instanceWithNull = plainToClass(TestClass, { value: null });
    expect(Number.isNaN(instanceWithNull.value)).toBe(true);

    const instanceWithUndefined = plainToClass(TestClass, { value: undefined });
    expect(Number.isNaN(instanceWithUndefined.value)).toBe(true);
  });
});
