import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideJobTitleUseCase } from '$lib/infrastructure/job-title';
import type { JobTitleParams, CreateJobTitleInput, UpdateJobTitleInput, JobTitleModel } from '$lib/core/job-title';
import type { AppError } from '$lib/core/errors/app-error';
import { toast } from '$lib/presentation/shared/components/toast';
import { jobTitleKeys } from './job-title.keys';

function toastError(err: AppError) {
	toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useJobTitleQueries() {
	const useCase = provideJobTitleUseCase();
	const queryClient = useQueryClient();

	function getJobTitles(params: JobTitleParams | (() => JobTitleParams)) {
		return createQuery(() => {
			const currentParams = typeof params === 'function' ? params() : params;
			return {
				queryKey: jobTitleKeys.list(currentParams),
				queryFn: () => useCase.getAll(currentParams),
				placeholderData: (prev) => prev
			};
		});
	}

	function getJobTitle(id: string | (() => string)) {
		return createQuery(() => {
			const currentId = typeof id === 'function' ? id() : id;
			return {
				queryKey: jobTitleKeys.detail(currentId),
				queryFn: () => useCase.getById(currentId),
				enabled: !!currentId
			};
		});
	}

	const createMutationFn = createMutation(() => ({
		mutationFn: (input: CreateJobTitleInput) => useCase.create(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobTitleKeys.lists() });
			toast.success('Jabatan berhasil ditambahkan');
		},
		onError: toastError
	}));

	const updateMutationFn = createMutation(() => ({
		mutationFn: (input: UpdateJobTitleInput) => useCase.update(input),
		onSuccess: (data: JobTitleModel) => {
			queryClient.invalidateQueries({ queryKey: jobTitleKeys.lists() });
			queryClient.invalidateQueries({ queryKey: jobTitleKeys.detail(data.id) });
			toast.success('Jabatan berhasil diperbarui');
		},
		onError: toastError
	}));

	const deleteMutationFn = createMutation(() => ({
		mutationFn: (id: string) => useCase.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: jobTitleKeys.lists() });
			toast.success('Jabatan berhasil dihapus');
		},
		onError: toastError
	}));

	return {
		getJobTitles,
		getJobTitle,
		createJobTitle: createMutationFn,
		updateJobTitle: updateMutationFn,
		deleteJobTitle: deleteMutationFn
	};
}
