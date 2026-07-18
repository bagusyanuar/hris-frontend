import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { AppError } from '$lib/core/errors/app-error';
import type {
	CreateDepartmentInput,
	DepartmentModel,
	DepartmentParams,
	UpdateDepartmentInput
} from '$lib/core/department';
import { provideDepartmentUseCase } from '$lib/infrastructure/department';
import { toast } from '$lib/presentation/shared/components/toast';
import { departmentKeys } from './department.keys';

type DepartmentListKey = ReturnType<typeof departmentKeys.list>;

/** Delete needs the department name for its success toast, so it carries both. */
type DeleteDepartmentVariables = { id: string; name: string };

function toastError(err: AppError) {
	toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useDepartmentsQuery(params?: () => DepartmentParams | undefined) {
	const useCase = provideDepartmentUseCase();

	return createQuery<DepartmentModel[], AppError, DepartmentModel[], DepartmentListKey>(() => ({
		queryKey: departmentKeys.list(params?.()),
		queryFn: () => useCase.getAll(params?.())
	}));
}

export function useCreateDepartmentMutation() {
	const useCase = provideDepartmentUseCase();
	const queryClient = useQueryClient();

	return createMutation<DepartmentModel, AppError, CreateDepartmentInput>(() => ({
		mutationFn: (input) => useCase.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: departmentKeys.all });
			toast.success('Departemen ditambahkan');
		},
		onError: toastError
	}));
}

export function useUpdateDepartmentMutation() {
	const useCase = provideDepartmentUseCase();
	const queryClient = useQueryClient();

	return createMutation<DepartmentModel, AppError, UpdateDepartmentInput>(() => ({
		mutationFn: (input) => useCase.update(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: departmentKeys.all });
			toast.success('Departemen diperbarui');
		},
		onError: toastError
	}));
}

export function useDeleteDepartmentMutation() {
	const useCase = provideDepartmentUseCase();
	const queryClient = useQueryClient();

	return createMutation<void, AppError, DeleteDepartmentVariables>(() => ({
		mutationFn: ({ id }) => useCase.delete(id),
		onSuccess: (_data, { name }) => {
			queryClient.invalidateQueries({ queryKey: departmentKeys.all });
			toast.success(`"${name}" dihapus`);
		},
		onError: toastError
	}));
}
