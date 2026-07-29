import type { PaginationSortParam } from '$lib/core/shared';

export type DepartmentStatus = 'active' | 'inactive' | 'restructuring' | 'hiring' | 'planning' | 'growing';

export interface DepartmentModel {
  id: string;
  code: string;
  name: string;
  parentId: string | null;
  parentName?: string;
  description?: string;
  status: DepartmentStatus;
  managerName?: string;
  managerAvatar?: string;
  employeeCount?: number;
  children?: DepartmentModel[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateDepartmentInput = {
  code: string;
  name: string;
  parentId: string | null;
  description?: string;
  status: DepartmentStatus;
};

export type UpdateDepartmentInput = CreateDepartmentInput & {
  id: string;
};

export interface DepartmentParams extends PaginationSortParam {
  search?: string;
  status?: DepartmentStatus | 'all';
}
