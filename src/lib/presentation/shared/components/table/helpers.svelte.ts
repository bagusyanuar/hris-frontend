import { createSvelteTable, type TableOptions } from '@tanstack/svelte-table';

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
	let expanded = $state<Record<string, boolean>>({});

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
 * Wraps `@tanstack/svelte-table`'s `createSvelteTable` to ensure Svelte 5 reactive options are handled properly.
 */
export function createTable<TData>(options: TableOptions<TData>) {
	return createSvelteTable(options);
}
