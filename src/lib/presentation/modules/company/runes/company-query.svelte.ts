import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideCompanyUseCase } from '$lib/infrastructure/company';
import type {
  CompanyParams,
  CreateCompanyInput,
  UpdateCompanyInput,
  CompanyModel
} from '$lib/core/company';
import type { AppError } from '$lib/core/errors/app-error';
import { toast } from '$lib/presentation/shared/components/toast';
import { companyKeys } from './company.keys';

function toastError(err: AppError) {
  toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useCompanyQueries() {
  const useCase = provideCompanyUseCase();
  const queryClient = useQueryClient();

  function getCompanies(params: CompanyParams | (() => CompanyParams)) {
    return createQuery(() => {
      const currentParams = typeof params === 'function' ? params() : params;
      return {
        queryKey: companyKeys.list(currentParams),
        queryFn: () => useCase.getAll(currentParams),
        placeholderData: (prev) => prev
      };
    });
  }

  function getCompany(id: string | (() => string)) {
    return createQuery(() => {
      const currentId = typeof id === 'function' ? id() : id;
      return {
        queryKey: companyKeys.detail(currentId),
        queryFn: () => useCase.getById(currentId),
        enabled: !!currentId
      };
    });
  }

  const createMutationFn = createMutation(() => ({
    mutationFn: (input: CreateCompanyInput) => useCase.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success('Perusahaan berhasil ditambahkan');
    },
    onError: toastError
  }));

  const updateMutationFn = createMutation(() => ({
    mutationFn: (input: UpdateCompanyInput) => useCase.update(input),
    onSuccess: (data: CompanyModel) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: companyKeys.detail(data.id) });
      toast.success('Perusahaan berhasil diperbarui');
    },
    onError: toastError
  }));

  const deleteMutationFn = createMutation(() => ({
    mutationFn: (id: string) => useCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.lists() });
      toast.success('Perusahaan berhasil dihapus');
    },
    onError: toastError
  }));

  return {
    getCompanies,
    getCompany,
    createCompany: createMutationFn,
    updateCompany: updateMutationFn,
    deleteCompany: deleteMutationFn
  };
}
