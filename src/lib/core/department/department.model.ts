export type DepartmentStatus = 'active' | 'inactive';

export interface DepartmentModel {
	id: string;
	code: string;
	name: string;
	parentId: string | null;
	description?: string;
	status: DepartmentStatus;
	managerName?: string;
	managerAvatar?: string;
	employeeCount?: number;
	children?: DepartmentModel[];
}

export interface CreateDepartmentInput {
	code: string;
	name: string;
	parentId: string | null;
	description?: string;
	status: DepartmentStatus;
}

export interface UpdateDepartmentInput extends CreateDepartmentInput {
	id: string;
}

export interface DepartmentParams {
	search?: string;
	status?: DepartmentStatus | 'all';
}
