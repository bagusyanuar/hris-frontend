import { createQuery, createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideJobPositionUseCase } from '$lib/infrastructure/job-position';
import type {
  JobPositionParams,
  CreateJobPositionInput,
  UpdateJobPositionInput,
  JobPositionModel
} from '$lib/core/job-position';
import { jobPositionKeys } from './job-position.keys';

export function useJobPositionQueries() {
  const useCase = provideJobPositionUseCase();
  const queryClient = useQueryClient();

  function getJobPositions(params: JobPositionParams | (() => JobPositionParams)) {
    return createQuery(() => {
      const currentParams = typeof params === 'function' ? params() : params;
      return {
        queryKey: jobPositionKeys.list(currentParams),
        queryFn: () => useCase.getAll(currentParams),
        placeholderData: (prev) => prev
      };
    });
  }

  function getJobPosition(id: string | (() => string)) {
    return createQuery(() => {
      const currentId = typeof id === 'function' ? id() : id;
      return {
        queryKey: jobPositionKeys.detail(currentId),
        queryFn: () => useCase.getById(currentId),
        enabled: !!currentId
      };
    });
  }

  const createMutationFn = createMutation(() => ({
    mutationFn: (input: CreateJobPositionInput) => useCase.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
    }
  }));

  const updateMutationFn = createMutation(() => ({
    mutationFn: (input: UpdateJobPositionInput) => useCase.update(input),
    onSuccess: (data: JobPositionModel) => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.detail(data.id) });
    }
  }));

  const deleteMutationFn = createMutation(() => ({
    mutationFn: (id: string) => useCase.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobPositionKeys.lists() });
    }
  }));

  return {
    getJobPositions,
    getJobPosition,
    createJobPosition: createMutationFn,
    updateJobPosition: updateMutationFn,
    deleteJobPosition: deleteMutationFn
  };
}
