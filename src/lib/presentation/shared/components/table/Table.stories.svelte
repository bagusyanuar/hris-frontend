<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import TableRoot from './TableRoot.svelte';

	const { Story } = defineMeta({
		title: 'DataTable',
		component: TableRoot
	});
</script>

<script lang="ts">
	import { getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/svelte-table';
	import * as Table from './index';
	import { createTable, createTableState } from './helpers.svelte';
	import Typography from '../typography/Typography.svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';

	interface Employee {
		id: string;
		name: string;
		email: string;
		role: string;
		department: string;
		status: 'Active' | 'Inactive';
	}

	const sampleData: Employee[] = [
		{ id: '1', name: 'Bagus Yanuar', email: 'bagus@company.com', role: 'Lead Frontend Developer', department: 'Technology', status: 'Active' },
		{ id: '2', name: 'Alice Smith', email: 'alice@company.com', role: 'UI/UX Designer', department: 'Design', status: 'Active' },
		{ id: '3', name: 'Bob Johnson', email: 'bob@company.com', role: 'Backend Engineer', department: 'Technology', status: 'Inactive' },
		{ id: '4', name: 'Clara Oswald', email: 'clara@company.com', role: 'HR Manager', department: 'Human Resources', status: 'Active' },
		{ id: '5', name: 'Danny Pink', email: 'danny@company.com', role: 'DevOps Engineer', department: 'Technology', status: 'Active' },
		{ id: '6', name: 'Emma Watson', email: 'emma@company.com', role: 'QA Engineer', department: 'Technology', status: 'Active' },
		{ id: '7', name: 'Frank Castle', email: 'frank@company.com', role: 'Security Engineer', department: 'Technology', status: 'Inactive' }
	];

	const columns = [
		{
			accessorKey: 'name',
			header: 'Nama',
			meta: {
				className: 'font-medium'
			}
		},
		{
			accessorKey: 'email',
			header: 'Email'
		},
		{
			accessorKey: 'role',
			header: 'Jabatan'
		},
		{
			accessorKey: 'department',
			header: 'Departemen'
		},
		{
			accessorKey: 'status',
			header: 'Status',
			meta: {
				align: 'center' as const
			}
		}
	];

	// Create table instance for general use
	let tableState = createTableState();
	let localTableStore = createTable({
		data: sampleData,
		columns,
		state: {
			get sorting() { return tableState.sorting; },
			get pagination() {
				return {
					pageIndex: tableState.pageIndex,
					pageSize: tableState.pageSize
				};
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				tableState.sorting = updater(tableState.sorting);
			} else {
				tableState.sorting = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				const next = updater({ pageIndex: tableState.pageIndex, pageSize: tableState.pageSize });
				tableState.pageIndex = next.pageIndex;
				tableState.pageSize = next.pageSize;
			} else {
				tableState.pageIndex = updater.pageIndex;
				tableState.pageSize = updater.pageSize;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		rowCount: sampleData.length
	});
	let localTable = $derived($localTableStore);

	// Create empty table instance
	let emptyTableState = createTableState();
	let emptyTableStore = createTable({
		data: [],
		columns,
		state: {
			get sorting() { return emptyTableState.sorting; },
			get pagination() {
				return {
					pageIndex: emptyTableState.pageIndex,
					pageSize: emptyTableState.pageSize
				};
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		rowCount: 0
	});
	let emptyTable = $derived($emptyTableStore);
</script>

<Story name="Default Table">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan</Typography>
		<Table.Root table={localTable}>
			<Table.Header>
				{#each localTable.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head {header} />
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each localTable.getRowModel().rows as row (row.id)}
					<Table.Row hoverable={true}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell {cell}>
								{#if cell.column.id === 'status'}
									<span class={cn(
										'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
										cell.getValue() === 'Active' 
											? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
											: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
									)}>
										{cell.getValue()}
									</span>
								{:else}
									{cell.getValue()}
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<Table.Pagination table={localTable} pageSizeOptions={[2, 5, 10]} />
	</div>
</Story>

<Story name="Compact Density">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Compact)</Typography>
		<Table.Root table={localTable} density="compact">
			<Table.Header>
				{#each localTable.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head {header} />
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each localTable.getRowModel().rows as row (row.id)}
					<Table.Row hoverable={true}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell {cell}>
								{#if cell.column.id === 'status'}
									<span class={cn(
										'inline-flex items-center rounded-full px-1.5 py-0.2 text-[10px] font-semibold',
										cell.getValue() === 'Active' 
											? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
											: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
									)}>
										{cell.getValue()}
									</span>
								{:else}
									{cell.getValue()}
								{/if}
							</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
		<Table.Pagination table={localTable} pageSizeOptions={[2, 5, 10]} />
	</div>
</Story>

<Story name="Loading State">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Loading)</Typography>
		<Table.Root table={localTable} isLoading={true}>
			<Table.Header>
				{#each localTable.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head {header} />
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#each localTable.getRowModel().rows as row (row.id)}
					<Table.Row>
						{#each row.getVisibleCells() as cell (cell.id)}
							<Table.Cell {cell}>{cell.getValue()}</Table.Cell>
						{/each}
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</Story>

<Story name="Empty State">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Empty)</Typography>
		<Table.Root table={emptyTable}>
			<Table.Header>
				{#each emptyTable.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head {header} />
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				<!-- Will render default empty state in TableRoot -->
			</Table.Body>
		</Table.Root>
	</div>
</Story>
