import type { PaginationSortQuery } from '../http/types';

export interface DepartmentResponse {
	id: string;
	code: string;
	name: string;
	parent_id: string | null;
	description?: string;
	status: 'active' | 'inactive';
	manager_name?: string;
	manager_avatar?: string;
	employee_count?: number;
}

export interface DepartmentRequest {
	code: string;
	name: string;
	parent_id: string | null;
	description?: string;
	status: 'active' | 'inactive';
}

export interface DepartmentQuery extends PaginationSortQuery {
	search?: string;
	status?: 'active' | 'inactive' | 'all';
}
