import type { PaginationSortParam } from '$lib/core/shared';

export type JobPositionStatus = 'active' | 'inactive';

export interface JobPositionModel {
	id: string;
	name: string;
	departmentId: string;
	departmentName?: string;
	jobTitleId: string;
	jobTitleName?: string;
	parentId: string | null;
	parentName?: string;
	headcountQuota: number;
	description?: string;
	status: JobPositionStatus;
	createdAt?: string;
	updatedAt?: string;
}

export type CreateJobPositionInput = {
	name: string;
	departmentId: string;
	jobTitleId: string;
	parentId: string | null;
	headcountQuota: number;
	description?: string;
	status: JobPositionStatus;
};

export type UpdateJobPositionInput = CreateJobPositionInput & {
	id: string;
};

export interface JobPositionParams extends PaginationSortParam {
	search?: string;
	departmentId?: string;
	jobTitleId?: string;
	status?: JobPositionStatus | 'all';
}
