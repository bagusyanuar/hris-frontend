import type { PaginationSortParam } from '$lib/core/shared';

export type BranchStatus = 'active' | 'inactive';

export interface BranchModel {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status: BranchStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBranchInput = {
  code: string;
  name: string;
  address?: string;
  phone?: string;
  status: BranchStatus;
};

export type UpdateBranchInput = CreateBranchInput & {
  id: string;
};

export interface BranchParams extends PaginationSortParam {
  search?: string;
  status?: BranchStatus | 'all';
}
