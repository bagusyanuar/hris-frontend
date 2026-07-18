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
	import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
	import { Avatar } from '$lib/presentation/shared/components/avatar';
	import DepartmentFormDialog from '../components/DepartmentFormDialog.svelte';
	import DepartmentDetailDrawer from '../components/DepartmentDetailDrawer.svelte';
	import DepartmentOrgChart from '../components/DepartmentOrgChart.svelte';
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

	let searchQuery = $state('');
	let statusFilter = $state<'all' | 'active' | 'inactive'>('all');

	let viewMode = $state<'table' | 'orgChart'>('table');
	let isDrawerOpen = $state(false);
	let selectedDepartment = $state<DepartmentModel | null>(null);

	const totalDepartments = $derived(departmentsQuery.data?.length ?? 0);
	const activeDepartments = $derived(
		departmentsQuery.data?.filter((d) => d.status === 'active').length ?? 0
	);
	const activePercentage = $derived(
		totalDepartments === 0 ? 0 : Math.round((activeDepartments / totalDepartments) * 100)
	);

	const isSubmitting = $derived(
		createDepartmentMutation.isPending || updateDepartmentMutation.isPending
	);

	const filteredDepartments = $derived(
		(departmentsQuery.data ?? []).filter((d) => {
			const matchStatus = statusFilter === 'all' ? true : d.status === statusFilter;
			const matchSearch =
				searchQuery.trim() === ''
					? true
					: d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
						d.code.toLowerCase().includes(searchQuery.toLowerCase());
			return matchStatus && matchSearch;
		})
	);

	const tree = $derived<DepartmentModel[]>(departmentUseCase.buildTree(filteredDepartments));

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
		{ accessorKey: 'managerName', header: 'Head of Dept' },
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

	function openDetailDrawer(department: DepartmentModel) {
		selectedDepartment = department;
		isDrawerOpen = true;
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
			'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
			status === 'active'
				? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
				: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
		)}
	>
		<Icon 
			icon={status === 'active' ? 'lucide:check-circle-2' : 'lucide:minus-circle'} 
			class="w-3.5 h-3.5" 
		/>
		{status === 'active' ? 'Active' : 'Inactive'}
	</span>
{/snippet}

<div class="flex flex-col gap-3">
	<!-- Header Panel with Quick Insights -->
	<div
		class="rounded-2xl border border-neutral-border bg-neutral-card p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
	>
		<div class="flex items-center gap-4">
			<div
				class="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand-primary shrink-0"
			>
				<Icon icon="lucide:building-2" class="w-6 h-6" />
			</div>
			<div class="flex flex-col gap-1">
				<Typography variant="h4" weight="bold">Departments</Typography>
				<Typography variant="body-sm" color="secondary">
					Manage the company's organizational unit hierarchy.
				</Typography>
			</div>
		</div>
		<div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 self-stretch sm:self-auto">
			<div class="flex items-center gap-2 px-3">
				<Icon icon="lucide:layers" class="w-4 h-4 text-slate-400" />
				<span class="text-sm font-medium text-slate-700 dark:text-slate-300">
					{totalDepartments} <span class="text-slate-500 font-normal">Depts</span>
				</span>
			</div>
			<div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
			<div class="flex items-center gap-2 px-3">
				<Icon icon="lucide:activity" class="w-4 h-4 text-emerald-500" />
				<span class="text-sm font-medium text-slate-700 dark:text-slate-300">
					{activePercentage}% <span class="text-slate-500 font-normal">Active</span>
				</span>
			</div>
		</div>
	</div>

	<Card padding="lg">
		<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
			<Typography variant="h5" weight="semibold">Department Directory</Typography>
			<div class="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
				<div class="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 h-9">
					<button
						class={cn("h-full px-3 rounded-md text-xs flex items-center gap-1.5 transition-colors", viewMode === 'table' ? 'bg-brand-primary text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}
						onclick={() => viewMode = 'table'}
					>
						<Icon icon="lucide:table-2" class="w-4 h-4" />
						<span class="hidden sm:inline">Table</span>
					</button>
					<button
						class={cn("h-full px-3 rounded-md text-xs flex items-center gap-1.5 transition-colors", viewMode === 'orgChart' ? 'bg-brand-primary text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}
						onclick={() => viewMode = 'orgChart'}
					>
						<Icon icon="lucide:network" class="w-4 h-4" />
						<span class="hidden sm:inline">Chart</span>
					</button>
				</div>
				<TextField
					placeholder="Search departments..."
					size="sm"
					class="w-full sm:w-64"
					bind:value={searchQuery}
				>
					{#snippet prefix()}
						<Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
					{/snippet}
				</TextField>
				<Dropdown align="right">
					{#snippet trigger(toggle)}
						<Button variant="outline" size="sm" class="whitespace-nowrap text-xs font-normal" onclick={toggle}>
							<Icon icon="lucide:filter" class="w-4 h-4 mr-1.5" />
							{statusFilter === 'all'
								? 'All Status'
								: statusFilter === 'active'
									? 'Active'
									: 'Inactive'}
						</Button>
					{/snippet}
					{#snippet content()}
						<DropdownItem class="text-xs font-normal gap-2" onclick={() => (statusFilter = 'all')}>
							<Icon icon="lucide:layers" class="w-4 h-4" />
							All Status
						</DropdownItem>
						<DropdownItem class="text-xs font-normal gap-2" onclick={() => (statusFilter = 'active')}>
							<Icon
								icon="lucide:check-circle-2"
								class="w-4 h-4 text-emerald-600 dark:text-emerald-500"
							/>
							<span class="text-emerald-600 dark:text-emerald-500">Active</span>
						</DropdownItem>
						<DropdownItem class="text-xs font-normal gap-2" onclick={() => (statusFilter = 'inactive')}>
							<Icon icon="lucide:minus-circle" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
							<span class="text-slate-500 dark:text-slate-400">Inactive</span>
						</DropdownItem>
					{/snippet}
				</Dropdown>
				<Button variant="primary" size="sm" onclick={openCreateDialog} class="whitespace-nowrap">
					<Icon icon="lucide:plus" class="w-4 h-4 mr-1.5 shrink-0" />
					Add Department
				</Button>
			</div>
		</div>
		{#if viewMode === 'table'}
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
					<TableUI.Row hoverable={true} onclick={() => openDetailDrawer(row.original)} class="cursor-pointer">
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableUI.Cell {cell}>
								{#if cell.column.id === 'name'}
									<div class="flex items-center gap-2" style="padding-left: {row.depth * 1.5}rem">
										{#if row.getCanExpand()}
											<button
												onclick={(e) => {
													e.stopPropagation();
													row.toggleExpanded();
												}}
												class="p-0.5 rounded shrink-0 text-slate-400 hover:text-brand-primary dark:hover:text-brand-primary cursor-pointer bg-slate-50 hover:bg-brand-light dark:bg-slate-800 transition-colors"
											>
												<Icon
													icon="lucide:chevron-right"
													class={cn(
														'w-4 h-4 transition-transform',
														isRowExpanded(row.id) && 'rotate-90'
													)}
												/>
											</button>
										{:else}
											<div class="w-5 shrink-0 flex justify-center">
												<div class="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>
											</div>
										{/if}
										<Icon
											icon={row.depth === 0 ? 'lucide:building-2' : 'lucide:corner-down-right'}
											class="w-4 h-4 text-slate-400 shrink-0"
										/>
										<span class="font-medium text-slate-900 dark:text-slate-100"
											>{cell.getValue()}</span
										>
									</div>
								{:else if cell.column.id === 'code'}
									<span
										class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 font-mono dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs"
										>{cell.getValue()}</span
									>
								{:else if cell.column.id === 'managerName'}
									<div class="flex items-center gap-2">
										<Avatar name={cell.getValue() as string} size="sm" variant="primary" />
										<span class="text-sm font-medium text-slate-700 dark:text-slate-300">
											{cell.getValue() || 'Unassigned'}
										</span>
									</div>
								{:else if cell.column.id === 'description'}
									<span
										class="text-slate-500 dark:text-slate-400 text-sm truncate max-w-[300px] block"
										title={cell.getValue() as string}>{cell.getValue() ?? '-'}</span
									>
								{:else if cell.column.id === 'status'}
									{@render statusBadge(cell.getValue() as string)}
								{:else if cell.column.id === 'actions'}
									<Dropdown align="right">
										{#snippet trigger(toggle)}
											<button
												onclick={(e) => {
													e.stopPropagation();
													toggle();
												}}
												class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
											>
												<Icon icon="lucide:more-horizontal" class="w-4 h-4" />
											</button>
										{/snippet}
										{#snippet content()}
											<div class="px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
												Actions
											</div>
											<DropdownItem class="text-xs font-normal gap-2" onclick={() => openDetailDrawer(row.original)}>
												<Icon icon="lucide:eye" class="w-4 h-4 text-slate-400" />
												View Details
											</DropdownItem>
											<DropdownItem class="text-xs font-normal gap-2" onclick={() => openEditDialog(row.original)}>
												<Icon icon="lucide:pencil" class="w-4 h-4 text-slate-400" />
												Edit Department
											</DropdownItem>
											<div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
											<DropdownItem class="text-xs font-normal gap-2" variant="danger" onclick={() => requestDelete(row.original)}>
												<Icon icon="lucide:trash-2" class="w-4 h-4" />
												Delete Department
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
		{:else}
			<DepartmentOrgChart departments={tree} onSelectDepartment={openDetailDrawer} />
		{/if}
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

<DepartmentDetailDrawer
	isOpen={isDrawerOpen}
	onClose={() => (isDrawerOpen = false)}
	department={selectedDepartment}
/>
