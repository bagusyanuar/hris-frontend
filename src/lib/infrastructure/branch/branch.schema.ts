import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';

export type BranchResponse = {
  id: string;
  company_id: string;
  code: string;
  name: string;
  city?: string;
  is_main: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type BranchListResponse = ApiListResponse<BranchResponse>;

export interface BranchQuery extends PaginationSortQuery {
  search?: string;
  is_active?: boolean;
}

export type CreateBranchRequest = {
  code: string;
  name: string;
  city?: string;
  is_main: boolean;
  is_active: boolean;
};

export type UpdateBranchRequest = CreateBranchRequest;
