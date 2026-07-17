<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';

	// NOTE: no `component` here on purpose. These are compound stories that
	// render their own <TableUI.Root>. Setting `component` makes addon-svelte-csf
	// wrap every story's content inside an extra (prop-less) TableRoot, which then
	// renders a stray "Tidak ada data" empty state below each story.
	const { Story } = defineMeta({
		title: 'DataTable'
	});

	interface Employee {
		id: string;
		name: string;
		email: string;
		role: string;
		department: string;
		status: 'Active' | 'Inactive';
	}
</script>

<script lang="ts">
	import { getCoreRowModel, getSortedRowModel, getPaginationRowModel, getExpandedRowModel, type Table, type ColumnDef } from '@tanstack/svelte-table';
	import * as TableUI from './index';
	import {
		createTable,
		createTableState,
		createRowNumberColumn,
		getRowNumber,
		ROW_NUMBER_COLUMN_ID
	} from './helpers.svelte';
	import Typography from '../typography/Typography.svelte';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';

	const sampleData: Employee[] = [
		{ id: '1', name: 'Bagus Yanuar', email: 'bagus@company.com', role: 'Lead Frontend Developer', department: 'Technology', status: 'Active' },
		{ id: '2', name: 'Alice Smith', email: 'alice@company.com', role: 'UI/UX Designer', department: 'Design', status: 'Active' },
		{ id: '3', name: 'Bob Johnson', email: 'bob@company.com', role: 'Backend Engineer', department: 'Technology', status: 'Inactive' },
		{ id: '4', name: 'Clara Oswald', email: 'clara@company.com', role: 'HR Manager', department: 'Human Resources', status: 'Active' },
		{ id: '5', name: 'Danny Pink', email: 'danny@company.com', role: 'DevOps Engineer', department: 'Technology', status: 'Active' },
		{ id: '6', name: 'Emma Watson', email: 'emma@company.com', role: 'QA Engineer', department: 'Technology', status: 'Active' },
		{ id: '7', name: 'Frank Castle', email: 'frank@company.com', role: 'Security Engineer', department: 'Technology', status: 'Inactive' }
	];

	const columns: ColumnDef<Employee>[] = [
		{ accessorKey: 'name', header: 'Nama', meta: { className: 'font-medium' } },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'role', header: 'Jabatan' },
		{ accessorKey: 'department', header: 'Departemen' },
		{ accessorKey: 'status', header: 'Status', meta: { align: 'center' } }
	];

	// Wider column set (with explicit sizes + pinned meta) to demo frozen columns.
	const freezeColumns: ColumnDef<Employee>[] = [
		{ accessorKey: 'name', header: 'Nama', size: 200, meta: { pinned: 'left', className: 'font-medium' } },
		{ accessorKey: 'email', header: 'Email', size: 260, meta: { pinned: 'left' } },
		{ accessorKey: 'role', header: 'Jabatan', size: 260 },
		{ accessorKey: 'department', header: 'Departemen', size: 240 },
		{ accessorKey: 'status', header: 'Status', size: 140, meta: { align: 'center', pinned: 'right' } }
	];

	/** Factory: build a reactive table instance from a dataset. */
	function buildTable(
		data: Employee[],
		pageSize = 10,
		cols: ColumnDef<Employee>[] = columns,
		expandable = false
	) {
		const state = createTableState({ pageSize });
		const store = createTable({
			data,
			columns: cols,
			state: {
				get sorting() { return state.sorting; },
				get pagination() {
					return { pageIndex: state.pageIndex, pageSize: state.pageSize };
				},
				get expanded() { return state.expanded; }
			},
			onSortingChange: (updater) => {
				state.sorting = typeof updater === 'function' ? updater(state.sorting) : updater;
			},
			onPaginationChange: (updater) => {
				const current = { pageIndex: state.pageIndex, pageSize: state.pageSize };
				const next = typeof updater === 'function' ? updater(current) : updater;
				state.pageIndex = next.pageIndex;
				state.pageSize = next.pageSize;
			},
			onExpandedChange: (updater) => {
				state.expanded = typeof updater === 'function' ? updater(state.expanded) : updater;
			},
			getRowCanExpand: () => expandable,
			getCoreRowModel: getCoreRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			rowCount: data.length
		});
		return store;
	}

	// One instance per story so Storybook's Docs view (all stories mounted at
	// once) never shares pagination/sorting state between cards.
	const defaultTable = buildTable(sampleData);
	const compactTable = buildTable(sampleData);
	const loadingTable = buildTable(sampleData);
	const customLoadingTable = buildTable(sampleData);
	const emptyTable = buildTable([]);
	const customEmptyTable = buildTable([]);
	const customPageSizeTable = buildTable(sampleData, 5);
	const freezeTable = buildTable(sampleData, 10, freezeColumns);
	const rowIndexTable = buildTable(sampleData, 5, [createRowNumberColumn<Employee>(), ...columns]);

	// Expandable table uses UNCONTROLLED state (no state getter / onExpandedChange).
	const expandableTable = createTable({
		data: sampleData,
		columns,
		initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
		getRowCanExpand: () => true,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		rowCount: sampleData.length
	});

	let expandableRows = $derived(expandableTable.current.getRowModel().rows);

	// Row objects from TanStack keep a stable identity across re-renders (only
	// external table state mutates), so a keyed {#each (row.id)} block does not
	// re-run its body when `row.getIsExpanded()` flips — Svelte sees the same
	// `row` reference and skips it. Reading `expanded` state straight off the
	// table here (a genuine reactive read) keeps this condition live.
	function isRowExpanded(rowId: string): boolean {
		const expanded = expandableTable.current.getState().expanded;
		return expanded === true || !!expanded?.[rowId];
	}
</script>

<!-- Shared status badge cell -->
{#snippet statusBadge(value: unknown)}
	<span
		class={cn(
			'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
			value === 'Active'
				? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
				: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
		)}
	>
		{String(value)}
	</span>
{/snippet}

<!-- Shared header markup -->
{#snippet tableHead(t: Table<Employee>)}
	<TableUI.Header>
		{#each t.getHeaderGroups() as headerGroup (headerGroup.id)}
			<TableUI.Row>
				{#each headerGroup.headers as header (header.id)}
					<TableUI.Head {header} />
				{/each}
			</TableUI.Row>
		{/each}
	</TableUI.Header>
{/snippet}

<!-- Shared body markup -->
{#snippet tableBody(t: Table<Employee>)}
	<TableUI.Body>
		{#each t.getRowModel().rows as row (row.id)}
			<TableUI.Row hoverable={true}>
				{#each row.getVisibleCells() as cell (cell.id)}
					<TableUI.Cell {cell}>
						{#if cell.column.id === ROW_NUMBER_COLUMN_ID}
							{getRowNumber(t, cell.row)}
						{:else if cell.column.id === 'status'}
							{@render statusBadge(cell.getValue())}
						{:else}
							{cell.getValue()}
						{/if}
					</TableUI.Cell>
				{/each}
			</TableUI.Row>
		{/each}
	</TableUI.Body>
{/snippet}

<Story name="Default">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan</Typography>
		<TableUI.Root table={defaultTable.current}>
			{@render tableHead(defaultTable.current)}
			{@render tableBody(defaultTable.current)}
		</TableUI.Root>
		<TableUI.Pagination table={defaultTable.current} pageSizeOptions={[2, 5, 10]} />
	</div>
</Story>

<Story name="Compact Density">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Compact)</Typography>
		<TableUI.Root table={compactTable.current} density="compact">
			{@render tableHead(compactTable.current)}
			{@render tableBody(compactTable.current)}
		</TableUI.Root>
		<TableUI.Pagination table={compactTable.current} pageSizeOptions={[2, 5, 10]} />
	</div>
</Story>

<Story name="Loading">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Loading)</Typography>
		<TableUI.Root table={loadingTable.current} isLoading={true}>
			{@render tableHead(loadingTable.current)}
			{@render tableBody(loadingTable.current)}
		</TableUI.Root>
	</div>
</Story>

<Story name="Custom Loading Element">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Custom Loading)</Typography>
		<TableUI.Root table={customLoadingTable.current} isLoading={true}>
			{@render tableHead(customLoadingTable.current)}
			{@render tableBody(customLoadingTable.current)}
			{#snippet loading()}
				<div class="flex flex-col items-center justify-center gap-3 rounded-xl border border-neutral-border bg-neutral-card p-8 shadow-sm">
					<div class="flex gap-1.5">
						{#each [0, 1, 2] as dot (dot)}
							<span class="h-2.5 w-2.5 animate-bounce rounded-full bg-brand-primary" style="animation-delay: {dot * 0.15}s"></span>
						{/each}
					</div>
					<Typography variant="body-sm" color="secondary">Sedang mengambil data karyawan…</Typography>
				</div>
			{/snippet}
		</TableUI.Root>
	</div>
</Story>

<Story name="No Data">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Kosong)</Typography>
		<TableUI.Root table={emptyTable.current}>
			{@render tableHead(emptyTable.current)}
			<TableUI.Body />
		</TableUI.Root>
	</div>
</Story>

<Story name="Custom No Data Element">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Custom Kosong)</Typography>
		<TableUI.Root table={customEmptyTable.current}>
			{@render tableHead(customEmptyTable.current)}
			<TableUI.Body />
			{#snippet empty()}
				<div class="flex flex-col items-center justify-center border-t border-neutral-border p-12 text-center">
					<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light">
						<Icon icon="lucide:user-plus" class="h-8 w-8 text-brand-primary" />
					</div>
					<Typography variant="body-md" weight="semibold">Belum ada karyawan</Typography>
					<Typography variant="caption" color="secondary" class="mt-1">
						Mulai dengan menambahkan karyawan pertama Anda.
					</Typography>
				</div>
			{/snippet}
		</TableUI.Root>
	</div>
</Story>

<Story name="Custom Page Size Options">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Custom Page Size)</Typography>
		<Typography variant="body-sm" color="secondary">
			Pilihan baris per halaman diatur lewat prop pageSizeOptions: [5, 15, 25].
		</Typography>
		<TableUI.Root table={customPageSizeTable.current}>
			{@render tableHead(customPageSizeTable.current)}
			{@render tableBody(customPageSizeTable.current)}
		</TableUI.Root>
		<TableUI.Pagination table={customPageSizeTable.current} pageSizeOptions={[5, 15, 25]} />
	</div>
</Story>

<Story name="Row Index">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Row Index)</Typography>
		<Typography variant="body-sm" color="secondary">
			Kolom nomor urut otomatis via createRowNumberColumn(). Nomor ikut pagination &
			tetap benar setelah sorting.
		</Typography>
		<TableUI.Root table={rowIndexTable.current}>
			{@render tableHead(rowIndexTable.current)}
			{@render tableBody(rowIndexTable.current)}
		</TableUI.Root>
		<TableUI.Pagination table={rowIndexTable.current} pageSizeOptions={[5, 10]} />
	</div>
</Story>

<Story name="Expandable Row">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Expandable)</Typography>
		<Typography variant="body-sm" color="secondary">
			Klik baris untuk buka/tutup detail karyawan.
		</Typography>
		<TableUI.Root table={expandableTable.current}>
			{@render tableHead(expandableTable.current)}
			<TableUI.Body>
				{#each expandableRows as row (row.id)}
					<TableUI.Row hoverable={true} onclick={() => row.toggleExpanded()}>
						{#each row.getVisibleCells() as cell (cell.id)}
							<TableUI.Cell {cell}>
								{#if cell.column.id === 'status'}
									{@render statusBadge(cell.getValue())}
								{:else}
									{cell.getValue()}
								{/if}
							</TableUI.Cell>
						{/each}
					</TableUI.Row>
					{#if isRowExpanded(row.id)}
						<TableUI.Row>
							<TableUI.Cell colspan={row.getVisibleCells().length}>
								<div class="flex flex-col gap-1 rounded-lg bg-neutral-bg/40 p-4">
									<Typography variant="body-sm" weight="semibold">Detail: {row.original.name}</Typography>
									<Typography variant="caption" color="secondary">
										{row.original.email} · {row.original.role} · {row.original.department}
									</Typography>
								</div>
							</TableUI.Cell>
						</TableUI.Row>
					{/if}
				{/each}
			</TableUI.Body>
		</TableUI.Root>
	</div>
</Story>

<Story name="Freeze Column">
	<div class="flex flex-col gap-4 p-4">
		<Typography variant="h5" weight="bold">Data Karyawan (Freeze Column)</Typography>
		<Typography variant="body-sm" color="secondary">
			Kolom Nama & Email di-freeze ke kiri (cumulative offset), Status di-freeze ke kanan.
			Scroll horizontal untuk melihat efeknya.
		</Typography>
		<div class="max-w-3xl">
			<TableUI.Root table={freezeTable.current}>
				{@render tableHead(freezeTable.current)}
				{@render tableBody(freezeTable.current)}
			</TableUI.Root>
		</div>
	</div>
</Story>
