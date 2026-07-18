import type { IJobPositionRepository, JobPositionModel, CreateJobPositionInput, UpdateJobPositionInput, JobPositionParams } from '$lib/core/job-position';
import type { PaginatedResult } from '$lib/core/shared';
import type { JobPositionResponse, JobPositionListResponse } from './job-position.schema';
import { JobPositionMapper } from './job-position.mapper';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class JobPositionRepositoryImpl implements IJobPositionRepository {
	private readonly basePath = '/v1/job-positions';

	async getAll(params: JobPositionParams): Promise<PaginatedResult<JobPositionModel>> {
		return handleAppError(async () => {
			const query = JobPositionMapper.toQuery(params);
			const response = await httpClient.get<JobPositionListResponse>(this.basePath, { params: query });
			return PaginationMapper.toResult(response, JobPositionMapper.toModel);
		});
	}

	async getById(id: string): Promise<JobPositionModel | null> {
		return handleAppError(async () => {
			const response = await httpClient.get<ApiResponse<JobPositionResponse>>(`${this.basePath}/${id}`);
			return JobPositionMapper.toModel(response.data);
		});
	}

	async create(input: CreateJobPositionInput): Promise<JobPositionModel> {
		return handleAppError(async () => {
			const request = JobPositionMapper.toCreateRequest(input);
			const response = await httpClient.post<ApiResponse<JobPositionResponse>>(this.basePath, request);
			return JobPositionMapper.toModel(response.data);
		});
	}

	async update(input: UpdateJobPositionInput): Promise<JobPositionModel> {
		return handleAppError(async () => {
			const request = JobPositionMapper.toUpdateRequest(input);
			const response = await httpClient.put<ApiResponse<JobPositionResponse>>(`${this.basePath}/${input.id}`, request);
			return JobPositionMapper.toModel(response.data);
		});
	}

	async delete(id: string): Promise<boolean> {
		return handleAppError(async () => {
			await httpClient.delete(`${this.basePath}/${id}`);
			return true;
		});
	}
}
