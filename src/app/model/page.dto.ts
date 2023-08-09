import { PaginationDto } from './pagination.dto';

/**
 * Interface for the generic page DTO.
 */
export interface IPageDto<T> {
  /** Array of results for the current page. */
  results: T[];

  /** Pagination details for the current page. */
  page: PaginationDto;
}

/**
 * Transforms an array of items of type `T` into a paginated data transfer object.
 *
 * @template T - The type of the individual items within the results array.
 *
 * @param results - An array of items for the current page of type `T`.
 * @param page - The current page number, starting from 1.
 * @param size - The number of items per page.
 * @param totalElements - The total number of items across all pages.
 *
 * @returns An `IPageDto` object containing the provided results and pagination details.
 */
export function toPageDto<T>(
  results: T[],
  page: number,
  size: number,
  totalElements: number,
): IPageDto<T> {
  return {
    results,
    page: {
      number: page,
      size,
      totalElements,
      totalPages: Math.ceil(totalElements / size),
    },
  };
}
