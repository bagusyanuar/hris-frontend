import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';

export type JobPositionResponse = {
	id: string;
    name: string;
    department_id: string;
    department_name?: string;
    job_title_id: string;
    job_title_name?: string;
    parent_id: string | null;
    parent_name?: string;
    headcount_quota: number;
    description?: string;
    status: string;
	created_at?: string;
	updated_at?: string;
};

export type JobPositionListResponse = ApiListResponse<JobPositionResponse>;

export interface JobPositionQuery extends PaginationSortQuery {
	search?: string;
    department_id?: string;
    job_title_id?: string;
	status?: string;
}

export type CreateJobPositionRequest = {
    name: string;
    department_id: string;
    job_title_id: string;
    parent_id: string | null;
    headcount_quota: number;
    description?: string;
    status: string;
};

export type UpdateJobPositionRequest = CreateJobPositionRequest;
