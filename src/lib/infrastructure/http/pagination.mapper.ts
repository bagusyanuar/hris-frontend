import type { PaginatedResult, PaginationSortParam } from '$lib/core/shared';
import type { ApiListResponse, PaginationSortQuery } from './types';

export class PaginationMapper {
  /**
   * Maps Core PaginationParams into Infrastructure PaginationQuery (snake_case)
   */
  static toQuery(params?: PaginationSortParam): PaginationSortQuery {
    if (!params) return {};

    return {
      ...(params.page && { page: params.page }),
      ...(params.limit && { limit: params.limit }),
      ...(params.sort?.trim() && { sort_by: params.sort.trim() }),
      ...(params.order && { sort_order: params.order })
    };
  }

  /**
   * Maps Infrastructure ApiListResponse (with meta) into Core PaginatedResult
   */
  static toResult<TResponse, TDomain>(
    response: ApiListResponse<TResponse>,
    domainMapper: (item: TResponse) => TDomain
  ): PaginatedResult<TDomain> {
    return {
      page: response.meta.page,
      perPage: response.meta.limit,
      total: response.meta.total_data,
      items: response.data.map(domainMapper)
    };
  }
}
