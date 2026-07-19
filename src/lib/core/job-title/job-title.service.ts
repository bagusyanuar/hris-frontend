import type { JobTitleModel, UpdateJobTitleInput } from './job-title.model';

export class JobTitleService {
	static toInput(model: JobTitleModel): UpdateJobTitleInput {
		return {
			id: model.id,
			code: model.code,
			name: model.name,
			description: model.description,
			status: model.status
		};
	}

	static getStats(jobTitles: JobTitleModel[]) {
		const total = jobTitles.length;
		const active = jobTitles.filter((j) => j.status === 'active').length;
		const inactive = total - active;
		const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);

		return {
			total,
			active,
			inactive,
			activePercentage
		};
	}

	static filter(
		jobTitles: JobTitleModel[],
		filters: { search: string; status: 'all' | 'active' | 'inactive' }
	): JobTitleModel[] {
		return jobTitles.filter((jobTitle) => {
			const matchSearch =
				!filters.search ||
				jobTitle.name.toLowerCase().includes(filters.search.toLowerCase()) ||
				jobTitle.code.toLowerCase().includes(filters.search.toLowerCase());

			const matchStatus = filters.status === 'all' || jobTitle.status === filters.status;

			return matchSearch && matchStatus;
		});
	}
}
