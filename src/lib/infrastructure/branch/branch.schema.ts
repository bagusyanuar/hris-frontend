import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';

export type BranchResponse = {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
};

export type BranchListResponse = ApiListResponse<BranchResponse>;

export interface BranchQuery extends PaginationSortQuery {
  search?: string;
  status?: string;
}

export type CreateBranchRequest = {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status: string;
};

export type UpdateBranchRequest = CreateBranchRequest;
