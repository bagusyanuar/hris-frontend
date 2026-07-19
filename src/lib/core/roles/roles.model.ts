import type { PaginationSortParam } from '$lib/core/shared';

export interface RoleModel {
  id: string;
  name: string;
  description?: string;
  permissions: string[]; // List of permission IDs
  createdAt?: string;
  updatedAt?: string;
}

export type CreateRoleInput = {
  name: string;
  description?: string;
  permissions: string[];
};

export type UpdateRoleInput = CreateRoleInput & {
  id: string;
};

export interface RoleParams extends PaginationSortParam {
  search?: string;
}
