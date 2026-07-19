import { getCoreRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/svelte-table';
import { BranchService, type CreateBranchInput, type BranchModel } from '$lib/core/branch';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import { useBranchQueries } from './branch-query.svelte';

type StatusFilter = 'all' | 'active' | 'inactive';

const columns: ColumnDef<BranchModel>[] = [
  { accessorKey: 'name', header: 'Cabang', meta: { className: 'font-medium' } },
  { accessorKey: 'code', header: 'Kode' },
  { accessorKey: 'phone', header: 'Telepon' },
  { accessorKey: 'address', header: 'Alamat' },
  { accessorKey: 'status', header: 'Status', meta: { align: 'center' } },
  { id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

export function useBranchDirectory() {
  const queries = useBranchQueries();
  const listQuery = queries.getBranches({ page: 1, limit: 100 });
  const createMutation = queries.createBranch;
  const updateMutation = queries.updateBranch;
  const deleteMutation = queries.deleteBranch;

  // Ephemeral UI state
  let isFormOpen = $state(false);
  let editingBranch = $state<BranchModel | null>(null);
  let deleteTarget = $state<BranchModel | null>(null);
  let isDeleteOpen = $state(false);
  let searchQuery = $state('');
  let statusFilter = $state<StatusFilter>('all');
  let isDrawerOpen = $state(false);
  let selectedBranch = $state<BranchModel | null>(null);

  // Derived
  const data = $derived(listQuery.data?.items ?? []);
  const stats = $derived(BranchService.getStats(data));
  const filtered = $derived(
    BranchService.filter(data, { search: searchQuery, status: statusFilter })
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
    editingBranch = null;
    isFormOpen = true;
  }

  function openEdit(branch: BranchModel) {
    editingBranch = branch;
    isFormOpen = true;
  }

  function closeForm() {
    isFormOpen = false;
    editingBranch = null;
  }

  function submit(input: CreateBranchInput) {
    const onSuccess = () => closeForm();
    if (editingBranch) {
      updateMutation.mutate({ ...input, id: editingBranch.id }, { onSuccess });
    } else {
      createMutation.mutate(input, { onSuccess });
    }
  }

  function requestDelete(branch: BranchModel) {
    deleteTarget = branch;
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

  function openDetail(branch: BranchModel) {
    selectedBranch = branch;
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
    get editingBranch() {
      return editingBranch;
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
    get selectedBranch() {
      return selectedBranch;
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
