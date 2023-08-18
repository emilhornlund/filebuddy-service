import { ApiOperation } from '@nestjs/swagger';

/**
 * Provides an API operation decorator for the creation of a new library.
 *
 * This decorator describes the endpoint that allows users to create a new library in the system.
 * It details the expected input format, potential status codes, and conditions for errors.
 *
 * @returns {Function} An ApiOperation decorator configured for the library creation operation.
 */
export const ApiLibraryCreateOperation = () =>
  ApiOperation({
    summary: 'Creates a new library.',
    description: `Allows the creation of a new library in the system. This endpoint expects the payload to contain the name and the path to the library. Successful operations will result in the creation of the library and a 201 status code being returned. 

- If the provided data doesn't match the expected format, or if mandatory fields are missing, a 400 status code (Bad Request) will be returned.
- For security, accessing this endpoint requires a \`LIBRARY_MANAGEMENT\` authority. If not present, a 403 status code (Forbidden) will be returned.
- Should no bearer token be provided or if an invalid token is supplied, a 401 status code (Unauthorized) will be returned.
- If a library with the provided path already exists, a 409 status code (Conflict) will be returned.`,
  });
