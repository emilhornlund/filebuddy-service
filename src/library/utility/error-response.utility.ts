export interface ErrorResponseSchemaOptions {
  message: {
    example: string;
  };
  validationErrors?: {
    constraints: Record<string, string>;
    property: string;
  }[];
}

export interface SchemaObject {
  title: string;
  properties: Record<string, any>;
  required?: string[];
}

export const buildErrorResponseSchema = (
  options: ErrorResponseSchemaOptions,
): SchemaObject => ({
  title: 'ErrorResponse',
  properties: {
    message: {
      type: 'string',
      title: 'Message',
      description: 'Error message describing the nature of the error',
      example: options.message.example,
    },
    ...(options.validationErrors
      ? {
          validation_errors: {
            type: 'array',
            title: 'Validation errors',
            description: 'Array of validation errors',
            items: {
              properties: {
                constraints: {
                  type: 'object',
                  title: 'Constraints',
                  description: 'A set of validation constraints that failed',
                },
                property: {
                  type: 'string',
                  title: 'Property',
                  description: 'Property that has validation errors',
                },
              },
            },
            example: options.validationErrors,
          },
        }
      : {}),
    timestamp: {
      type: 'string',
      format: 'date-time',
      title: 'Timestamp',
      description: 'Timestamp when the error occurred',
    },
  },
  required: [
    'message',
    'timestamp',
    options.validationErrors ? 'validation_errors' : undefined,
  ].filter((property) => !!property),
});
