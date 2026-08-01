<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';

  interface PayrollLine {
    label: string;
    amount: string;
    deduction: boolean;
  }

  const lines: PayrollLine[] = [
    { label: 'Gaji Pokok', amount: '8.500.000', deduction: false },
    { label: 'Tunjangan', amount: '1.250.000', deduction: false },
    { label: 'BPJS', amount: '−212.500', deduction: true },
    { label: 'PPh 21', amount: '−430.000', deduction: true }
  ];
</script>

<header class="flex items-center gap-1.5 px-1 pb-2">
  <span class="text-brand-primary">
    <Icon icon="lucide:receipt-text" class="h-3.5 w-3.5" />
  </span>
  <span class="flex-1 text-slate-800">
    <Typography variant="body-xs" weight="bold" color="inherit">Slip Gaji</Typography>
  </span>
  <span class="rounded-full bg-slate-100 px-1.5 text-slate-500">
    <Typography variant="body-xs" weight="medium" color="inherit">Juli</Typography>
  </span>
</header>

<dl class="flex flex-col gap-1 rounded-xl bg-white p-2">
  {#each lines as line (line.label)}
    <div class="flex items-center justify-between gap-1.5">
      <dt class="min-w-0 text-slate-500">
        <Typography variant="body-xs" color="inherit" class="block truncate"
          >{line.label}</Typography
        >
      </dt>
      <dd class="shrink-0 font-mono {line.deduction ? 'text-rose-600' : 'text-slate-700'}">
        <Typography variant="body-xs" weight="medium" color="inherit">{line.amount}</Typography>
      </dd>
    </div>
  {/each}
</dl>

<div class="border-brand-border bg-brand-light mt-2 rounded-xl border p-2">
  <span class="block text-slate-500 uppercase">
    <Typography variant="body-xs" weight="medium" color="inherit" class="tracking-wider">
      Diterima
    </Typography>
  </span>
  <span class="text-brand-text block">
    <Typography variant="body-xs" weight="bold" color="inherit" class="font-mono">
      Rp 9.107.500
    </Typography>
  </span>
</div>

<div class="mt-2 flex items-center gap-1 px-1 text-slate-400">
  <Icon icon="lucide:send" class="h-2.5 w-2.5 shrink-0" />
  <Typography variant="body-xs" color="inherit" class="truncate">Terkirim ke 260</Typography>
</div>
