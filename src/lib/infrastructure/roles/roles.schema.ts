import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';

export type RoleResponse = {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
};

export type RoleListResponse = ApiListResponse<RoleResponse>;

export interface RoleQuery extends PaginationSortQuery {
  search?: string;
}

export type CreateRoleRequest = {
  name: string;
  description?: string;
  permissions: string[];
};

export type UpdateRoleRequest = CreateRoleRequest;
