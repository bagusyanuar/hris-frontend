import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { DepartmentService, type CreateDepartmentInput, type DepartmentModel } from '$lib/core/department';
import { CreateDepartmentSchema } from '$lib/infrastructure/department/department.validator';

/**
 * SPA superForm untuk form Departemen (create/update).
 *
 * Harus dipanggil sinkron di top-level script komponen — superForm memakai
 * lifecycle Svelte (onDestroy) di balik layar.
 *
 * @param onValid dipanggil dengan data yang sudah lolos validasi Zod saat submit.
 * @returns objek superForm ditambah `load(department)` untuk populate/reset.
 */
export function useDepartmentForm(onValid: (input: CreateDepartmentInput) => void | Promise<void>) {
	const sf = superForm<CreateDepartmentInput>(defaults(zod4(CreateDepartmentSchema)), {
		SPA: true,
		validators: zod4(CreateDepartmentSchema),
		async onUpdate({ form }) {
			if (form.valid) await onValid(form.data);
		}
	});

	return {
		...sf,
		/**
		 * Populate form dari department (edit), atau reset ke default Zod (create).
		 * Mapping Model -> Input hidup di Core (DepartmentService.toInput). `reset` juga
		 * membersihkan errors & tainted — bukan sekadar overwrite data.
		 */
		load: (department: DepartmentModel | null) =>
			sf.reset(department ? { data: DepartmentService.toInput(department) } : undefined)
	};
}
