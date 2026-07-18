import type { JobTitleModel, CreateJobTitleInput, UpdateJobTitleInput } from './job-title.model';

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
}
