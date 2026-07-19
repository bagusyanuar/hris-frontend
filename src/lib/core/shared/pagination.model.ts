export interface PaginationParam {
  page: number;
  limit: number;
}

export interface PaginationSortParam extends PaginationParam {
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  page: number;
  perPage: number;
  total: number;
  items: T[];
}
