export interface DepartmentResponse {
	id: string;
	code: string;
	name: string;
	parent_id: string | null;
	description?: string;
	status: 'active' | 'inactive';
}

export interface DepartmentRequest {
	code: string;
	name: string;
	parent_id: string | null;
	description?: string;
	status: 'active' | 'inactive';
}

export interface DepartmentQuery {
	search?: string;
	status?: 'active' | 'inactive' | 'all';
}
