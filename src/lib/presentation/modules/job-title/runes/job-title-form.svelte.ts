import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateJobTitleSchema, UpdateJobTitleSchema } from '$lib/infrastructure/job-title';
import { JobTitleService } from '$lib/core/job-title';
import type { JobTitleModel, CreateJobTitleInput } from '$lib/core/job-title';

export function useJobTitleForm(
	onValid: (input: CreateJobTitleInput) => Promise<void>
) {
	const form = superForm<CreateJobTitleInput>(
		defaults(zod4(CreateJobTitleSchema)),
		{
			SPA: true,
			validators: zod4(CreateJobTitleSchema), // Initial schema, can be dynamically swapped if needed
			async onUpdate({ form: f }) {
				if (f.valid) await onValid(f.data);
			}
		}
	);

	function load(model: JobTitleModel | null) {
		if (model) {
			form.options.validators = zod4(UpdateJobTitleSchema);
			form.reset({ data: JobTitleService.toInput(model) });
		} else {
			form.options.validators = zod4(CreateJobTitleSchema);
			form.reset();
		}
	}

	return {
		...form,
		load
	};
}
