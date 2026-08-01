<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';

  interface ProfileFact {
    icon: string;
    label: string;
    value: string;
  }

  const facts: ProfileFact[] = [
    { icon: 'lucide:building-2', label: 'Departemen', value: 'Teknologi' },
    { icon: 'lucide:map-pin', label: 'Cabang', value: 'Surabaya' },
    { icon: 'lucide:file-badge', label: 'Kontrak', value: 'Tetap' }
  ];
</script>

<header class="flex items-center gap-1.5 px-1 pb-2">
  <span class="text-brand-primary">
    <Icon icon="lucide:users-round" class="h-3.5 w-3.5" />
  </span>
  <span class="flex-1 text-slate-800">
    <Typography variant="body-xs" weight="bold" color="inherit">Karyawan</Typography>
  </span>
  <span class="text-slate-300">
    <Icon icon="lucide:search" class="h-3 w-3" />
  </span>
</header>

<!-- Profil ringkas -->
<div class="mb-2 flex flex-col items-center gap-1.5 rounded-xl bg-white p-2.5">
  <span class="relative">
    <span
      class="from-brand-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br to-emerald-800 text-white"
    >
      <Typography variant="body-xs" weight="bold" color="inherit">AN</Typography>
    </span>
    <span
      class="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500"
    ></span>
  </span>
  <span class="flex w-full flex-col items-center">
    <span class="w-full text-center text-slate-800">
      <Typography variant="body-xs" weight="bold" color="inherit" class="block truncate">
        Arif Nugroho
      </Typography>
    </span>
    <span class="w-full text-center text-slate-400">
      <Typography variant="body-xs" color="inherit" class="block truncate">
        Backend Engineer
      </Typography>
    </span>
  </span>
</div>

<dl class="flex flex-col gap-1.5">
  {#each facts as fact (fact.label)}
    <div class="flex items-center gap-1.5 rounded-lg bg-white p-1.5">
      <span
        class="text-brand-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100"
      >
        <Icon icon={fact.icon} class="h-3 w-3" />
      </span>
      <dt class="min-w-0 flex-1 text-slate-400">
        <Typography variant="body-xs" color="inherit" class="block truncate"
          >{fact.label}</Typography
        >
      </dt>
      <dd class="shrink-0 text-slate-700">
        <Typography variant="body-xs" weight="semibold" color="inherit">{fact.value}</Typography>
      </dd>
    </div>
  {/each}
</dl>
