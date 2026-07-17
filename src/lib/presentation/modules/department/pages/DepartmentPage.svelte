<script lang="ts">
	import {
		getCoreRowModel,
		getExpandedRowModel,
		getPaginationRowModel,
		type ColumnDef,
		type Row
	} from '@tanstack/svelte-table';
	import type { CreateDepartmentInput, DepartmentModel } from '$lib/core/department';
	import { provideDepartmentUseCase } from '$lib/infrastructure/department';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Card } from '$lib/presentation/shared/components/card';
	import { Button } from '$lib/presentation/shared/components/button';
	import { AlertDialog } from '$lib/presentation/shared/components/dialog';
	import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
	import { toast } from '$lib/presentation/shared/components/toast';
	import * as TableUI from '$lib/presentation/shared/components/table';
	import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';
	import DepartmentFormDialog from '../components/DepartmentFormDialog.svelte';
	import {
		useCreateDepartmentMutation,
		useDeleteDepartmentMutation,
		useDepartmentsQuery,
		useUpdateDepartmentMutation
	} from '../runes/department-query.svelte';

	const departmentUseCase = provideDepartmentUseCase();
	const departmentsQuery = useDepartmentsQuery();
	const createDepartmentMutation = useCreateDepartmentMutation();
	const updateDepartmentMutation = useUpdateDepartmentMutation();
	const deleteDepartmentMutation = useDeleteDepartmentMutation();

	let isFormOpen = $state(false);
	let editingDepartment = $state<DepartmentModel | null>(null);

	let deleteTarget = $state<DepartmentModel | null>(null);
	let isDeleteOpen = $state(false);

	const isSubmitting = $derived(createDepartmentMutation.isPending || updateDepartmentMutation.isPending);

	const tree = $derived<DepartmentModel[]>(departmentUseCase.buildTree(departmentsQuery.data ?? []));

	const parentOptions = $derived(
		departmentUseCase
			.getAssignableParents(departmentsQuery.data ?? [], editingDepartment?.id)
			.map((department) => ({ value: department.id, label: department.name }))
	);

	const columns: ColumnDef<DepartmentModel>[] = [
		{
			accessorKey: 'name',
			header: 'Department',
			meta: { className: 'font-medium' }
		},
		{ accessorKey: 'code', header: 'Code' },
		{ accessorKey: 'description', header: 'Description' },
		{ accessorKey: 'status', header: 'Status', meta: { align: 'center' } },
		{ id: 'actions', header: '', enableSorting: false, meta: { align: 'right' } }
	];

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

	function openCreateDialog() {
		editingDepartment = null;
		isFormOpen = true;
	}

	function openEditDialog(department: DepartmentModel) {
		editingDepartment = department;
		isFormOpen = true;
	}

	function closeFormDialog() {
		isFormOpen = false;
		editingDepartment = null;
	}

	async function handleSubmit(input: CreateDepartmentInput) {
		try {
			if (editingDepartment) {
				await updateDepartmentMutation.mutateAsync({ ...input, id: editingDepartment.id });
				toast.success('Department updated');
			} else {
				await createDepartmentMutation.mutateAsync(input);
				toast.success('Department added');
			}
			closeFormDialog();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Something went wrong');
		}
	}

	function requestDelete(department: DepartmentModel) {
		deleteTarget = department;
		isDeleteOpen = true;
	}

	async function confirmDelete() {
		if (!deleteTarget) return;

		try {
			await deleteDepartmentMutation.mutateAsync(deleteTarget.id);
			toast.success(`"${deleteTarget.name}" deleted`);
			isDeleteOpen = false;
			deleteTarget = null;
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Failed to delete department');
		}
	}
</script>

{#snippet statusBadge(status: string)}
	<span
		class={cn(
			'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
			status === 'active'
				? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
				: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
		)}
	>
		{status === 'active' ? 'Active' : 'Inactive'}
	</span>
{/snippet}

<div class="space-y-6">
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex flex-col gap-1">
			<Typography variant="h4" weight="bold">Departments</Typography>
			<Typography variant="body-sm" color="secondary">
				Manage the company's organizational unit hierarchy.
			</Typography>
		</div>
		<Button variant="primary" size="sm" onclick={openCreateDialog}>
			<Icon icon="lucide:plus" class="w-4 h-4 mr-1.5" />
			Add Department
		</Button>
	</div>

	<Card padding="lg">
		<TableUI.Root table={table.current} isLoading={departmentsQuery.isPending}>
			<TableUI.Header>
				{#each table.current.getHeaderGroups() as headerGroup (headerGroup.id)}
					<TableUI.Row>
						{#each headerGroup.headers as header (header.id)}
							<TableUI.Head {header} />
						{/each}
					</TableUI.Row>
				{/each}
			</TableUI.Header>
			<TableUI.Body>
				{#each table.current.getRowModel().rows as row (row.id)}
					<TableUI.Row hoverable={true}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableUI.Cell {cell}>
								{#if cell.column.id === 'name'}
									<div class="flex items-center gap-2" style="padding-left: {row.depth * 1.25}rem">
										{#if row.getCanExpand()}
											<button
												onclick={() => row.toggleExpanded()}
												class="p-0.5 rounded shrink-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
											>
												<Icon
													icon="lucide:chevron-right"
													class={cn('w-3.5 h-3.5 transition-transform', isRowExpanded(row.id) && 'rotate-90')}
												/>
											</button>
										{:else}
											<span class="w-4 shrink-0"></span>
										{/if}
										<span>{cell.getValue()}</span>
									</div>
								{:else if cell.column.id === 'description'}
									<span class="text-slate-500 dark:text-slate-400">{cell.getValue() ?? '-'}</span>
								{:else if cell.column.id === 'status'}
									{@render statusBadge(cell.getValue() as string)}
								{:else if cell.column.id === 'actions'}
									<Dropdown align="right">
										{#snippet trigger(toggle)}
											<button
												onclick={toggle}
												class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
											>
												<Icon icon="lucide:more-horizontal" class="w-4 h-4" />
											</button>
										{/snippet}
										{#snippet content()}
											<DropdownItem onclick={() => openEditDialog(row.original)}>Edit</DropdownItem>
											<DropdownItem variant="danger" onclick={() => requestDelete(row.original)}>
												Delete
											</DropdownItem>
										{/snippet}
									</Dropdown>
								{:else}
									{cell.getValue()}
								{/if}
							</TableUI.Cell>
						{/each}
					</TableUI.Row>
				{/each}
			</TableUI.Body>
		</TableUI.Root>
		<TableUI.Pagination table={table.current} />
	</Card>
</div>

<DepartmentFormDialog
	bind:open={isFormOpen}
	department={editingDepartment}
	{parentOptions}
	{isSubmitting}
	onsubmit={handleSubmit}
	onclose={closeFormDialog}
/>

<AlertDialog
	bind:open={isDeleteOpen}
	title="Delete Department?"
	description={`This will permanently remove "${deleteTarget?.name}" from the organization structure.`}
	variant="danger"
	confirmText="Delete"
	isLoading={deleteDepartmentMutation.isPending}
	onconfirm={confirmDelete}
	oncancel={() => (isDeleteOpen = false)}
/>
