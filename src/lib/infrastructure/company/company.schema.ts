import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';
import type { BranchResponse } from '../branch/branch.schema';

export type CompanyResponse = {
  id: string;
  code: string;
  legal_name: string;
  npwp?: string;
  bpjs_no?: string;
  is_active: boolean;
  branches?: BranchResponse[];
  created_at?: string;
  updated_at?: string;
};

export type CompanyListResponse = ApiListResponse<CompanyResponse>;

export interface CompanyQuery extends PaginationSortQuery {
  search?: string;
  is_active?: boolean;
}

export type CreateCompanyRequest = {
  code: string;
  legal_name: string;
  npwp?: string;
  bpjs_no?: string;
  is_active: boolean;
};

export type UpdateCompanyRequest = CreateCompanyRequest;
