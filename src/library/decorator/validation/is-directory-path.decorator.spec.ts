import { validate } from 'class-validator';

import { IsDirectoryPath } from './is-directory-path.decorator';

class TestDirectoryPathClass {
  @IsDirectoryPath()
  path: string;
}

describe('IsDirectoryPath decorator', () => {
  let testInstance: TestDirectoryPathClass;

  beforeEach(() => {
    testInstance = new TestDirectoryPathClass();
  });

  it('should validate a correct directory path', async () => {
    testInstance.path = '/home/user/directory_name';
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });

  it('should not validate an empty path', async () => {
    testInstance.path = '';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a path not starting with a `/`', async () => {
    testInstance.path = 'home/user/directory_name';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a path with special characters other than allowed', async () => {
    testInstance.path = '/home/user/directory$name';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate a path that ends with a filename with extension', async () => {
    testInstance.path = '/home/user/directory/file.txt';
    const errors = await validate(testInstance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should validate a path that ends with a filename without extension', async () => {
    testInstance.path = '/home/user/directory/file';
    const errors = await validate(testInstance);
    expect(errors.length).toBe(0);
  });
});
