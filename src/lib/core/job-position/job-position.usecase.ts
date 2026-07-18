import type { PaginatedResult } from '$lib/core/shared';
import type { IJobPositionRepository } from './job-position.repository';
import type { JobPositionModel, CreateJobPositionInput, UpdateJobPositionInput, JobPositionParams } from './job-position.model';

export class JobPositionUseCase {
	constructor(private readonly repository: IJobPositionRepository) {}

	async getAll(params: JobPositionParams): Promise<PaginatedResult<JobPositionModel>> {
		return this.repository.getAll(params);
	}

	async getById(id: string): Promise<JobPositionModel | null> {
		return this.repository.getById(id);
	}

	async create(input: CreateJobPositionInput): Promise<JobPositionModel> {
		return this.repository.create(input);
	}

	async update(input: UpdateJobPositionInput): Promise<JobPositionModel> {
		return this.repository.update(input);
	}

	async delete(id: string): Promise<boolean> {
		return this.repository.delete(id);
	}
}
