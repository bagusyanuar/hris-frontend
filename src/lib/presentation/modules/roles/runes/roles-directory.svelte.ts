import { getCoreRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/svelte-table';
import { type CreateRoleInput, type RoleModel } from '$lib/core/roles';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import { useRolesQueries } from './roles-query.svelte';

const columns: ColumnDef<RoleModel>[] = [
  { accessorKey: 'name', header: 'Role', meta: { className: 'font-medium' } },
  { accessorKey: 'description', header: 'Deskripsi' },
  {
    id: 'permissionsCount',
    accessorFn: (row) => row.permissions?.length ?? 0,
    header: 'Hak Akses'
  },
  { id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

export function useRolesDirectory() {
  const queries = useRolesQueries();
  const listQuery = queries.getRoles({ page: 1, limit: 100 });
  const createMutation = queries.createRole;
  const updateMutation = queries.updateRole;
  const deleteMutation = queries.deleteRole;

  // Ephemeral UI state
  let isFormOpen = $state(false);
  let editingRole = $state<RoleModel | null>(null);
  let deleteTarget = $state<RoleModel | null>(null);
  let isDeleteOpen = $state(false);
  let searchQuery = $state('');
  let isDrawerOpen = $state(false);
  let selectedRole = $state<RoleModel | null>(null);

  // Derived
  const data = $derived(listQuery.data?.items ?? []);

  const filtered = $derived(
    data.filter((role) => {
      const matchSearch =
        !searchQuery ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    })
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
    editingRole = null;
    isFormOpen = true;
  }

  function openEdit(role: RoleModel) {
    editingRole = role;
    isFormOpen = true;
  }

  function closeForm() {
    isFormOpen = false;
    editingRole = null;
  }

  function submit(input: CreateRoleInput) {
    const onSuccess = () => closeForm();
    if (editingRole) {
      updateMutation.mutate({ ...input, id: editingRole.id }, { onSuccess });
    } else {
      createMutation.mutate(input, { onSuccess });
    }
  }

  function requestDelete(role: RoleModel) {
    deleteTarget = role;
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

  function openDetail(role: RoleModel) {
    selectedRole = role;
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
    get editingRole() {
      return editingRole;
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
    get selectedRole() {
      return selectedRole;
    },
    get searchQuery() {
      return searchQuery;
    },
    set searchQuery(value: string) {
      searchQuery = value;
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
