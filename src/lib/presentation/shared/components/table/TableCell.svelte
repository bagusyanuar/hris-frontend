<script lang="ts" generics="TData, TValue">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { flexRender, type Cell, type Table } from '@tanstack/svelte-table';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { cellVariants } from './table.variants';
	import { getPinnedOffset, getRowNumber, ROW_NUMBER_COLUMN_ID } from './helpers.svelte';

	interface Props extends HTMLTdAttributes {
		cell?: Cell<TData, TValue>;
		align?: 'left' | 'center' | 'right';
		pinned?: 'left' | 'right' | 'none';
		children?: Snippet;
	}

	let {
		cell,
		align,
		pinned,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const context = getContext<{ density: 'default' | 'compact'; table?: Table<TData> }>('TABLE_CONTEXT');
	const density = $derived(context?.density ?? 'default');

	// Resolve styling and layout settings from TanStack Column Meta if cell is present
	const columnMeta = $derived(cell?.column.columnDef.meta);
	
	const resolvedAlign = $derived(
		align ?? 
		columnMeta?.align ?? 
		(columnMeta?.className?.includes('text-right') 
			? 'right' 
			: columnMeta?.className?.includes('text-center') 
				? 'center' 
				: 'left')
	);
	const resolvedPinned = $derived(pinned ?? columnMeta?.pinned ?? 'none');

	// Cumulative sticky offset + fixed width so multiple pinned columns stack instead of overlapping.
	const pinnedStyle = $derived.by(() => {
		const table = context?.table;
		if (resolvedPinned === 'none' || !cell || !table) return undefined;
		const { column } = cell;
		const offset = getPinnedOffset(table, column.id, resolvedPinned);
		const size = column.getSize();
		return `${resolvedPinned}:${offset}px;width:${size}px;min-width:${size}px;`;
	});

	// Auto row-index column: render the computed sequential number.
	const isRowNumber = $derived(cell?.column.id === ROW_NUMBER_COLUMN_ID);
	const rowNumber = $derived.by(() => {
		const table = context?.table;
		if (!isRowNumber || !cell || !table) return null;
		return getRowNumber(table, cell.row);
	});

	const isCellFunction = $derived(cell && typeof cell.column.columnDef.cell === 'function');
	const CellComponent = $derived(
		isCellFunction
			? flexRender(cell!.column.columnDef.cell, cell!.getContext())
			: null
	);
</script>

<td
	class={cn(
		cellVariants({
			density,
			align: resolvedAlign,
			pinned: resolvedPinned
		}),
		columnMeta?.className,
		className
	)}
	style={pinnedStyle}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if isRowNumber}
		{rowNumber}
	{:else if cell}
		{#if CellComponent}
			<CellComponent />
		{:else}
			{cell.column.columnDef.cell}
		{/if}
	{/if}
</td>
