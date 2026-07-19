<script lang="ts">
  import type { Table, Row } from '@tanstack/svelte-table';
  import type { JobPositionModel } from '$lib/core/job-position';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import Icon from '@iconify/svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { slide } from 'svelte/transition';

  let { table }: { table: Table<JobPositionModel & { children?: JobPositionModel[] }> } = $props();

  // We only get the root level rows because we will render children recursively
  let rootRows = $derived(table.getCoreRowModel().rows.filter((row) => row.depth === 0));
</script>

{#snippet renderNode(
  row: Row<JobPositionModel & { children?: JobPositionModel[] }>,
  isLast: boolean,
  isFirst: boolean
)}
  <div class="relative pt-3 first:pt-0">
    <!-- Vertical and Horizontal connecting lines (only for children, depth > 0) -->
    {#if row.depth > 0}
      <div
        class="absolute w-px bg-slate-200 dark:bg-slate-700 z-0"
        style="left: -1.5rem; top: {isFirst ? '-1rem' : '0'}; height: {isLast
          ? isFirst
            ? '3rem'
            : '2rem'
          : isFirst
            ? 'calc(100% + 1rem)'
            : '100%'};"
      ></div>
      <div
        class="absolute h-px bg-slate-200 dark:bg-slate-700 z-0"
        style="left: -1.5rem; top: 2rem; width: 1.5rem;"
      ></div>
    {/if}

    <!-- Card -->
    <div class="relative z-10 w-full max-w-sm mb-3">
      <Card
        class={cn(
          'transition-all duration-200 hover:shadow-md border-l-4 shadow-sm',
          row.original.status === 'active' ? 'border-l-emerald-500' : 'border-l-slate-400'
        )}
      >
        <div class="flex flex-col gap-3">
          <div class="flex items-start justify-between gap-3">
            <div class="flex flex-col gap-0.5">
              <Typography variant="h6" weight="semibold">{row.original.name}</Typography>
              <span class="text-xs text-slate-500 dark:text-slate-400">
                {row.original.jobTitleName || '-'} • {row.original.departmentName || '-'}
              </span>
            </div>
            {#if row.getCanExpand()}
              <button
                onclick={() => row.toggleExpanded()}
                class="p-1 rounded-md bg-slate-100 hover:bg-brand-light dark:bg-slate-800 dark:hover:bg-brand-900/30 transition-colors text-slate-500 hover:text-brand-primary shrink-0"
              >
                <Icon
                  icon="lucide:chevron-down"
                  class={cn(
                    'w-4 h-4 transition-transform duration-200',
                    row.getIsExpanded() ? 'rotate-180' : ''
                  )}
                />
              </button>
            {/if}
          </div>

          <div class="flex items-center justify-between mt-1">
            <div
              class="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800"
            >
              <Icon icon="lucide:users" class="w-3.5 h-3.5" />
              Quota: {row.original.headcountQuota}
            </div>
            <Badge
              variant={row.original.status === 'active' ? 'success' : 'default'}
              class="text-[10px] px-1.5 py-0 font-medium"
            >
              {row.original.status === 'active' ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>

    <!-- Children -->
    {#if row.getIsExpanded() && row.subRows?.length}
      <div class="ml-6 relative" transition:slide={{ duration: 200 }}>
        {#each row.subRows as subRow, i (subRow.id)}
          {@render renderNode(subRow, i === row.subRows.length - 1, i === 0)}
        {/each}
      </div>
    {/if}
  </div>
{/snippet}

<div
  class="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto min-h-[400px]"
>
  <div class="min-w-fit flex flex-col pt-2 pb-8 px-4">
    {#if rootRows.length === 0}
      <div
        class="flex flex-col items-center justify-center py-16 text-center text-slate-500 w-full h-full"
      >
        <div
          class="w-16 h-16 mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center"
        >
          <Icon icon="lucide:network" class="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <Typography variant="h6" color="secondary" weight="medium">Belum ada data</Typography>
        <Typography variant="body-sm" color="secondary" class="mt-1">
          Data bagan organisasi akan tampil di sini.
        </Typography>
      </div>
    {:else}
      {#each rootRows as row, i (row.id)}
        {@render renderNode(row, i === rootRows.length - 1, i === 0)}
      {/each}
    {/if}
  </div>
</div>
