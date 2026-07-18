import type { PaginatedResult } from '$lib/core/shared';
import type { JobPositionModel, CreateJobPositionInput, UpdateJobPositionInput, JobPositionParams } from './job-position.model';

export interface IJobPositionRepository {
	getAll(params: JobPositionParams): Promise<PaginatedResult<JobPositionModel>>;
	getById(id: string): Promise<JobPositionModel | null>;
	create(input: CreateJobPositionInput): Promise<JobPositionModel>;
	update(input: UpdateJobPositionInput): Promise<JobPositionModel>;
	delete(id: string): Promise<boolean>;
}
