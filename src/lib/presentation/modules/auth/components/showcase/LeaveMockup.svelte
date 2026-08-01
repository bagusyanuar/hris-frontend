<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';

  type RequestStatus = 'approved' | 'pending' | 'rejected';

  interface LeaveRequest {
    initials: string;
    name: string;
    detail: string;
    status: RequestStatus;
  }

  // Fixed light-surface styling: the phone screen never follows the app's dark mode.
  const statusStyles: Record<RequestStatus, string> = {
    approved: 'bg-emerald-500',
    pending: 'bg-amber-500',
    rejected: 'bg-rose-500'
  };

  const requests: LeaveRequest[] = [
    { initials: 'DA', name: 'Dewi A.', detail: '3 hari · Tahunan', status: 'pending' },
    { initials: 'YP', name: 'Yoga P.', detail: '1 hari · Sakit', status: 'approved' },
    { initials: 'RK', name: 'Rani K.', detail: '5 hari · Tahunan', status: 'approved' }
  ];
</script>

<header class="flex items-center gap-1.5 px-1 pb-2">
  <span class="text-brand-primary">
    <Icon icon="lucide:calendar-check-2" class="h-3.5 w-3.5" />
  </span>
  <span class="flex-1 text-slate-800">
    <Typography variant="body-xs" weight="bold" color="inherit">Cuti</Typography>
  </span>
  <span class="rounded-full bg-amber-100 px-1.5 text-amber-700">
    <Typography variant="body-xs" weight="bold" color="inherit">1</Typography>
  </span>
</header>

<!-- Saldo cuti -->
<div class="border-brand-border bg-brand-light mb-2.5 rounded-xl border p-2">
  <div class="flex items-baseline justify-between pb-1.5">
    <span class="text-slate-600">
      <Typography variant="body-xs" color="inherit">Sisa kuota</Typography>
    </span>
    <span class="text-brand-text">
      <Typography variant="body-xs" weight="bold" color="inherit">9 / 12</Typography>
    </span>
  </div>
  <div class="h-1 w-full overflow-hidden rounded-full bg-white">
    <div class="bg-brand-primary h-full w-3/4 rounded-full"></div>
  </div>
</div>

<ul class="flex flex-col gap-1.5">
  {#each requests as request (request.initials)}
    <li class="flex items-center gap-1.5 rounded-lg bg-white p-1.5">
      <span
        class="border-brand-primary/20 bg-brand-primary/5 text-brand-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md border"
      >
        <Typography variant="body-xs" weight="bold" color="inherit">{request.initials}</Typography>
      </span>
      <span class="flex min-w-0 flex-1 flex-col">
        <span class="text-slate-800">
          <Typography variant="body-xs" weight="semibold" color="inherit" class="block truncate">
            {request.name}
          </Typography>
        </span>
        <span class="text-slate-400">
          <Typography variant="body-xs" color="inherit" class="block truncate">
            {request.detail}
          </Typography>
        </span>
      </span>
      <span
        class="h-1.5 w-1.5 shrink-0 rounded-full {statusStyles[request.status]}"
        aria-hidden="true"
      ></span>
    </li>
  {/each}
</ul>
