import type { PaginationSortQuery, ApiListResponse } from '$lib/infrastructure/http/types';

export type JobTitleResponse = {
	id: string;
    code: string;
    name: string;
    description?: string;
    status: string;
	created_at?: string;
	updated_at?: string;
};

export type JobTitleListResponse = ApiListResponse<JobTitleResponse>;

export interface JobTitleQuery extends PaginationSortQuery {
	search?: string;
    
	status?: string;
}

export type CreateJobTitleRequest = {
    code: string;
    name: string;
    description?: string;
    status: string;
};

export type UpdateJobTitleRequest = CreateJobTitleRequest;
