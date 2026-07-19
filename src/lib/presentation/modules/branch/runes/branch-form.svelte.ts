import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateBranchSchema, UpdateBranchSchema } from '$lib/infrastructure/branch';
import { BranchService } from '$lib/core/branch';
import type { BranchModel, CreateBranchInput } from '$lib/core/branch';

export function useBranchForm(onValid: (input: CreateBranchInput) => Promise<void>) {
  const form = superForm<CreateBranchInput>(defaults(zod4(CreateBranchSchema)), {
    SPA: true,
    validators: zod4(CreateBranchSchema),
    async onUpdate({ form: f }) {
      if (f.valid) await onValid(f.data);
    }
  });

  function load(model: BranchModel | null) {
    if (model) {
      form.options.validators = zod4(UpdateBranchSchema);
      form.reset({ data: BranchService.toInput(model) });
    } else {
      form.options.validators = zod4(CreateBranchSchema);
      form.reset();
    }
  }

  return {
    ...form,
    load
  };
}
