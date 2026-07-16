<script lang="ts" generics="TData">
	import type { Snippet } from 'svelte';
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { setContext } from 'svelte';
	import type { Table } from '@tanstack/svelte-table';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { tableVariants } from './table.variants';
	import Icon from '@iconify/svelte';
	import Typography from '../typography/Typography.svelte';

	interface Props extends HTMLTableAttributes {
		table: Table<TData>;
		isLoading?: boolean;
		density?: 'default' | 'compact';
		class?: string;
		children?: Snippet;
		loading?: Snippet;
		empty?: Snippet;
	}

	let {
		table,
		isLoading = false,
		density = 'default',
		class: className = '',
		children,
		loading,
		empty,
		...restProps
	}: Props = $props();

	// Provide context so that child components (Header, Row, Cell, Pagination) can read settings
	setContext('TABLE_CONTEXT', {
		get density() {
			return density;
		},
		get table() {
			return table;
		},
		get isLoading() {
			return isLoading;
		}
	});

	const hasNoData = $derived(!table || table.getRowModel()?.rows?.length === 0);
</script>

<div class="relative w-full overflow-x-auto rounded-xl border border-neutral-border bg-neutral-card">
	<table class={cn(tableVariants({ density }), className)} {...restProps}>
		{#if children}
			{@render children()}
		{/if}
	</table>

	{#if isLoading}
		<!-- Loading overlay: covers the data rows so stale data and the loader never show together -->
		<div class="absolute inset-0 z-30 flex items-center justify-center bg-neutral-card/70 backdrop-blur-sm">
			{#if loading}
				{@render loading()}
			{:else}
				<!-- Default Loading Spinner -->
				<div class="flex flex-col items-center gap-3">
					<Icon icon="lucide:loader-2" class="h-8 w-8 animate-spin text-brand-primary" />
					<Typography variant="body-sm" color="secondary">Memuat data...</Typography>
				</div>
			{/if}
		</div>
	{:else if hasNoData}
		{#if empty}
			{@render empty()}
		{:else}
			<!-- Default Empty State -->
			<div class="flex flex-col items-center justify-center p-12 text-center border-t border-neutral-border">
				<Icon icon="lucide:database" class="h-10 w-10 text-slate-400 mb-3" />
				<Typography variant="body-md" weight="medium">
					Tidak ada data
				</Typography>
				<Typography variant="caption" color="secondary" class="mt-1">
					Data yang Anda cari tidak ditemukan.
				</Typography>
			</div>
		{/if}
	{/if}
</div>
