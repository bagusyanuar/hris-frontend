import type {
  IJobTitleRepository,
  JobTitleModel,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleParams
} from '$lib/core/job-title';
import type { PaginatedResult } from '$lib/core/shared';
import type { JobTitleResponse, JobTitleListResponse } from './job-title.schema';
import { JobTitleMapper } from './job-title.mapper';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class JobTitleRepositoryImpl implements IJobTitleRepository {
  private readonly basePath = '/v1/job-titles';

  async getAll(params: JobTitleParams): Promise<PaginatedResult<JobTitleModel>> {
    return handleAppError(async () => {
      const query = JobTitleMapper.toQuery(params);
      const response = await httpClient.get<JobTitleListResponse>(this.basePath, { params: query });
      return PaginationMapper.toResult(response, JobTitleMapper.toModel);
    });
  }

  async getById(id: string): Promise<JobTitleModel | null> {
    return handleAppError(async () => {
      const response = await httpClient.get<ApiResponse<JobTitleResponse>>(
        `${this.basePath}/${id}`
      );
      return JobTitleMapper.toModel(response.data);
    });
  }

  async create(input: CreateJobTitleInput): Promise<JobTitleModel> {
    return handleAppError(async () => {
      const request = JobTitleMapper.toCreateRequest(input);
      const response = await httpClient.post<ApiResponse<JobTitleResponse>>(this.basePath, request);
      return JobTitleMapper.toModel(response.data);
    });
  }

  async update(input: UpdateJobTitleInput): Promise<JobTitleModel> {
    return handleAppError(async () => {
      const request = JobTitleMapper.toUpdateRequest(input);
      const response = await httpClient.put<ApiResponse<JobTitleResponse>>(
        `${this.basePath}/${input.id}`,
        request
      );
      return JobTitleMapper.toModel(response.data);
    });
  }

  async delete(id: string): Promise<boolean> {
    return handleAppError(async () => {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    });
  }
}
