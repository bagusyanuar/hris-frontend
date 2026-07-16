<script lang="ts" generics="TData">
	import { getContext } from 'svelte';
	import type { Table } from '@tanstack/svelte-table';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import Button from '../button/Button.svelte';
	import Typography from '../typography/Typography.svelte';
	import Icon from '@iconify/svelte';

	interface Props {
		table?: Table<TData>;
		class?: string;
		pageSizeOptions?: number[];
	}

	let {
		table: propTable,
		class: className = '',
		pageSizeOptions = [10, 20, 50, 100]
	}: Props = $props();

	// Fallback to reading table from context if not supplied as prop
	const context = getContext<{ table: Table<TData> }>('TABLE_CONTEXT');
	const table = $derived(propTable ?? context?.table);

	const paginationState = $derived(table?.getState().pagination);
	const pageIndex = $derived(paginationState?.pageIndex ?? 0);
	const pageSize = $derived(paginationState?.pageSize ?? 10);
	const pageCount = $derived(table?.getPageCount() ?? 0);
	const totalRows = $derived(table?.getRowCount() ?? 0);

	// Pagination text: "Menampilkan 1-10 dari 100 data"
	const startIdx = $derived(totalRows === 0 ? 0 : pageIndex * pageSize + 1);
	const endIdx = $derived(Math.min(totalRows, (pageIndex + 1) * pageSize));

	// Calculate sliding range of page numbers
	const pageRange = $derived(() => {
		if (pageCount <= 7) {
			return Array.from({ length: pageCount }, (_, i) => i + 1);
		}

		const current = pageIndex + 1;
		const range: (number | string)[] = [];

		range.push(1);

		if (current - 2 > 2) {
			range.push('...');
		}

		const start = Math.max(2, current - 2);
		const end = Math.min(pageCount - 1, current + 2);

		for (let i = start; i <= end; i++) {
			range.push(i);
		}

		if (current + 2 < pageCount - 1) {
			range.push('...');
		}

		range.push(pageCount);
		return range;
	});
</script>

{#if table}
	<div
		class={cn(
			'flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-6 border-t border-neutral-border bg-neutral-card',
			className
		)}
	>
		<!-- Left: Row Count Info -->
		<div class="flex items-center gap-1">
			<Typography variant="body-sm" color="secondary">
				Menampilkan
			</Typography>
			<Typography variant="body-sm" weight="semibold">
				{startIdx}-{endIdx}
			</Typography>
			<Typography variant="body-sm" color="secondary">
				dari
			</Typography>
			<Typography variant="body-sm" weight="semibold">
				{totalRows}
			</Typography>
			<Typography variant="body-sm" color="secondary">
				data
			</Typography>
		</div>

		<!-- Right: Pagination Buttons & Page Size Selector -->
		<div class="flex flex-wrap items-center gap-6">
			<!-- Page Size Selector -->
			<div class="flex items-center gap-2">
				<Typography variant="body-sm" color="secondary">
					Baris per halaman:
				</Typography>
				<select
					value={pageSize}
					onchange={(e) => table.setPageSize(Number((e.target as HTMLSelectElement).value))}
					class="rounded-lg border border-neutral-border bg-neutral-card py-1 px-2 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-brand-primary transition-colors cursor-pointer"
				>
					{#each pageSizeOptions as option (option)}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>

			<!-- Pagination Controls -->
			<div class="flex items-center gap-1">
				<!-- First Page -->
				<Button
					variant="ghost"
					size="icon"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
					class="h-8 w-8 text-slate-500 hover:text-brand-primary"
				>
					<Icon icon="lucide:chevrons-left" class="h-4 w-4" />
				</Button>

				<!-- Prev Page -->
				<Button
					variant="ghost"
					size="icon"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					class="h-8 w-8 text-slate-500 hover:text-brand-primary"
				>
					<Icon icon="lucide:chevron-left" class="h-4 w-4" />
				</Button>

				<!-- Page Numbers -->
				<div class="flex items-center gap-1">
					{#each pageRange() as page, index (index)}
						{#if page === '...'}
							<span class="px-2 text-slate-400 select-none">...</span>
						{:else}
							<Button
								variant={pageIndex === (page as number) - 1 ? 'primary' : 'ghost'}
								size="sm"
								onclick={() => table.setPageIndex((page as number) - 1)}
								class={cn(
									'h-8 min-w-[32px] px-2 rounded-lg font-medium',
									pageIndex === (page as number) - 1
										? 'bg-brand-primary text-white hover:bg-brand-hover'
										: 'text-slate-600 hover:text-brand-primary dark:text-slate-400'
								)}
							>
								{page}
							</Button>
						{/if}
					{/each}
				</div>

				<!-- Next Page -->
				<Button
					variant="ghost"
					size="icon"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					class="h-8 w-8 text-slate-500 hover:text-brand-primary"
				>
					<Icon icon="lucide:chevron-right" class="h-4 w-4" />
				</Button>

				<!-- Last Page -->
				<Button
					variant="ghost"
					size="icon"
					onclick={() => table.setPageIndex(pageCount - 1)}
					disabled={!table.getCanNextPage()}
					class="h-8 w-8 text-slate-500 hover:text-brand-primary"
				>
					<Icon icon="lucide:chevrons-right" class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
{/if}
