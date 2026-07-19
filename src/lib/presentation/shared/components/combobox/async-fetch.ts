export interface FetchParams {
  page: number;
  limit: number;
  q: string;
}

export interface PaginatedResult<T> {
  items: T[];
  hasNextPage: boolean;
}

export function createAsyncComboboxFetchFn<TParams, TResponse, TItem>({
  buildParams,
  queryFn
}: {
  buildParams: (input: FetchParams) => TParams;
  queryFn: (params: TParams) => Promise<TResponse>;
}) {
  return async (input: FetchParams): Promise<PaginatedResult<TItem>> => {
    const params = buildParams(input);
    const response = await queryFn(params);

    if (response && typeof response === 'object') {
      let items: TItem[] = [];
      const resObj = response as Record<string, unknown>;

      if ('items' in resObj && Array.isArray(resObj.items)) {
        items = resObj.items as TItem[];
      } else if ('data' in resObj && Array.isArray(resObj.data)) {
        items = resObj.data as TItem[];
      } else if (Array.isArray(response)) {
        items = response as TItem[];
      }

      let hasNextPage = false;
      if ('hasNextPage' in resObj) {
        hasNextPage = Boolean(resObj.hasNextPage);
      } else if ('hasMore' in resObj) {
        hasNextPage = Boolean(resObj.hasMore);
      } else if ('pagination' in resObj && resObj.pagination) {
        const pagination = resObj.pagination as Record<string, unknown>;
        if ('hasNextPage' in pagination) {
          hasNextPage = Boolean(pagination.hasNextPage);
        } else if ('total' in pagination && 'page' in pagination && 'limit' in pagination) {
          const total = Number(pagination.total);
          const page = Number(pagination.page);
          const limit = Number(pagination.limit);
          hasNextPage = page * limit < total;
        }
      }

      return { items, hasNextPage };
    }

    return { items: [], hasNextPage: false };
  };
}
