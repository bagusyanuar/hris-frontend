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

export interface DepartmentParams {
	search?: string;
	status?: DepartmentStatus | 'all';
}
