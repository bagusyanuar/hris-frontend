<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import type { DepartmentStat } from '../runes/dashboard-query.svelte';

  interface Props {
    departments: DepartmentStat[];
  }

  let { departments }: Props = $props();

  const totalHeadcount = $derived(departments.reduce((acc, d) => acc + d.count, 0));
</script>

<Card variant="default" padding="md" class="flex flex-col gap-4 h-full">
  <div>
    <Typography variant="h6" weight="bold">Distribusi Departemen</Typography>
    <Typography variant="caption" color="secondary">
      Jumlah {totalHeadcount} karyawan terbagi dalam {departments.length} divisi
    </Typography>
  </div>

  <!-- Multi-segment progress bar -->
  <div class="h-3 w-full rounded-full bg-neutral-bg flex overflow-hidden border border-neutral-border p-0.5">
    {#each departments as dept}
      <div
        class="h-full rounded-sm transition-all duration-300"
        style="width: {dept.percentage}%; background-color: {dept.color};"
        title="{dept.name}: {dept.count} ({dept.percentage}%)"
      ></div>
    {/each}
  </div>

  <!-- Department List -->
  <div class="flex flex-col gap-2.5 mt-1 flex-1">
    {#each departments as dept}
      <div class="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-bg/60 transition-colors">
        <div class="flex items-center gap-2.5">
          <span
            class="w-3 h-3 rounded-full shrink-0"
            style="background-color: {dept.color};"
          ></span>
          <Typography variant="body-sm" weight="medium" class="text-slate-800 dark:text-slate-200">
            {dept.name}
          </Typography>
        </div>
        <div class="flex items-center gap-2">
          <Typography variant="caption" weight="bold">
            {dept.count}
          </Typography>
          <Typography variant="caption" color="muted" class="text-[11px]">
            ({dept.percentage}%)
          </Typography>
        </div>
      </div>
    {/each}
  </div>
</Card>
