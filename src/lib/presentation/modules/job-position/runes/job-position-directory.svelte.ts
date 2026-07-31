import {
  JobPositionService,
  type JobPositionModel,
  type CreateJobPositionInput,
  type UpdateJobPositionInput
} from '$lib/core/job-position';
import type { Option } from '$lib/presentation/shared/components/combobox';
import { useJobPositionQueries } from './job-position-query.svelte';
import { useDepartmentsQuery } from '$lib/presentation/modules/department/runes/department-query.svelte';
import { useJobTitleQueries } from '$lib/presentation/modules/job-title/runes/job-title-query.svelte';

type StatusFilter = 'all' | 'active' | 'inactive';

export function useJobPositionDirectory() {
  const queries = useJobPositionQueries();
  const listQuery = queries.getJobPositions({ page: 1, limit: 1000 });
  const createMutation = queries.createJobPosition;
  const updateMutation = queries.updateJobPosition;
  const deleteMutation = queries.deleteJobPosition;

  const departmentQuery = useDepartmentsQuery();
  const jobTitleQueries = useJobTitleQueries();
  const jobTitleQuery = jobTitleQueries.getJobTitles({ page: 1, limit: 1000 });

  // Ephemeral UI state
  let isFormOpen = $state(false);
  let editingPosition = $state<JobPositionModel | null>(null);
  let deleteTarget = $state<JobPositionModel | null>(null);
  let isDeleteOpen = $state(false);
  let searchQuery = $state('');
  let statusFilter = $state<StatusFilter>('all');
  let isDrawerOpen = $state(false);
  let selectedPosition = $state<JobPositionModel | null>(null);

  // Derived (pure logic delegated to Core JobPositionService)
  const data = $derived(listQuery.data?.items ?? []);
  const stats = $derived(JobPositionService.getStats(data));
  const filtered = $derived(
    JobPositionService.filter(data, { search: searchQuery, status: statusFilter })
  );
  const parentOptions = $derived<Option[]>(
    JobPositionService.getAssignableParents(data, editingPosition?.id).map((pos) => ({
      value: pos.id,
      label: pos.name
    }))
  );
  const departmentOptions = $derived<Option[]>(
    departmentQuery.data?.map((dept) => ({
      value: dept.id,
      label: dept.name
    })) ?? []
  );
  const jobTitleOptions = $derived<Option[]>(
    jobTitleQuery.data?.items.map((jt) => ({
      value: jt.id,
      label: jt.name
    })) ?? []
  );
  const isSubmitting = $derived(createMutation.isPending || updateMutation.isPending);


  // Actions
  function openCreate() {
    editingPosition = null;
    isFormOpen = true;
  }

  function openEdit(position: JobPositionModel) {
    editingPosition = position;
    isFormOpen = true;
  }

  function closeForm() {
    isFormOpen = false;
    editingPosition = null;
  }

  function openDetail(position: JobPositionModel) {
    selectedPosition = position;
    isDrawerOpen = true;
  }

  function closeDetail() {
    isDrawerOpen = false;
    selectedPosition = null;
  }

  function confirmDelete(position: JobPositionModel) {
    deleteTarget = position;
    isDeleteOpen = true;
  }

  function closeDelete() {
    isDeleteOpen = false;
    deleteTarget = null;
  }

  function submit(data: CreateJobPositionInput | UpdateJobPositionInput) {
    if (editingPosition) {
      updateMutation.mutate({ ...data, id: editingPosition.id } as UpdateJobPositionInput, {
        onSuccess: () => closeForm()
      });
    } else {
      createMutation.mutate(data as CreateJobPositionInput, { onSuccess: () => closeForm() });
    }
  }

  function handleDelete() {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => closeDelete()
      });
    }
  }

  return {
    get isLoading() {
      return listQuery.isPending;
    },
    get isSubmitting() {
      return isSubmitting;
    },
    get stats() {
      return stats;
    },
    get items() {
      return filtered;
    },
    get searchQuery() {
      return searchQuery;
    },
    set searchQuery(val) {
      searchQuery = val;
    },
    get statusFilter() {
      return statusFilter;
    },
    set statusFilter(val) {
      statusFilter = val;
    },
    get parentOptions() {
      return parentOptions;
    },
    get departmentOptions() {
      return departmentOptions;
    },
    get jobTitleOptions() {
      return jobTitleOptions;
    },
    get isFormOpen() {
      return isFormOpen;
    },
    set isFormOpen(val) {
      isFormOpen = val;
    },
    get editingPosition() {
      return editingPosition;
    },
    get isDrawerOpen() {
      return isDrawerOpen;
    },
    set isDrawerOpen(val) {
      isDrawerOpen = val;
    },
    get selectedPosition() {
      return selectedPosition;
    },
    get isDeleteOpen() {
      return isDeleteOpen;
    },
    set isDeleteOpen(val) {
      isDeleteOpen = val;
    },
    get deleteTarget() {
      return deleteTarget;
    },
    openCreate,
    openEdit,
    closeForm,
    openDetail,
    closeDetail,
    confirmDelete,
    closeDelete,
    submit,
    handleDelete
  };
}
