import { CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

import { TransformResponseInterceptor } from './transform-response.interceptor';

describe('TransformResponseInterceptor', () => {
  let interceptor: TransformResponseInterceptor<any>;
  let mockExecutionContext: any;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformResponseInterceptor],
    }).compile();

    interceptor = module.get<TransformResponseInterceptor<any>>(
      TransformResponseInterceptor,
    );

    mockExecutionContext = {
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    mockCallHandler = {
      handle: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform response data keys to snake_case', (done) => {
    const testResponseData = {
      someKey: {
        anotherKey: 'value',
        yetAnotherKey: [
          {
            nestedKey: 'value',
          },
        ],
      },
    };

    const expectedTransformedResponseData = {
      some_key: {
        another_key: 'value',
        yet_another_key: [
          {
            nested_key: 'value',
          },
        ],
      },
    };

    // Mock the CallHandler to return the test data when handle() is called
    mockCallHandler.handle = jest.fn().mockReturnValue(of(testResponseData));

    // Call the interceptor
    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((transformedData) => {
        // Expect the data to be transformed to snake_case
        expect(transformedData).toEqual(expectedTransformedResponseData);
        done();
      });
  });

  it('should transform array of objects keys to snake_case', (done) => {
    const testResponseData = [
      {
        someKey: 'value',
        anotherKey: {
          nestedKey: 'value',
        },
      },
      {
        someKey: 'value',
        anotherKey: {
          nestedKey: 'value',
        },
      },
    ];

    const expectedTransformedResponseData = [
      {
        some_key: 'value',
        another_key: {
          nested_key: 'value',
        },
      },
      {
        some_key: 'value',
        another_key: {
          nested_key: 'value',
        },
      },
    ];

    // Mock the CallHandler to return the test data when handle() is called
    mockCallHandler.handle = jest.fn().mockReturnValue(of(testResponseData));

    // Call the interceptor
    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((transformedData) => {
        // Expect the data to be transformed to snake_case
        expect(transformedData).toEqual(expectedTransformedResponseData);
        done();
      });
  });

  it('should transform nested array of objects keys to snake_case', (done) => {
    const testResponseData = {
      someKey: [
        {
          nestedKey: 'value',
          anotherNestedKey: {
            innerKey: 'value',
          },
        },
      ],
    };

    const expectedTransformedResponseData = {
      some_key: [
        {
          nested_key: 'value',
          another_nested_key: {
            inner_key: 'value',
          },
        },
      ],
    };

    // Mock the CallHandler to return the test data when handle() is called
    mockCallHandler.handle = jest.fn().mockReturnValue(of(testResponseData));

    // Call the interceptor
    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((transformedData) => {
        // Expect the data to be transformed to snake_case
        expect(transformedData).toEqual(expectedTransformedResponseData);
        done();
      });
  });

  it('should convert Date objects to ISO strings', (done) => {
    const date = new Date();
    const isoDate = date.toISOString();

    const testResponseData = {
      someKey: date,
      anotherKey: {
        nestedKey: date,
      },
      yetAnotherKey: [
        {
          nestedKey: date,
        },
      ],
    };

    const expectedTransformedResponseData = {
      some_key: isoDate,
      another_key: {
        nested_key: isoDate,
      },
      yet_another_key: [
        {
          nested_key: isoDate,
        },
      ],
    };

    // Mock the CallHandler to return the test data when handle() is called
    mockCallHandler.handle = jest.fn().mockReturnValue(of(testResponseData));

    // Call the interceptor
    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((transformedData) => {
        // Expect the data to be transformed to snake_case and dates converted to ISO strings
        expect(transformedData).toEqual(expectedTransformedResponseData);
        done();
      });
  });
});
