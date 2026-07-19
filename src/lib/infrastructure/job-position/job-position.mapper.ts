import type {
  JobPositionModel,
  CreateJobPositionInput,
  UpdateJobPositionInput,
  JobPositionParams,
  JobPositionStatus
} from '$lib/core/job-position';
import type {
  JobPositionResponse,
  JobPositionQuery,
  CreateJobPositionRequest,
  UpdateJobPositionRequest
} from './job-position.schema';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';

export class JobPositionMapper {
  static toModel(response: JobPositionResponse): JobPositionModel {
    return {
      id: response.id,
      name: response.name,
      departmentId: response.department_id,
      departmentName: response.department_name,
      jobTitleId: response.job_title_id,
      jobTitleName: response.job_title_name,
      parentId: response.parent_id,
      parentName: response.parent_name,
      headcountQuota: response.headcount_quota,
      description: response.description,
      status: response.status as JobPositionStatus,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  static toQuery(params: JobPositionParams): JobPositionQuery {
    return {
      ...PaginationMapper.toQuery(params),
      ...(params.search && { search: params.search }),
      ...(params.departmentId && { department_id: params.departmentId }),
      ...(params.jobTitleId && { job_title_id: params.jobTitleId }),
      ...(params.status && params.status !== 'all' && { status: params.status })
    };
  }

  static toCreateRequest(input: CreateJobPositionInput): CreateJobPositionRequest {
    return {
      name: input.name,
      department_id: input.departmentId,
      job_title_id: input.jobTitleId,
      parent_id: input.parentId,
      headcount_quota: input.headcountQuota,
      description: input.description ?? undefined,
      status: input.status
    };
  }

  static toUpdateRequest(input: UpdateJobPositionInput): UpdateJobPositionRequest {
    return this.toCreateRequest(input);
  }
}
