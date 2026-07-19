import type { PaginationSortParam } from '$lib/core/shared';

export type JobTitleStatus = 'active' | 'inactive';

export interface JobTitleModel {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: JobTitleStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateJobTitleInput = {
  code: string;
  name: string;
  description?: string;
  status: JobTitleStatus;
};

export type UpdateJobTitleInput = CreateJobTitleInput & {
  id: string;
};

export interface JobTitleParams extends PaginationSortParam {
  search?: string;
  status?: JobTitleStatus | 'all';
}
