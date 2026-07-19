import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateJobPositionSchema, UpdateJobPositionSchema } from '$lib/infrastructure/job-position';
import { JobPositionService } from '$lib/core/job-position';
import type { JobPositionModel } from '$lib/core/job-position';
import type { z } from 'zod';

export function useJobPositionForm(
  onValid: (input: z.infer<typeof CreateJobPositionSchema> & { id?: string }) => Promise<void>
) {
  const form = superForm(defaults(zod4(CreateJobPositionSchema)), {
    SPA: true,
    validators: zod4(CreateJobPositionSchema), // Initial schema, can be dynamically swapped if needed
    async onUpdate({ form: f, cancel }) {
      if (!f.valid) return cancel();
      await onValid(f.data);
    }
  });

  function load(model: JobPositionModel | null) {
    if (model) {
      form.options.validators = zod4(UpdateJobPositionSchema);
      form.reset({ data: JobPositionService.toInput(model) });
    } else {
      form.options.validators = zod4(CreateJobPositionSchema);
      form.reset();
    }
  }

  return {
    ...form,
    load
  };
}
