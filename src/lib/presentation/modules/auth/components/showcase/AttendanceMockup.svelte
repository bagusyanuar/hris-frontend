<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';

  type ShiftTone = 'present' | 'leave' | 'late';

  interface ShiftRow {
    day: string;
    label: string;
    detail: string;
    tone: ShiftTone;
  }

  interface WeekDay {
    letter: string;
    date: string;
    today: boolean;
  }

  // Fixed light-surface styling: the phone screen never follows the app's dark mode.
  const toneStyles: Record<ShiftTone, string> = {
    present: 'border-l-emerald-500 bg-emerald-50 text-emerald-800',
    leave: 'border-l-amber-500 bg-amber-50 text-amber-800',
    late: 'border-l-rose-500 bg-rose-50 text-rose-800'
  };

  const week: WeekDay[] = [
    { letter: 'S', date: '28', today: false },
    { letter: 'S', date: '29', today: false },
    { letter: 'R', date: '30', today: false },
    { letter: 'K', date: '31', today: true },
    { letter: 'J', date: '01', today: false }
  ];

  const shifts: ShiftRow[] = [
    { day: 'Sen', label: 'Hadir', detail: '07.52 – 17.04', tone: 'present' },
    { day: 'Sel', label: 'Cuti', detail: 'Tahunan', tone: 'leave' },
    { day: 'Rab', label: 'Telat', detail: '08.47', tone: 'late' },
    { day: 'Kam', label: 'Hadir', detail: '07.58', tone: 'present' }
  ];
</script>

<header class="flex items-center gap-1.5 px-1 pb-2">
  <span class="text-brand-primary">
    <Icon icon="lucide:layers" class="h-3.5 w-3.5" />
  </span>
  <span class="flex-1 text-slate-800">
    <Typography variant="body-xs" weight="bold" color="inherit">Absensi</Typography>
  </span>
  <span class="text-slate-300">
    <Icon icon="lucide:bell" class="h-3 w-3" />
  </span>
</header>

<!-- Week strip -->
<ul class="flex items-center justify-between gap-1 pb-2.5">
  {#each week as day (day.date)}
    <li
      class="flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1 {day.today
        ? 'bg-brand-primary text-white'
        : 'text-slate-400'}"
    >
      <Typography variant="body-xs" weight="medium" color="inherit">{day.letter}</Typography>
      <Typography variant="body-xs" weight="bold" color="inherit">{day.date}</Typography>
    </li>
  {/each}
</ul>

<ul class="flex flex-col gap-1.5">
  {#each shifts as shift (shift.day)}
    <li class="flex items-center gap-1.5">
      <span class="w-6 shrink-0 text-slate-400">
        <Typography variant="body-xs" color="inherit">{shift.day}</Typography>
      </span>
      <span
        class="flex min-w-0 flex-1 flex-col rounded-r-md border-l-2 px-1.5 py-1 {toneStyles[
          shift.tone
        ]}"
      >
        <Typography variant="body-xs" weight="semibold" color="inherit" class="block truncate">
          {shift.label}
        </Typography>
        <Typography variant="body-xs" color="inherit" class="block truncate opacity-70">
          {shift.detail}
        </Typography>
      </span>
    </li>
  {/each}
</ul>
