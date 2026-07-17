import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';
import type { AppError } from '$lib/core/errors/app-error';
import type {
	CreateDepartmentInput,
	DepartmentModel,
	DepartmentParams,
	UpdateDepartmentInput
} from '$lib/core/department';
import { provideDepartmentUseCase } from '$lib/infrastructure/department';
import { departmentKeys } from './department.keys';

type DepartmentListKey = ReturnType<typeof departmentKeys.list>;

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
		}
	}));
}

export function useUpdateDepartmentMutation() {
	const useCase = provideDepartmentUseCase();
	const queryClient = useQueryClient();

	return createMutation<DepartmentModel, AppError, UpdateDepartmentInput>(() => ({
		mutationFn: (input) => useCase.update(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: departmentKeys.all });
		}
	}));
}

export function useDeleteDepartmentMutation() {
	const useCase = provideDepartmentUseCase();
	const queryClient = useQueryClient();

	return createMutation<void, AppError, string>(() => ({
		mutationFn: (id) => useCase.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: departmentKeys.all });
		}
	}));
}
