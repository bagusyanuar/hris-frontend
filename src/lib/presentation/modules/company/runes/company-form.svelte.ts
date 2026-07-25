import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateCompanySchema, UpdateCompanySchema } from '$lib/infrastructure/company';
import { CompanyService } from '$lib/core/company';
import type { CompanyModel, CreateCompanyInput } from '$lib/core/company';

export function useCompanyForm(onValid: (input: CreateCompanyInput) => Promise<void>) {
  const form = superForm<CreateCompanyInput>(defaults(zod4(CreateCompanySchema)), {
    SPA: true,
    validators: zod4(CreateCompanySchema),
    async onUpdate({ form: f }) {
      if (f.valid) await onValid(f.data);
    }
  });

  function load(model: CompanyModel | null) {
    if (model) {
      form.options.validators = zod4(UpdateCompanySchema);
      form.reset({ data: CompanyService.toInput(model) });
    } else {
      form.options.validators = zod4(CreateCompanySchema);
      form.reset();
    }
  }

  return {
    ...form,
    load
  };
}
