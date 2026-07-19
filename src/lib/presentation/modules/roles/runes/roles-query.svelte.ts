import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideRolesUseCase } from '$lib/infrastructure/roles';
import type { RoleParams, CreateRoleInput, UpdateRoleInput, RoleModel } from '$lib/core/roles';
import type { AppError } from '$lib/core/errors/app-error';
import { toast } from '$lib/presentation/shared/components/toast';
import { rolesKeys } from './roles.keys';

function toastError(err: AppError) {
  toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useRolesQueries() {
  const useCase = provideRolesUseCase();
  const queryClient = useQueryClient();

  function getRoles(params: RoleParams | (() => RoleParams)) {
    return createQuery(() => {
      const currentParams = typeof params === 'function' ? params() : params;
      return {
        queryKey: rolesKeys.list(currentParams),
        queryFn: () => useCase.getAll(currentParams),
        placeholderData: (prev) => prev
      };
    });
  }

  function getRole(id: string | (() => string)) {
    return createQuery(() => {
      const currentId = typeof id === 'function' ? id() : id;
      return {
        queryKey: rolesKeys.detail(currentId),
        queryFn: () => useCase.getById(currentId),
        enabled: !!currentId
      };
    });
  }

  const createMutationFn = createMutation(() => ({
    mutationFn: (input: CreateRoleInput) => useCase.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      toast.success('Role berhasil ditambahkan');
    },
    onError: toastError
  }));

  const updateMutationFn = createMutation(() => ({
    mutationFn: (input: UpdateRoleInput) => useCase.update(input),
    onSuccess: (data: RoleModel) => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: rolesKeys.detail(data.id) });
      toast.success('Role berhasil diperbarui');
    },
    onError: toastError
  }));

  const deleteMutationFn = createMutation(() => ({
    mutationFn: (id: string) => useCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rolesKeys.lists() });
      toast.success('Role berhasil dihapus');
    },
    onError: toastError
  }));

  return {
    getRoles,
    getRole,
    createRole: createMutationFn,
    updateRole: updateMutationFn,
    deleteRole: deleteMutationFn
  };
}
