import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideBranchUseCase } from '$lib/infrastructure/branch';
import type {
  BranchParams,
  CreateBranchInput,
  UpdateBranchInput,
  BranchModel
} from '$lib/core/branch';
import type { AppError } from '$lib/core/errors/app-error';
import { toast } from '$lib/presentation/shared/components/toast';
import { branchKeys } from './branch.keys';

function toastError(err: AppError) {
  toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useBranchQueries() {
  const useCase = provideBranchUseCase();
  const queryClient = useQueryClient();

  function getBranches(params: BranchParams | (() => BranchParams)) {
    return createQuery(() => {
      const currentParams = typeof params === 'function' ? params() : params;
      return {
        queryKey: branchKeys.list(currentParams),
        queryFn: () => useCase.getAll(currentParams),
        placeholderData: (prev) => prev
      };
    });
  }

  function getBranch(id: string | (() => string)) {
    return createQuery(() => {
      const currentId = typeof id === 'function' ? id() : id;
      return {
        queryKey: branchKeys.detail(currentId),
        queryFn: () => useCase.getById(currentId),
        enabled: !!currentId
      };
    });
  }

  const createMutationFn = createMutation(() => ({
    mutationFn: (input: CreateBranchInput) => useCase.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      toast.success('Cabang berhasil ditambahkan');
    },
    onError: toastError
  }));

  const updateMutationFn = createMutation(() => ({
    mutationFn: (input: UpdateBranchInput) => useCase.update(input),
    onSuccess: (data: BranchModel) => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: branchKeys.detail(data.id) });
      toast.success('Cabang berhasil diperbarui');
    },
    onError: toastError
  }));

  const deleteMutationFn = createMutation(() => ({
    mutationFn: (id: string) => useCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: branchKeys.lists() });
      toast.success('Cabang berhasil dihapus');
    },
    onError: toastError
  }));

  return {
    getBranches,
    getBranch,
    createBranch: createMutationFn,
    updateBranch: updateMutationFn,
    deleteBranch: deleteMutationFn
  };
}
