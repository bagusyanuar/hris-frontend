<script lang="ts" generics="TData, TValue">
	import type { Snippet } from 'svelte';
	import type { HTMLThAttributes } from 'svelte/elements';
	import { getContext } from 'svelte';
	import { flexRender, type Header, type Table } from '@tanstack/svelte-table';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { headVariants } from './table.variants';
	import { getPinnedOffset } from './helpers.svelte';
	import Icon from '@iconify/svelte';

	interface Props extends HTMLThAttributes {
		header?: Header<TData, TValue>;
		align?: 'left' | 'center' | 'right';
		pinned?: 'left' | 'right' | 'none';
		children?: Snippet;
	}

	let {
		header,
		align,
		pinned,
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	const context = getContext<{ density: 'default' | 'compact'; table?: Table<TData> }>('TABLE_CONTEXT');
	const density = $derived(context?.density ?? 'default');

	// Resolve styling and layout settings from TanStack Column Meta if header is present
	const columnMeta = $derived(header?.column.columnDef.meta);
	
	const resolvedAlign = $derived(
		align ?? 
		columnMeta?.align ?? 
		(columnMeta?.headerClassName?.includes('text-right') 
			? 'right' 
			: columnMeta?.headerClassName?.includes('text-center') 
				? 'center' 
				: 'left')
	);

	const resolvedPinned = $derived(pinned ?? columnMeta?.pinned ?? 'none');

	// Cumulative sticky offset + fixed width so multiple pinned columns stack instead of overlapping.
	const pinnedStyle = $derived.by(() => {
		const table = context?.table;
		if (resolvedPinned === 'none' || !header || !table) return undefined;
		const { column } = header;
		const offset = getPinnedOffset(table, column.id, resolvedPinned);
		const size = column.getSize();
		return `${resolvedPinned}:${offset}px;width:${size}px;min-width:${size}px;`;
	});

	const isSortable = $derived(header?.column.getCanSort() ?? false);
	const isSorted = $derived(header?.column.getIsSorted());

	const isHeaderFunction = $derived(header && typeof header.column.columnDef.header === 'function');
	const HeaderComponent = $derived(
		isHeaderFunction
			? flexRender(header!.column.columnDef.header, header!.getContext())
			: null
	);

	function handleSort(e: MouseEvent) {
		if (isSortable && header) {
			header.column.getToggleSortingHandler()?.(e);
		}
	}
</script>

{#snippet headContent()}
	{#if children}
		{@render children()}
	{:else if header}
		{#if HeaderComponent}
			<HeaderComponent />
		{:else}
			{header.column.columnDef.header}
		{/if}
	{/if}

	{#if isSortable}
		<span class="inline-flex text-slate-400">
			{#if isSorted === 'asc'}
				<Icon icon="lucide:chevron-up" class="h-3.5 w-3.5 text-brand-primary" />
			{:else if isSorted === 'desc'}
				<Icon icon="lucide:chevron-down" class="h-3.5 w-3.5 text-brand-primary" />
			{:else}
				<Icon icon="lucide:chevrons-up-down" class="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
			{/if}
		</span>
	{/if}
{/snippet}

<th
	scope="col"
	class={cn(
		headVariants({
			density,
			align: resolvedAlign,
			pinned: resolvedPinned
		}),
		isSortable && 'cursor-pointer select-none hover:bg-neutral-bg/60',
		columnMeta?.headerClassName,
		className
	)}
	aria-sort={isSortable
		? isSorted === 'asc'
			? 'ascending'
			: isSorted === 'desc'
				? 'descending'
				: 'none'
		: undefined}
	style={pinnedStyle}
	{...restProps}
>
	{#if isSortable}
		<button
			type="button"
			onclick={handleSort}
			class={cn(
				'flex w-full items-center gap-1.5',
				resolvedAlign === 'center' && 'justify-center',
				resolvedAlign === 'right' && 'justify-end'
			)}
		>
			{@render headContent()}
		</button>
	{:else}
		<div
			class={cn(
				'flex items-center gap-1.5',
				resolvedAlign === 'center' && 'justify-center',
				resolvedAlign === 'right' && 'justify-end'
			)}
		>
			{@render headContent()}
		</div>
	{/if}
</th>
