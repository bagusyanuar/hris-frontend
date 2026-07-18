import {
	getCoreRowModel,
	getExpandedRowModel,
	getPaginationRowModel,
	type ColumnDef,
	type Row
} from '@tanstack/svelte-table';
import { JobPositionService, type JobPositionModel, type JobPositionStatus } from '$lib/core/job-position';
import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
import type { Option } from '$lib/presentation/shared/components/combobox';
import { useJobPositionQueries } from './job-position-query.svelte';

type StatusFilter = 'all' | 'active' | 'inactive';
type ViewMode = 'table' | 'orgChart';

const columns: ColumnDef<JobPositionModel>[] = [
	{ accessorKey: 'name', header: 'Job Position', meta: { className: 'font-medium' } },
	{ accessorKey: 'departmentName', header: 'Departemen' },
	{ accessorKey: 'jobTitleName', header: 'Job Title' },
	{ accessorKey: 'headcountQuota', header: 'Headcount Quota', meta: { align: 'center' } },
	{ accessorKey: 'description', header: 'Deskripsi' },
	{ accessorKey: 'status', header: 'Status', meta: { align: 'center' } },
	{ id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
];

export function useJobPositionDirectory() {
	const queries = useJobPositionQueries();
	const listQuery = queries.getJobPositions({ page: 1, limit: 1000 });
	const createMutation = queries.createJobPosition;
	const updateMutation = queries.updateJobPosition;
	const deleteMutation = queries.deleteJobPosition;

	// Ephemeral UI state
	let isFormOpen = $state(false);
	let editingPosition = $state<JobPositionModel | null>(null);
	let deleteTarget = $state<JobPositionModel | null>(null);
	let isDeleteOpen = $state(false);
	let searchQuery = $state('');
	let statusFilter = $state<StatusFilter>('all');
	let viewMode = $state<ViewMode>('table');
	let isDrawerOpen = $state(false);
	let selectedPosition = $state<JobPositionModel | null>(null);

	// Derived (pure logic delegated to Core JobPositionService)
	const data = $derived(listQuery.data?.items ?? []);
	const stats = $derived(JobPositionService.getStats(data));
	const filtered = $derived(
		JobPositionService.filter(data, { search: searchQuery, status: statusFilter })
	);
	const tree = $derived(JobPositionService.buildTree(filtered));
	const parentOptions = $derived<Option[]>(
		JobPositionService.getAssignableParents(data, editingPosition?.id).map((pos) => ({
			value: pos.id,
			label: pos.name
		}))
	);
	const isSubmitting = $derived(createMutation.isPending || updateMutation.isPending);

	const table = createTable({
		get data() {
			return tree;
		},
		columns,
		getSubRows: (row: JobPositionModel & { children?: JobPositionModel[] }) =>
			row.children && row.children.length > 0 ? row.children : undefined,
		getRowCanExpand: (row: Row<JobPositionModel & { children?: JobPositionModel[] }>) => (row.original.children?.length ?? 0) > 0,
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
		get table() {
			return table.current;
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
		get viewMode() {
			return viewMode;
		},
		set viewMode(val) {
			viewMode = val;
		},
		get parentOptions() {
			return parentOptions;
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
		isRowExpanded,
		openCreate,
		openEdit,
		closeForm,
		openDetail,
		closeDetail,
		confirmDelete,
		closeDelete,
		handleDelete
	};
}
