/**
 * Enumeration representing the possible authorities that a user can have.
 */
export enum AuthoritiesDto {
  /** The authority to manage files */
  FILE_MANAGEMENT = 'FILE_MANAGEMENT',
  /** The authority to manage libraries */
  LIBRARY_MANAGEMENT = 'LIBRARY_MANAGEMENT',
  /** The authority to refresh tokens */
  REFRESH = 'REFRESH',
}
