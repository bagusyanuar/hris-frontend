import type { PaginationSortParam } from '$lib/core/shared';
import type { BranchModel } from '../branch/branch.model';

export interface CompanyModel {
  id: string;
  code: string;
  legalName: string;
  npwp?: string;
  bpjsNo?: string;
  isActive: boolean;
  branches: BranchModel[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCompanyInput = {
  code: string;
  legalName: string;
  npwp?: string;
  bpjsNo?: string;
  isActive: boolean;
};

export type UpdateCompanyInput = CreateCompanyInput & {
  id: string;
};

export interface CompanyParams extends PaginationSortParam {
  search?: string;
  isActive?: boolean | 'all';
}
