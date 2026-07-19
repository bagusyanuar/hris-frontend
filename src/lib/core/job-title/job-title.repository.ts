import type { PaginatedResult } from '$lib/core/shared';
import type {
  JobTitleModel,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleParams
} from './job-title.model';

export interface IJobTitleRepository {
  getAll(params: JobTitleParams): Promise<PaginatedResult<JobTitleModel>>;
  getById(id: string): Promise<JobTitleModel | null>;
  create(input: CreateJobTitleInput): Promise<JobTitleModel>;
  update(input: UpdateJobTitleInput): Promise<JobTitleModel>;
  delete(id: string): Promise<boolean>;
}
