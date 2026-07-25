<script lang="ts">
  import { useDashboardQuery } from '../runes/dashboard-query.svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Button } from '$lib/presentation/shared/components/button';
  import Icon from '@iconify/svelte';
  import DashboardStatCard from '../components/DashboardStatCard.svelte';
  import AttendanceTrendChart from '../components/AttendanceTrendChart.svelte';
  import DepartmentDistributionChart from '../components/DepartmentDistributionChart.svelte';
  import PendingLeaveTable from '../components/PendingLeaveTable.svelte';
  import EmployeeKpiCard from '../components/EmployeeKpiCard.svelte';

  const query = useDashboardQuery();
</script>

<div class="flex flex-col gap-6">
  <!-- Welcome Header -->
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div class="flex flex-col gap-1">
      <Typography variant="h4" weight="bold">Ringkasan Dasbor</Typography>
      <Typography variant="body-sm" color="secondary">
        Ringkasan metrik tenaga kerja dan tindakan yang tertunda hari ini.
      </Typography>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Icon icon="lucide:download" class="w-4 h-4 mr-1.5" />
        Ekspor Laporan
      </Button>
      <Button variant="primary" size="sm">
        <Icon icon="lucide:refresh-cw" class="w-4 h-4 mr-1.5" />
        Segarkan Data
      </Button>
    </div>
  </div>

  {#if query.isLoading}
    <div class="flex items-center justify-center py-16">
      <Typography variant="body-sm" color="muted">Memuat data dasbor...</Typography>
    </div>
  {:else if query.data}
    <!-- Stat Cards Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <DashboardStatCard
        title="Total Karyawan"
        value={query.data.stats.totalEmployees}
        subtext={query.data.stats.employeeGrowth}
        icon="lucide:users"
        iconColor="text-brand-primary bg-brand-light"
        trendText="+12%"
        trendVariant="success"
      />
      <DashboardStatCard
        title="Kehadiran Hari Ini"
        value={`${query.data.stats.presentToday} (${query.data.stats.presentPercentage}%)`}
        subtext="Dari total 185 karyawan aktif"
        icon="lucide:check-square"
        iconColor="text-emerald-600 bg-emerald-50"
        trendText="+2.4%"
        trendVariant="success"
      />
      <DashboardStatCard
        title="Pengajuan Cuti"
        value={query.data.stats.pendingLeaves}
        subtext={`${query.data.stats.pendingLeaves} permohonan perlu ditinjau`}
        icon="lucide:plane"
        iconColor="text-amber-600 bg-amber-50"
        trendText="Pending"
        trendVariant="warning"
      />
      <DashboardStatCard
        title="Evaluasi Mendatang"
        value={query.data.stats.upcomingReviews}
        subtext="Penilaian kinerja akan datang"
        icon="lucide:star"
        iconColor="text-purple-600 bg-purple-50"
        trendText="Bulan Ini"
        trendVariant="primary"
      />
    </div>

    <!-- KPI & Attendance Trend Row -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div class="lg:col-span-5">
        <EmployeeKpiCard kpis={query.data.kpiStats} />
      </div>
      <div class="lg:col-span-7">
        <AttendanceTrendChart data={query.data.attendanceTrend} />
      </div>
    </div>

    <!-- Department Distribution & Pending Leave Row -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div class="lg:col-span-5">
        <DepartmentDistributionChart departments={query.data.departmentDistribution} />
      </div>
      <div class="lg:col-span-7">
        <PendingLeaveTable requests={query.data.pendingLeaveRequests} />
      </div>
    </div>

    <!-- Recent Activity & Upcoming Events Row -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div class="lg:col-span-5">
        <Card variant="default" padding="md" class="flex flex-col gap-3 h-full">
          <div class="flex items-center justify-between border-b border-neutral-border pb-3">
            <Typography variant="h6" weight="bold">Aktivitas Terkini</Typography>
            <button class="cursor-pointer hover:text-brand-primary transition-colors">
              <Icon icon="lucide:bell" class="w-4 h-4 text-slate-400 hover:text-brand-primary" />
            </button>
          </div>
          <div class="flex flex-col gap-1.5 flex-1">
            {#each query.data.recentActivities as activity (activity.id)}
              <div class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-bg/60 transition-colors">
                <div class="w-9 h-9 rounded-xl bg-neutral-bg flex items-center justify-center shrink-0 text-brand-primary">
                  <Icon icon={activity.icon} class="w-4.5 h-4.5" />
                </div>
                <div class="flex-1 min-w-0">
                  <Typography variant="body-sm" weight="bold" class="text-slate-800 dark:text-slate-200">
                    {activity.user}
                  </Typography>
                  <Typography variant="caption" color="muted" class="text-[11px]">
                    {activity.action}
                  </Typography>
                  <Typography variant="caption" color="secondary" class="text-[10px] block mt-0.5">
                    {activity.time}
                  </Typography>
                </div>
              </div>
            {/each}
          </div>
          <button class="w-full text-center p-2 rounded-xl border border-dashed border-neutral-border hover:border-brand-border hover:bg-brand-light/10 transition-colors cursor-pointer mt-1">
            <Typography variant="caption" weight="medium" class="text-brand-primary">
              Lihat Semua Aktivitas
            </Typography>
          </button>
        </Card>
      </div>

      <div class="lg:col-span-7">
        <Card variant="default" padding="md" class="flex flex-col gap-3 h-full">
          <div class="flex items-center justify-between border-b border-neutral-border pb-3">
            <Typography variant="h6" weight="bold">Acara Mendatang</Typography>
            <Badge variant="primary" size="sm">{query.data.upcomingEvents.length}</Badge>
          </div>
          <div class="flex flex-col gap-2 flex-1">
            {#each query.data.upcomingEvents as event (event.id)}
              <div class="flex items-center justify-between p-3 rounded-xl bg-neutral-bg border border-neutral-border hover:border-brand-border transition-colors">
                <div class="flex flex-col">
                  <Typography variant="body-sm" weight="medium" class="text-slate-800 dark:text-slate-200">
                    {event.title}
                  </Typography>
                  <Typography variant="caption" color="muted" class="text-[11px]">
                    {event.date}
                  </Typography>
                </div>
                <Badge variant={event.badgeVariant} size="sm">
                  {event.category}
                </Badge>
              </div>
            {/each}
          </div>
          <button class="w-full text-center p-2 rounded-xl border border-dashed border-neutral-border hover:border-brand-border hover:bg-brand-light/10 transition-colors cursor-pointer">
            <Typography variant="caption" weight="medium" class="text-brand-primary">
              Lihat Semua Acara
            </Typography>
          </button>
        </Card>
      </div>
    </div>
  {/if}
</div>
