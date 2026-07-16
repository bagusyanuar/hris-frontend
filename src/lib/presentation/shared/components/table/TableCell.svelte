<script lang="ts" generics="TData, TValue">
	import type { Snippet } from 'svelte';
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { flexRender, type Cell } from '@tanstack/svelte-table';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { cellVariants } from './table.variants';

	interface CustomColumnMeta {
		align?: 'left' | 'center' | 'right';
		pinned?: 'left' | 'right' | 'none';
		className?: string;
		headerClassName?: string;
	}

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

	const context = getContext<{ density: 'default' | 'compact' }>('TABLE_CONTEXT');
	const density = $derived(context?.density ?? 'default');

	// Resolve styling and layout settings from TanStack Column Meta if cell is present
	const columnMeta = $derived(cell?.column.columnDef.meta as CustomColumnMeta | undefined);
	
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
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else if cell}
		{#if CellComponent}
			<CellComponent />
		{:else}
			{cell.column.columnDef.cell}
		{/if}
	{/if}
</td>
