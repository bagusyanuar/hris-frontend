import { getCoreRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/svelte-table';
import { CompanyService, type CreateCompanyInput, type CompanyModel } from '$lib/core/company';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import { useCompanyQueries } from './company-query.svelte';
import { useBranchQueries } from '../../branch/runes/branch-query.svelte';
import type { CreateBranchInput, BranchModel } from '$lib/core/branch';

type StatusFilter = 'all' | 'active' | 'inactive';

const columns: ColumnDef<CompanyModel>[] = [
  { accessorKey: 'legalName', header: 'Nama Perusahaan', meta: { className: 'font-medium' } },
  { accessorKey: 'code', header: 'Kode' },
  { accessorKey: 'npwp', header: 'NPWP' },
  { accessorKey: 'bpjsNo', header: 'No. BPJS' },
  { 
    id: 'branches_count', 
    header: 'Jumlah Cabang', 
    accessorFn: (row) => row.branches?.length ?? 0 
  },
  { accessorKey: 'isActive', header: 'Status', meta: { align: 'center' } },
  { id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

export function useCompanyDirectory() {
  const companyQueries = useCompanyQueries();
  const branchQueries = useBranchQueries();

  // Active query parameters (with default limit 100 for simplicity of dashboard list)
  const listQuery = companyQueries.getCompanies({ page: 1, limit: 100 });
  const createCompanyMutation = companyQueries.createCompany;
  const updateCompanyMutation = companyQueries.updateCompany;
  const deleteCompanyMutation = companyQueries.deleteCompany;

  const createBranchMutation = branchQueries.createBranch;
  const updateBranchMutation = branchQueries.updateBranch;
  const deleteBranchMutation = branchQueries.deleteBranch;

  // Ephemeral UI states
  let isCompanyFormOpen = $state(false);
  let editingCompany = $state<CompanyModel | null>(null);
  let deleteCompanyTarget = $state<CompanyModel | null>(null);
  let isCompanyDeleteOpen = $state(false);

  let isBranchFormOpen = $state(false);
  let editingBranch = $state<BranchModel | null>(null);
  let deleteBranchTarget = $state<BranchModel | null>(null);
  let isBranchDeleteOpen = $state(false);
  let activeCompanyForBranch = $state<CompanyModel | null>(null);

  let searchQuery = $state('');
  let statusFilter = $state<StatusFilter>('all');
  let selectedCompany = $state<CompanyModel | null>(null);

  // Derived states
  const data = $derived(listQuery.data?.items ?? []);
  const stats = $derived(CompanyService.getStats(data));
  
  const filtered = $derived.by(() => {
    return data.filter((c) => {
      const matchSearch =
        !searchQuery ||
        c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.npwp && c.npwp.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.branches.some((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'active' && c.isActive) || 
        (statusFilter === 'inactive' && !c.isActive);

      return matchSearch && matchStatus;
    });
  });

  const isSubmitting = $derived(
    createCompanyMutation.isPending || 
    updateCompanyMutation.isPending ||
    createBranchMutation.isPending ||
    updateBranchMutation.isPending
  );

  const table = createTable({
    get data() {
      return filtered;
    },
    columns,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  // Company Actions
  function openCreateCompany() {
    editingCompany = null;
    isCompanyFormOpen = true;
  }

  function openEditCompany(company: CompanyModel) {
    editingCompany = company;
    isCompanyFormOpen = true;
  }

  function closeCompanyForm() {
    isCompanyFormOpen = false;
    editingCompany = null;
  }

  function submitCompany(input: CreateCompanyInput) {
    const onSuccess = () => closeCompanyForm();
    if (editingCompany) {
      updateCompanyMutation.mutate({ ...input, id: editingCompany.id }, { onSuccess });
    } else {
      createCompanyMutation.mutate(input, { onSuccess });
    }
  }

  function requestDeleteCompany(company: CompanyModel) {
    deleteCompanyTarget = company;
    isCompanyDeleteOpen = true;
  }

  function confirmDeleteCompany() {
    if (!deleteCompanyTarget) return;
    deleteCompanyMutation.mutate(deleteCompanyTarget.id, {
      onSuccess: () => {
        isCompanyDeleteOpen = false;
        deleteCompanyTarget = null;
      }
    });
  }

  // Branch Actions (Managed inside Company)
  function openCreateBranch(company: CompanyModel) {
    activeCompanyForBranch = company;
    editingBranch = null;
    isBranchFormOpen = true;
  }

  function openEditBranch(company: CompanyModel, branch: BranchModel) {
    activeCompanyForBranch = company;
    editingBranch = branch;
    isBranchFormOpen = true;
  }

  function closeBranchForm() {
    isBranchFormOpen = false;
    editingBranch = null;
    activeCompanyForBranch = null;
  }

  function submitBranch(input: CreateBranchInput) {
    const onSuccess = () => {
      // Invalidate company lists to pull fresh nested branches
      listQuery.refetch();
      closeBranchForm();
    };
    if (editingBranch) {
      updateBranchMutation.mutate({ ...input, id: editingBranch.id }, { onSuccess });
    } else {
      createBranchMutation.mutate(input, { onSuccess });
    }
  }

  function requestDeleteBranch(branch: BranchModel) {
    deleteBranchTarget = branch;
    isBranchDeleteOpen = true;
  }

  function confirmDeleteBranch() {
    if (!deleteBranchTarget) return;
    deleteBranchMutation.mutate(deleteBranchTarget.id, {
      onSuccess: () => {
        listQuery.refetch();
        isBranchDeleteOpen = false;
        deleteBranchTarget = null;
      }
    });
  }

  return {
    // Server states
    get isLoading() {
      return listQuery.isPending;
    },
    get isDeleting() {
      return deleteCompanyMutation.isPending || deleteBranchMutation.isPending;
    },
    get isSubmitting() {
      return isSubmitting;
    },
    // Derived values
    get stats() {
      return stats;
    },
    get table() {
      return table.current;
    },
    // Company Form UI state
    get isCompanyFormOpen() {
      return isCompanyFormOpen;
    },
    set isCompanyFormOpen(value: boolean) {
      isCompanyFormOpen = value;
    },
    get editingCompany() {
      return editingCompany;
    },
    get isCompanyDeleteOpen() {
      return isCompanyDeleteOpen;
    },
    set isCompanyDeleteOpen(value: boolean) {
      isCompanyDeleteOpen = value;
    },
    get deleteCompanyTarget() {
      return deleteCompanyTarget;
    },

    // Branch Form UI state
    get isBranchFormOpen() {
      return isBranchFormOpen;
    },
    set isBranchFormOpen(value: boolean) {
      isBranchFormOpen = value;
    },
    get editingBranch() {
      return editingBranch;
    },
    get isBranchDeleteOpen() {
      return isBranchDeleteOpen;
    },
    set isBranchDeleteOpen(value: boolean) {
      isBranchDeleteOpen = value;
    },
    get deleteBranchTarget() {
      return deleteBranchTarget;
    },
    get activeCompanyForBranch() {
      return activeCompanyForBranch;
    },

    // Search and filters
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
    get selectedCompany() {
      return selectedCompany;
    },
    set selectedCompany(value: CompanyModel | null) {
      selectedCompany = value;
    },

    // Company Handlers
    openCreateCompany,
    openEditCompany,
    closeCompanyForm,
    submitCompany,
    requestDeleteCompany,
    confirmDeleteCompany,

    // Branch Handlers
    openCreateBranch,
    openEditBranch,
    closeBranchForm,
    submitBranch,
    requestDeleteBranch,
    confirmDeleteBranch
  };
}
