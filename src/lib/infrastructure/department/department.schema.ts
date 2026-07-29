import type { PaginationSortQuery } from '../http/types';

export interface DepartmentResponse {
  id: string;
  code: string;
  name: string;
  parent_id: string | null;
  description?: string;
  status: 'active' | 'inactive' | 'restructuring' | 'hiring' | 'planning' | 'growing';
  manager_name?: string;
  manager_avatar?: string;
  employee_count?: number;
}

export interface DepartmentRequest {
  code: string;
  name: string;
  parent_id: string | null;
  description?: string;
  status: 'active' | 'inactive' | 'restructuring' | 'hiring' | 'planning' | 'growing';
}

export interface DepartmentQuery extends PaginationSortQuery {
  search?: string;
  status?: 'active' | 'inactive' | 'restructuring' | 'hiring' | 'planning' | 'growing' | 'all';
}
