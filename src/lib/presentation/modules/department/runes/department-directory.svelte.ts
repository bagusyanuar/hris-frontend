import {
	getCoreRowModel,
	getExpandedRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type Row
} from '@tanstack/svelte-table';
import { DepartmentService, type CreateDepartmentInput, type DepartmentModel } from '$lib/core/department';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import type { Option } from '$lib/presentation/shared/components/combobox';
import {
	useCreateDepartmentMutation,
	useDeleteDepartmentMutation,
	useDepartmentsQuery,
	useUpdateDepartmentMutation
} from './department-query.svelte';

type StatusFilter = 'all' | 'active' | 'inactive';
type ViewMode = 'table' | 'orgChart';

const columns: ColumnDef<DepartmentModel>[] = [
	{ accessorKey: 'name', header: 'Departemen', meta: { className: 'font-medium' } },
	{ accessorKey: 'code', header: 'Kode' },
	{ accessorKey: 'managerName', header: 'Kepala Departemen' },
	{ accessorKey: 'description', header: 'Deskripsi' },
	{ accessorKey: 'status', header: 'Status', meta: { align: 'center' } },
	{ id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

/**
 * Controller rune untuk halaman Direktori Departemen. Memiliki seluruh state UI
 * ephemeral (dialog/drawer/filter/view), instance query + mutation, dan aksi CRUD.
 * Komponen page cukup meng-konsumsi ini dan merender — nol logika di `.svelte`.
 *
 * Harus dipanggil sinkron di top-level <script> komponen (query/mutation + createTable
 * memakai context & lifecycle Svelte).
 */
export function useDepartmentDirectory() {
	const departmentsQuery = useDepartmentsQuery();
	const createMutation = useCreateDepartmentMutation();
	const updateMutation = useUpdateDepartmentMutation();
	const deleteMutation = useDeleteDepartmentMutation();

	// Ephemeral UI state
	let isFormOpen = $state(false);
	let editingDepartment = $state<DepartmentModel | null>(null);
	let deleteTarget = $state<DepartmentModel | null>(null);
	let isDeleteOpen = $state(false);
	let searchQuery = $state('');
	let statusFilter = $state<StatusFilter>('all');
	let viewMode = $state<ViewMode>('table');
	let isDrawerOpen = $state(false);
	let selectedDepartment = $state<DepartmentModel | null>(null);

	// Derived (pure logic delegated to Core DepartmentService)
	const data = $derived(departmentsQuery.data ?? []);
	const stats = $derived(DepartmentService.getStats(data));
	const filtered = $derived(
		DepartmentService.filter(data, { search: searchQuery, status: statusFilter })
	);
	const tree = $derived(DepartmentService.buildTree(filtered));
	const parentOptions = $derived<Option[]>(
		DepartmentService.getAssignableParents(data, editingDepartment?.id).map((department) => ({
			value: department.id,
			label: department.name
		}))
	);
	const isSubmitting = $derived(createMutation.isPending || updateMutation.isPending);

	const table = createTable({
		get data() {
			return tree;
		},
		columns,
		getSubRows: (row: DepartmentModel) =>
			row.children && row.children.length > 0 ? row.children : undefined,
		getRowCanExpand: (row: Row<DepartmentModel>) => (row.original.children?.length ?? 0) > 0,
		initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	});

	function isRowExpanded(rowId: string): boolean {
		const expanded = table.current.getState().expanded;
		return expanded === true || !!expanded?.[rowId];
	}

	// Actions
	function openCreate() {
		editingDepartment = null;
		isFormOpen = true;
	}

	function openEdit(department: DepartmentModel) {
		editingDepartment = department;
		isFormOpen = true;
	}

	function closeForm() {
		isFormOpen = false;
		editingDepartment = null;
	}

	function submit(input: CreateDepartmentInput) {
		// Per-call onSuccess menutup dialog hanya saat berhasil; error toast di onError mutation.
		const onSuccess = () => closeForm();
		if (editingDepartment) {
			updateMutation.mutate({ ...input, id: editingDepartment.id }, { onSuccess });
		} else {
			createMutation.mutate(input, { onSuccess });
		}
	}

	function requestDelete(department: DepartmentModel) {
		deleteTarget = department;
		isDeleteOpen = true;
	}

	function confirmDelete() {
		if (!deleteTarget) return;
		deleteMutation.mutate(
			{ id: deleteTarget.id, name: deleteTarget.name },
			{
				onSuccess: () => {
					isDeleteOpen = false;
					deleteTarget = null;
				}
			}
		);
	}

	function openDetail(department: DepartmentModel) {
		selectedDepartment = department;
		isDrawerOpen = true;
	}

	return {
		// Server state
		get isLoading() {
			return departmentsQuery.isPending;
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
		get tree() {
			return tree;
		},
		get parentOptions() {
			return parentOptions;
		},
		get table() {
			return table.current;
		},
		isRowExpanded,
		// UI state (get/set for two-way bindings)
		get isFormOpen() {
			return isFormOpen;
		},
		set isFormOpen(value: boolean) {
			isFormOpen = value;
		},
		get editingDepartment() {
			return editingDepartment;
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
		get selectedDepartment() {
			return selectedDepartment;
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
		get viewMode() {
			return viewMode;
		},
		set viewMode(value: ViewMode) {
			viewMode = value;
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
