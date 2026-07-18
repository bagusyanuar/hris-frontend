import type { PaginatedResult } from '$lib/core/shared';
import type { IJobTitleRepository } from './job-title.repository';
import type { JobTitleModel, CreateJobTitleInput, UpdateJobTitleInput, JobTitleParams } from './job-title.model';

export class JobTitleUseCase {
	constructor(private readonly repository: IJobTitleRepository) {}

	async getAll(params: JobTitleParams): Promise<PaginatedResult<JobTitleModel>> {
		return this.repository.getAll(params);
	}

	async getById(id: string): Promise<JobTitleModel | null> {
		return this.repository.getById(id);
	}

	async create(input: CreateJobTitleInput): Promise<JobTitleModel> {
		return this.repository.create(input);
	}

	async update(input: UpdateJobTitleInput): Promise<JobTitleModel> {
		return this.repository.update(input);
	}

	async delete(id: string): Promise<boolean> {
		return this.repository.delete(id);
	}
}
