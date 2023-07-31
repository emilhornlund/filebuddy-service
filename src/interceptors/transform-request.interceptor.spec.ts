import { CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TransformRequestInterceptor } from './transform-request.interceptor';

describe('TransformRequestInterceptor', () => {
  let interceptor: TransformRequestInterceptor;
  let mockExecutionContext: any;
  let mockCallHandler: CallHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransformRequestInterceptor],
    }).compile();

    interceptor = module.get<TransformRequestInterceptor>(
      TransformRequestInterceptor,
    );

    // Mock execution context
    const mockRequest = {
      body: {},
    };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn(),
        getNext: jest.fn(),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };

    // Mock call handler
    mockCallHandler = {
      handle: jest.fn().mockReturnValue({
        pipe: jest.fn(),
      }),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should transform request payload keys to camelCase', async () => {
    const testPayload = {
      some_key: {
        another_key: 'value',
        yet_another_key: [
          {
            nested_key: 'value',
          },
        ],
      },
    };

    const expectedTransformedPayload = {
      someKey: {
        anotherKey: 'value',
        yetAnotherKey: [
          {
            nestedKey: 'value',
          },
        ],
      },
    };

    // Set the request body to be the test payload
    mockExecutionContext.switchToHttp().getRequest.mockReturnValue({
      body: testPayload,
    });

    // Call the interceptor
    await interceptor.intercept(mockExecutionContext, mockCallHandler);

    // Expect the payload to be transformed to camelCase
    expect(mockExecutionContext.switchToHttp().getRequest().body).toEqual(
      expectedTransformedPayload,
    );
  });
});
