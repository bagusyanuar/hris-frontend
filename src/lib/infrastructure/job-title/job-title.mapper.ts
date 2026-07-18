import type { JobTitleModel, CreateJobTitleInput, UpdateJobTitleInput, JobTitleParams, JobTitleStatus } from '$lib/core/job-title';
import type { JobTitleResponse, JobTitleQuery, CreateJobTitleRequest, UpdateJobTitleRequest } from './job-title.schema';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';

export class JobTitleMapper {
	static toModel(response: JobTitleResponse): JobTitleModel {
		return {
			id: response.id,
            code: response.code,
            name: response.name,
            description: response.description,
            status: response.status as JobTitleStatus,
			createdAt: response.created_at,
			updatedAt: response.updated_at
		};
	}

	static toQuery(params: JobTitleParams): JobTitleQuery {
		return {
			...PaginationMapper.toQuery(params),
			...(params.search && { search: params.search }),
            
			...(params.status && params.status !== 'all' && { status: params.status })
		};
	}

	static toCreateRequest(input: CreateJobTitleInput): CreateJobTitleRequest {
		return {
            code: input.code,
            name: input.name,
            description: input.description ?? undefined,
            status: input.status
		};
	}

	static toUpdateRequest(input: UpdateJobTitleInput): UpdateJobTitleRequest {
		return this.toCreateRequest(input);
	}
}
