<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import Icon from '@iconify/svelte';
  import type { KpiStat } from '../runes/dashboard-query.svelte';

  interface Props {
    kpis: KpiStat[];
  }

  let { kpis }: Props = $props();

  function getProgressColor(status: KpiStat['status']) {
    if (status === 'optimal') return 'bg-emerald-500';
    if (status === 'warning') return 'bg-amber-500';
    return 'bg-rose-500';
  }

  function getStatusLabel(status: KpiStat['status']) {
    if (status === 'optimal') return 'Optimal';
    if (status === 'warning') return 'Perlu Perhatian';
    return 'Di Bawah Target';
  }
</script>

<Card variant="default" padding="md" class="flex flex-col gap-4 h-full">
  <div class="flex items-center justify-between border-b border-neutral-border pb-3">
    <div class="flex items-center gap-2">
      <Icon icon="lucide:gauge" class="w-5 h-5 text-brand-primary" />
      <Typography variant="h6" weight="bold">KPI Karyawan</Typography>
    </div>
    <Badge variant="primary" size="sm">{kpis.length} Metrik</Badge>
  </div>

  <div class="flex flex-col gap-4 flex-1 justify-between">
    {#each kpis as kpi (kpi.name)}
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <Typography variant="body-sm" weight="medium">{kpi.name}</Typography>
          <Badge variant={kpi.status === 'optimal' ? 'success' : kpi.status === 'warning' ? 'warning' : 'danger'} size="sm">
            {getStatusLabel(kpi.status)}
          </Badge>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex-1 h-2.5 rounded-full bg-neutral-bg border border-neutral-border overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500 {getProgressColor(kpi.status)}"
              style="width: {kpi.score}%;"
            ></div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <Typography variant="caption" weight="bold">{kpi.score}%</Typography>
            <Typography variant="caption" color="muted" class="text-[10px]">/ {kpi.target}%</Typography>
          </div>
        </div>
      </div>
    {/each}
  </div>
</Card>
