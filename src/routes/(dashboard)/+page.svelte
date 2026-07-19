<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import Icon from '@iconify/svelte';
  import { resolve } from '$app/paths';
  import type { Pathname } from '$app/types';

  const stats = [
    {
      title: 'Total Employees',
      value: '185',
      icon: 'lucide:users',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
      trend: '+12%',
      trendColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
      trendIcon: 'lucide:arrow-up-right',
      subtext: '14 new hires this month'
    },
    {
      title: 'Present Today',
      value: '172 (93%)',
      icon: 'lucide:check-square',
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400',
      trend: '+2.4%',
      trendColor: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400',
      trendIcon: 'lucide:arrow-up-right',
      subtext: 'vs 91.5% average last week'
    },
    {
      title: 'On Leave',
      value: '8',
      icon: 'lucide:plane',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
      trend: '-15%',
      trendColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400',
      trendIcon: 'lucide:arrow-down-left',
      subtext: '3 returning tomorrow'
    },
    {
      title: 'Upcoming Reviews',
      value: '4',
      icon: 'lucide:star',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400',
      trend: 'Soon',
      trendColor: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
      trendIcon: 'lucide:clock',
      subtext: 'Next evaluations on Friday'
    }
  ];
</script>

<svelte:head>
  <title>Dashboard | HRIS</title>
</svelte:head>

<!-- Welcome Header -->
<div class="flex flex-col gap-1">
  <Typography variant="h4" weight="bold" class="text-slate-900 dark:text-slate-50">
    Dashboard Overview
  </Typography>
  <Typography variant="body-sm" color="secondary">
    Welcome back, Admin! Here is what's happening today in your workforce.
  </Typography>
</div>

<!-- Metrics Dashboard Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {#each stats as stat (stat.title)}
    <Card variant="glow" hoverable={true} padding="sm" class="relative overflow-hidden">
      <div class="flex items-center justify-between">
        <Typography variant="caption" color="secondary" weight="medium">{stat.title}</Typography>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center {stat.color}">
          <Icon icon={stat.icon} class="w-4 h-4" />
        </div>
      </div>

      <div class="mt-4 flex items-baseline gap-2 flex-wrap">
        <Typography variant="h5" weight="bold" class="text-slate-900 dark:text-slate-50">
          {stat.value}
        </Typography>
        <span
          class="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] font-semibold {stat.trendColor}"
        >
          <Icon icon={stat.trendIcon} class="w-3 h-3" />
          {stat.trend}
        </span>
      </div>

      <div class="mt-2">
        <Typography variant="caption" color="muted" class="text-[11px]">{stat.subtext}</Typography>
      </div>
    </Card>
  {/each}
</div>

<!-- Main Content Grid -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Left Area (Leave request summary) -->
  <div class="lg:col-span-2 space-y-6">
    <Card
      variant="accent-warning"
      title="Leave Requests"
      description="Review employee leave requests that require pending actions."
    >
      <div class="mt-4 divide-y divide-neutral-border overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 font-semibold border-b border-neutral-border pb-3">
              <th class="py-2.5 font-bold">Employee</th>
              <th class="py-2.5 font-bold">Type</th>
              <th class="py-2.5 font-bold">Duration</th>
              <th class="py-2.5 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-border">
            {#each [{ name: 'Sarah L.', role: 'HR Manager', type: 'Annual Leave', duration: '3 days (Apr 20-22)' }, { name: 'Mark P.', role: 'Senior Developer', type: 'Sick Leave', duration: '1 day (Apr 18)' }] as leave (leave.name)}
              <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                <td class="py-3 flex items-center gap-2.5">
                  <div
                    class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center justify-center"
                  >
                    {leave.name.charAt(0)}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 dark:text-slate-200">{leave.name}</span>
                    <span class="text-[10px] text-slate-400">{leave.role}</span>
                  </div>
                </td>
                <td class="py-3 text-slate-600 dark:text-slate-300">{leave.type}</td>
                <td class="py-3 text-slate-600 dark:text-slate-300">{leave.duration}</td>
                <td class="py-3">
                  <div class="flex items-center gap-1.5">
                    <Button size="sm" variant="primary" class="h-7 px-2.5 text-[10px]"
                      >Approve</Button
                    >
                    <Button size="sm" variant="outline" class="h-7 px-2.5 text-[10px]"
                      >Reject</Button
                    >
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </Card>
  </div>

  <!-- Right Area (Quick Actions & Recent Activity) -->
  <div class="space-y-6">
    <Card title="Quick Actions">
      <div class="grid grid-cols-2 gap-2.5 mt-2">
        <a
          href={resolve('/employees' as Pathname)}
          class="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-border bg-neutral-card hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
        >
          <Icon
            icon="lucide:users"
            class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500"
          />
          <span class="text-[10px] font-semibold text-center">Staff Directory</span>
        </a>
        <button
          class="flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-border bg-neutral-card hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
        >
          <Icon
            icon="lucide:calendar"
            class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500"
          />
          <span class="text-[10px] font-semibold text-center">Log Time</span>
        </button>
      </div>
    </Card>
  </div>
</div>
