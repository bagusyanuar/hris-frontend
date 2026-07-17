import {
	createSvelteTable,
	type TableOptions,
	type Table,
	type Row,
	type ColumnDef,
	type ExpandedState
} from '@tanstack/svelte-table';
import { get } from 'svelte/store';

/** Stable id used to detect the auto-generated row-number column. */
export const ROW_NUMBER_COLUMN_ID = '__row_number__';

/**
 * Visual, 1-based sequential number for a row, aligned with the active
 * pagination: `pageIndex * pageSize + positionInPage + 1`.
 * Uses the row's position in the current page model, so it stays correct
 * after sorting and works for both client- and server-side pagination.
 */
export function getRowNumber<TData>(table: Table<TData>, row: Row<TData>): number {
	const rows = table.getRowModel().rows;
	const { pageIndex, pageSize } = table.getState().pagination;
	return pageIndex * pageSize + rows.indexOf(row) + 1;
}

/**
 * Column definition for an auto row-index column. Prepend it to your columns
 * to render a sequential number per row without hand-declaring the column each
 * time: `columns: [createRowNumberColumn(), ...cols]`.
 * `<Table.Cell>` renders the number automatically for this column.
 */
export function createRowNumberColumn<TData>(header = 'No'): ColumnDef<TData> {
	return {
		id: ROW_NUMBER_COLUMN_ID,
		header,
		enableSorting: false,
		size: 64,
		meta: { align: 'center' }
	};
}

/**
 * Cumulative sticky offset (in px) for a pinned column, so multiple columns
 * pinned to the same side stack next to each other instead of overlapping at 0.
 *
 * For `left`: sums the widths of every left-pinned column BEFORE this one.
 * For `right`: sums the widths of every right-pinned column AFTER this one.
 * Widths come from TanStack's `column.getSize()`, so pinned columns should
 * declare a `size` in their column definition for pixel-accurate alignment.
 */
export function getPinnedOffset<TData>(
	table: Table<TData>,
	columnId: string,
	side: 'left' | 'right'
): number {
	const columns = table.getVisibleLeafColumns();
	const ordered = side === 'left' ? columns : [...columns].reverse();

	let offset = 0;
	for (const column of ordered) {
		if (column.columnDef.meta?.pinned !== side) continue;
		if (column.id === columnId) break;
		offset += column.getSize();
	}
	return offset;
}

export interface TableStateHelperOptions {
	pageIndex?: number;
	pageSize?: number;
	sorting?: { id: string; desc: boolean }[];
}

/**
 * Custom Svelte 5 Rune helper to initialize and manage reactive table state.
 * Simplifies managing sorting, pagination, selection, expansion, and visibility.
 */
export function createTableState(initial?: TableStateHelperOptions) {
	let pageIndex = $state(initial?.pageIndex ?? 0);
	let pageSize = $state(initial?.pageSize ?? 10);
	let sorting = $state<{ id: string; desc: boolean }[]>(initial?.sorting ?? []);
	let rowSelection = $state<Record<string, boolean>>({});
	let columnVisibility = $state<Record<string, boolean>>({});
	let expanded = $state<ExpandedState>({});

	return {
		get pageIndex() {
			return pageIndex;
		},
		set pageIndex(value: number) {
			pageIndex = value;
		},
		get pageSize() {
			return pageSize;
		},
		set pageSize(value: number) {
			pageSize = value;
		},
		get sorting() {
			return sorting;
		},
		set sorting(value) {
			sorting = value;
		},
		get rowSelection() {
			return rowSelection;
		},
		set rowSelection(value) {
			rowSelection = value;
		},
		get columnVisibility() {
			return columnVisibility;
		},
		set columnVisibility(value) {
			columnVisibility = value;
		},
		get expanded() {
			return expanded;
		},
		set expanded(value) {
			expanded = value;
		},
		reset() {
			pageIndex = initial?.pageIndex ?? 0;
			pageSize = initial?.pageSize ?? 10;
			sorting = initial?.sorting ?? [];
			rowSelection = {};
			columnVisibility = {};
			expanded = {};
		}
	};
}

/**
 * Wraps `@tanstack/svelte-table`'s `createSvelteTable` for Svelte 5.
 *
 * `createSvelteTable` returns a plain Svelte store that re-emits the SAME
 * `Table` object reference on every state change (sorting, pagination,
 * expansion, ...) since TanStack mutates it in place. `let x = $derived($store)`
 * does not reliably re-run in that case (Svelte's dirty-check on a `$derived`
 * chained from a store doesn't propagate when the emitted reference is
 * unchanged), so interactions like row click-to-expand or header-click sort
 * silently stop updating the UI. Manually subscribing into a `$state` avoids
 * relying on that `$derived`-from-store chain and reacts on every emission.
 */
export function createTable<TData>(options: TableOptions<TData>) {
	const store = createSvelteTable(options);
	let table = $state(get(store)) as Table<TData>;

	$effect(() => {
		return store.subscribe((value) => {
			table = value;
		});
	});

	return {
		get current() {
			return table;
		}
	};
}
