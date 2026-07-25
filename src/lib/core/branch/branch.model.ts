import type { PaginationSortParam } from '$lib/core/shared';

export interface BranchModel {
  id: string;
  companyId: string;
  code: string;
  name: string;
  city?: string;
  isMain: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBranchInput = {
  companyId: string;
  code: string;
  name: string;
  city?: string;
  isMain: boolean;
  isActive: boolean;
};

export type UpdateBranchInput = CreateBranchInput & {
  id: string;
};

export interface BranchParams extends PaginationSortParam {
  search?: string;
  isActive?: boolean | 'all';
}
