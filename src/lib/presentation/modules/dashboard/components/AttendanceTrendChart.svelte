<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import type { AttendanceTrendPoint } from '../runes/dashboard-query.svelte';

  interface Props {
    data: AttendanceTrendPoint[];
  }

  let { data }: Props = $props();

  let activeIndex = $state<number | null>(null);

  // Chart dimensions & scaling
  const chartHeight = 180;
  const chartWidth = 500;
  const paddingX = 30;
  const paddingY = 25;

  const maxVal = 200; // Expected max headcount scale

  function getX(index: number) {
    if (data.length <= 1) return paddingX;
    const step = (chartWidth - paddingX * 2) / (data.length - 1);
    return paddingX + index * step;
  }

  function getY(val: number) {
    const usableHeight = chartHeight - paddingY * 2;
    return chartHeight - paddingY - (val / maxVal) * usableHeight;
  }

  // Generate smooth SVG bezier curve path
  const points = $derived(data.map((d, i) => ({ x: getX(i), y: getY(d.present) })));

  const linePath = $derived.by(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, point, i, a) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = a[i - 1];
      const cx = (prev.x + point.x) / 2;
      return `${acc} C ${cx},${prev.y} ${cx},${point.y} ${point.x},${point.y}`;
    }, '');
  });

  const areaPath = $derived.by(() => {
    if (points.length === 0) return '';
    const lastX = points[points.length - 1].x;
    const firstX = points[0].x;
    const bottomY = chartHeight - paddingY;
    return `${linePath} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  });
</script>

<Card variant="default" padding="md" class="flex flex-col gap-4 h-full">
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div>
      <Typography variant="h6" weight="bold">Tren Kehadiran Mingguan</Typography>
      <Typography variant="caption" color="secondary">
        Statistik kehadiran karyawan selama 7 hari terakhir
      </Typography>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-brand-primary inline-block"></span>
        <Typography variant="caption" color="secondary" class="text-xs">Hadir</Typography>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
        <Typography variant="caption" color="secondary" class="text-xs">Terlambat</Typography>
      </div>
    </div>
  </div>

  <div class="relative w-full overflow-hidden pt-2 flex-1 flex items-end">
    <svg
      viewBox="0 0 {chartWidth} {chartHeight}"
      class="w-full h-auto overflow-visible select-none"
    >
      <defs>
        <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-brand-primary, #3b82f6)" stop-opacity="0.3" />
          <stop offset="100%" stop-color="var(--color-brand-primary, #3b82f6)" stop-opacity="0.0" />
        </linearGradient>
      </defs>

      <!-- Horizontal gridlines -->
      {#each [0, 50, 100, 150, 200] as gridVal (gridVal)}
        {@const y = getY(gridVal)}
        <line
          x1={paddingX}
          y1={y}
          x2={chartWidth - paddingX}
          y2={y}
          class="stroke-neutral-border"
          stroke-dasharray="3 3"
          stroke-width="1"
        />
      {/each}

      <!-- Area fill -->
      {#if areaPath}
        <path d={areaPath} fill="url(#attendanceGradient)" />
      {/if}

      <!-- Line path -->
      {#if linePath}
        <path
          d={linePath}
          fill="none"
          class="stroke-brand-primary"
          stroke-width="2.5"
          stroke-linecap="round"
        />
      {/if}

      <!-- Data points & interactive hover -->
      {#each data as item, i (i)}
        {@const pt = points[i]}
        <!-- Vertical guide line on hover -->
        {#if activeIndex === i}
          <line
            x1={pt.x}
            y1={paddingY}
            x2={pt.x}
            y2={chartHeight - paddingY}
            class="stroke-brand-primary"
            stroke-width="1"
            stroke-dasharray="2 2"
          />
        {/if}

        <!-- Point dot -->
        <circle
          role="button"
          aria-label="{item.day}: {item.present} hadir"
          tabindex="0"
          cx={pt.x}
          cy={pt.y}
          r={activeIndex === i ? '6' : '4'}
          class="fill-white stroke-brand-primary transition-all duration-150 cursor-pointer focus:outline-none"
          stroke-width="2.5"
          onmouseenter={() => (activeIndex = i)}
          onmouseleave={() => (activeIndex = null)}
          onfocus={() => (activeIndex = i)}
          onblur={() => (activeIndex = null)}
        />

        <!-- X-axis label -->
        <text
          x={pt.x}
          y={chartHeight - 6}
          text-anchor="middle"
          class="text-[11px] fill-slate-400 dark:fill-slate-500 font-medium"
        >
          {item.day}
        </text>
      {/each}
    </svg>

    <!-- Active Hover Tooltip -->
    {#if activeIndex !== null && data[activeIndex]}
      {@const active = data[activeIndex]}
      <div
        class="mt-2 p-2.5 bg-neutral-card border border-neutral-border rounded-xl shadow-sm flex items-center justify-between text-xs"
      >
        <div class="flex items-center gap-2">
          <Badge variant="primary" size="sm">{active.day}</Badge>
          <Typography variant="caption" weight="bold">
            {active.present} Karyawan Hadir
          </Typography>
        </div>
        <div class="flex items-center gap-3">
          <Typography
            variant="caption"
            color="secondary"
            class="text-amber-600 dark:text-amber-400"
          >
            Terlambat: {active.late}
          </Typography>
          <Typography variant="caption" color="secondary" class="text-rose-600 dark:text-rose-400">
            Absen: {active.absent}
          </Typography>
        </div>
      </div>
    {/if}
  </div>
</Card>
