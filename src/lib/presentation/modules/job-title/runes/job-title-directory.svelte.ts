import { getCoreRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/svelte-table';
import { JobTitleService, type CreateJobTitleInput, type JobTitleModel } from '$lib/core/job-title';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import { useJobTitleQueries } from './job-title-query.svelte';

type StatusFilter = 'all' | 'active' | 'inactive';

const columns: ColumnDef<JobTitleModel>[] = [
  { accessorKey: 'name', header: 'Jabatan', meta: { className: 'font-medium' } },
  { accessorKey: 'code', header: 'Kode' },
  { accessorKey: 'description', header: 'Deskripsi' },
  { accessorKey: 'status', header: 'Status', meta: { align: 'center' } },
  { id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

export function useJobTitleDirectory() {
  const queries = useJobTitleQueries();
  const listQuery = queries.getJobTitles({ page: 1, limit: 100 });
  const createMutation = queries.createJobTitle;
  const updateMutation = queries.updateJobTitle;
  const deleteMutation = queries.deleteJobTitle;

  // Ephemeral UI state
  let isFormOpen = $state(false);
  let editingJobTitle = $state<JobTitleModel | null>(null);
  let deleteTarget = $state<JobTitleModel | null>(null);
  let isDeleteOpen = $state(false);
  let searchQuery = $state('');
  let statusFilter = $state<StatusFilter>('all');
  let isDrawerOpen = $state(false);
  let selectedJobTitle = $state<JobTitleModel | null>(null);

  // Derived
  const data = $derived(listQuery.data?.items ?? []);
  const stats = $derived(JobTitleService.getStats(data));
  const filtered = $derived(
    JobTitleService.filter(data, { search: searchQuery, status: statusFilter })
  );
  const isSubmitting = $derived(createMutation.isPending || updateMutation.isPending);

  const table = createTable({
    get data() {
      return filtered;
    },
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // Actions
  function openCreate() {
    editingJobTitle = null;
    isFormOpen = true;
  }

  function openEdit(jobTitle: JobTitleModel) {
    editingJobTitle = jobTitle;
    isFormOpen = true;
  }

  function closeForm() {
    isFormOpen = false;
    editingJobTitle = null;
  }

  function submit(input: CreateJobTitleInput) {
    const onSuccess = () => closeForm();
    if (editingJobTitle) {
      updateMutation.mutate({ ...input, id: editingJobTitle.id }, { onSuccess });
    } else {
      createMutation.mutate(input, { onSuccess });
    }
  }

  function requestDelete(jobTitle: JobTitleModel) {
    deleteTarget = jobTitle;
    isDeleteOpen = true;
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        isDeleteOpen = false;
        deleteTarget = null;
      }
    });
  }

  function openDetail(jobTitle: JobTitleModel) {
    selectedJobTitle = jobTitle;
    isDrawerOpen = true;
  }

  return {
    // Server state
    get isLoading() {
      return listQuery.isPending;
    },
    get isDeleting() {
      return deleteMutation.isPending;
    },
    get isSubmitting() {
      return isSubmitting;
    },
    // Derived data
    get stats() {
      return stats;
    },
    get table() {
      return table.current;
    },
    // UI state
    get isFormOpen() {
      return isFormOpen;
    },
    set isFormOpen(value: boolean) {
      isFormOpen = value;
    },
    get editingJobTitle() {
      return editingJobTitle;
    },
    get isDeleteOpen() {
      return isDeleteOpen;
    },
    set isDeleteOpen(value: boolean) {
      isDeleteOpen = value;
    },
    get deleteTarget() {
      return deleteTarget;
    },
    get isDrawerOpen() {
      return isDrawerOpen;
    },
    set isDrawerOpen(value: boolean) {
      isDrawerOpen = value;
    },
    get selectedJobTitle() {
      return selectedJobTitle;
    },
    get searchQuery() {
      return searchQuery;
    },
    set searchQuery(value: string) {
      searchQuery = value;
    },
    get statusFilter() {
      return statusFilter;
    },
    set statusFilter(value: StatusFilter) {
      statusFilter = value;
    },
    // Actions
    openCreate,
    openEdit,
    closeForm,
    submit,
    requestDelete,
    confirmDelete,
    openDetail
  };
}
