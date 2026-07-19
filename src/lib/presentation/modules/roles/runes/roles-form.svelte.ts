import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { CreateRoleSchema, UpdateRoleSchema } from '$lib/infrastructure/roles';
import { RolesService } from '$lib/core/roles';
import type { RoleModel, CreateRoleInput } from '$lib/core/roles';

export function useRolesForm(onValid: (input: CreateRoleInput) => Promise<void>) {
  const form = superForm<CreateRoleInput>(defaults(zod4(CreateRoleSchema)), {
    SPA: true,
    validators: zod4(CreateRoleSchema),
    async onUpdate({ form: f }) {
      if (f.valid) await onValid(f.data);
    }
  });

  function load(model: RoleModel | null) {
    if (model) {
      form.options.validators = zod4(UpdateRoleSchema);
      form.reset({ data: RolesService.toInput(model) });
    } else {
      form.options.validators = zod4(CreateRoleSchema);
      form.reset();
    }
  }

  return {
    ...form,
    load
  };
}
