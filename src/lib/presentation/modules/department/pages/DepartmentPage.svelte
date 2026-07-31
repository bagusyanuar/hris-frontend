<script lang="ts">
  import Icon from '@iconify/svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import { AlertDialog } from '$lib/presentation/shared/components/dialog';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import { Avatar } from '$lib/presentation/shared/components/avatar';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import DepartmentFormDialog from '../components/DepartmentFormDialog.svelte';
  import DepartmentDetailDrawer from '../components/DepartmentDetailDrawer.svelte';
  import { useDepartmentDirectory } from '../runes/department-directory.svelte';

  const dir = useDepartmentDirectory();
  let selectedDeptId = $state<string | null>(null);
  let selectedDept = $derived(
    dir.table.getRowModel().rows.find((row) => row.original.id === selectedDeptId)?.original
  );

  function getDeptIcon(name: string) {
    const lower = name.toLowerCase();
    if (
      lower.includes('engineering') ||
      lower.includes('development') ||
      lower.includes('system') ||
      lower.includes('qa')
    )
      return 'lucide:laptop';
    if (lower.includes('finance') || lower.includes('accounting') || lower.includes('legal'))
      return 'lucide:pie-chart';
    if (lower.includes('marketing') || lower.includes('creative')) return 'lucide:palette';
    if (lower.includes('sales') || lower.includes('expansion')) return 'lucide:trending-up';
    if (lower.includes('human') || lower.includes('hr')) return 'lucide:users';
    return 'lucide:building-2';
  }

  type BadgeVariant = 'primary' | 'success' | 'warning' | 'default' | 'danger';
  type StatusConfig = { variant: BadgeVariant; icon: string; label: string };

  function getStatusConfig(status: string): StatusConfig {
    switch (status) {
      case 'active':
        return { variant: 'success', icon: 'lucide:check-circle-2', label: 'Aktif' };
      case 'inactive':
        return { variant: 'default', icon: 'lucide:minus-circle', label: 'Nonaktif' };
      case 'restructuring':
        return { variant: 'warning', icon: 'lucide:refresh-cw', label: 'Restructuring' };
      case 'hiring':
        return { variant: 'primary', icon: 'lucide:user-plus', label: 'Hiring' };
      case 'planning':
        return { variant: 'default', icon: 'lucide:clipboard-list', label: 'Planning' };
      case 'growing':
        return { variant: 'success', icon: 'lucide:trending-up', label: 'Growing' };
      default:
        return { variant: 'default', icon: 'lucide:circle', label: status };
    }
  }
</script>

{#snippet statusBadge(status: string)}
  {@const config = getStatusConfig(status)}
  <Badge variant={config.variant}>
    <Icon icon={config.icon} class="w-3.5 h-3.5" />
    {config.label}
  </Badge>
{/snippet}

<div class="flex flex-col gap-3">
  <!-- Page Header -->
  <section
    id="page-header"
    data-testid="page-header"
    class="relative w-full rounded-xl bg-neutral-card border border-neutral-border overflow-hidden"
  >
    <!-- Decorative background elements -->
    <div
      class="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-brand-primary/10 dark:bg-brand-primary/20 blur-[50px] rounded-full pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 right-1/3 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 blur-2xl rounded-full pointer-events-none"
    ></div>

    <div
      class="relative p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
    >
      <div class="flex items-center gap-5">
        <div
          class="w-14 h-14 rounded-xl bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/10 flex items-center justify-center backdrop-blur-md shrink-0"
        >
          <Icon icon="lucide:network" class="w-7 h-7 text-brand-primary drop-shadow-sm" />
        </div>
        <div class="flex flex-col gap-1.5 text-slate-900 dark:text-slate-100">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
            Manajemen Departemen
          </h1>
          <p
            class="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed"
          >
            Kelola hierarki unit organisasi perusahaan.
          </p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto self-stretch lg:self-auto">
        <!-- Stat Item -->
        <div
          class="w-full sm:w-auto flex flex-col gap-1.5 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-5 py-3.5 min-w-32.5 backdrop-blur-sm"
        >
          <span
            class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
          >
            <Icon icon="lucide:layers" class="w-3.5 h-3.5" /> Total Departemen
          </span>
          <span class="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none"
            >{dir.stats.total}</span
          >
        </div>
      </div>
    </div>
  </section>

  <!-- Master-Detail Split Pane (Bento Grid) -->
    <div class="flex flex-col md:flex-row gap-4 flex-1 h-150">
      <!-- Master List Card -->
      <Card class="w-full md:w-70 flex flex-col shrink-0 overflow-hidden self-start max-h-full">
        <div
          class="pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center px-2"
        >
          <Typography variant="h6" weight="semibold">Direktori Departemen</Typography>
        </div>

        <div class="px-2 mb-1 flex items-center gap-2 shrink-0">
          <TextField
            placeholder="Cari departemen..."
            size="sm"
            class="flex-1"
            bind:value={() => dir.searchQuery, (v) => (dir.searchQuery = v)}
          >
            {#snippet prefix()}
              <Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
            {/snippet}
          </TextField>
          <Dropdown align="right">
            {#snippet trigger(toggle)}
              <Button
                variant="outline"
                size="sm"
                class="px-2.5 h-8 shrink-0 relative"
                onclick={toggle}
                title="Filter Status"
              >
                <Icon icon="lucide:filter" class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                {#if dir.statusFilter !== 'all'}
                  <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-primary rounded-full"
                  ></span>
                {/if}
              </Button>
            {/snippet}
            {#snippet content()}
              <DropdownItem
                class="text-xs font-normal gap-2"
                onclick={() => (dir.statusFilter = 'all')}
              >
                <Icon icon="lucide:layers" class="w-4 h-4" />
                Semua Status
              </DropdownItem>
              <DropdownItem
                class="text-xs font-normal gap-2"
                onclick={() => (dir.statusFilter = 'active')}
              >
                <Icon
                  icon="lucide:check-circle-2"
                  class="w-4 h-4 text-emerald-600 dark:text-emerald-500"
                />
                <span class="text-emerald-600 dark:text-emerald-500">Aktif</span>
              </DropdownItem>
              <DropdownItem
                class="text-xs font-normal gap-2"
                onclick={() => (dir.statusFilter = 'inactive')}
              >
                <Icon
                  icon="lucide:minus-circle"
                  class="w-4 h-4 text-slate-500 dark:text-slate-400"
                />
                <span class="text-slate-500 dark:text-slate-400">Nonaktif</span>
              </DropdownItem>
            {/snippet}
          </Dropdown>
        </div>
        <div class="flex flex-col gap-1 p-2 overflow-y-auto flex-1">
          <button
            class="group w-full flex items-center gap-3 py-2.5 px-2.5 mb-2 rounded-xl text-left transition-all border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-primary hover:bg-brand-light/30 dark:hover:bg-brand-primary/5 cursor-pointer"
            onclick={dir.openCreate}
          >
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand-light dark:group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-colors"
            >
              <Icon icon="lucide:plus" class="w-5 h-5" />
            </div>
            <div class="flex-1 overflow-hidden">
              <span
                class="text-xs font-medium text-slate-600 dark:text-slate-400 group-hover:text-brand-primary transition-colors"
              >
                Tambah Departemen
              </span>
            </div>
          </button>

          {#each dir.table.getRowModel().rows as row (row.id)}
            {@const dept = row.original}
            <button
              class={cn(
                'w-full relative flex items-start gap-2.5 py-2.5 px-2.5 rounded-lg text-left transition-all overflow-hidden',
                selectedDeptId === dept.id
                  ? 'bg-brand-light/80 dark:bg-brand-primary/10'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              )}
              onclick={() => (selectedDeptId = dept.id)}
            >
              {#if selectedDeptId === dept.id}
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-r-sm"></div>
              {/if}
              <div
                class={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                  selectedDeptId === dept.id
                    ? 'bg-brand-light dark:bg-brand-primary/20 text-brand-primary'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                )}
              >
                <Icon icon={getDeptIcon(dept.name)} class="w-5 h-5" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p
                  class={cn(
                    'text-sm font-semibold truncate transition-colors',
                    selectedDeptId === dept.id
                      ? 'text-brand-primary'
                      : 'text-slate-900 dark:text-slate-100'
                  )}
                >
                  {dept.name}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-slate-500 font-mono">{dept.code}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span
                    class={cn(
                      'text-[10px] font-medium uppercase tracking-wider',
                      getStatusConfig(dept.status).variant === 'success'
                        ? 'text-emerald-600'
                        : getStatusConfig(dept.status).variant === 'warning'
                          ? 'text-amber-600'
                          : 'text-brand-600'
                    )}>{getStatusConfig(dept.status).label}</span
                  >
                </div>
              </div>
            </button>
          {/each}

          {#if dir.table.getRowModel().rows.length === 0}
            <div class="py-10 text-center text-sm text-slate-500">
              Tidak ada departemen yang cocok dengan pencarian.
            </div>
          {/if}
        </div>
      </Card>

      <!-- Detail Pane Card -->
      <Card class="flex-1 overflow-y-auto p-5">
        {#if !selectedDept}
          <div class="h-full flex flex-col items-center justify-center text-center p-6">
            <div
              class="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-4"
            >
              <Icon icon="lucide:layout-panel-left" class="w-8 h-8 text-slate-300" />
            </div>
            <Typography variant="h5" weight="semibold">Pilih Departemen</Typography>
            <Typography variant="body-sm" color="secondary" class="mt-2 max-w-sm">
              Pilih salah satu departemen di panel kiri untuk melihat detail metrik, anggota tim,
              dan pengaturan.
            </Typography>
          </div>
        {:else}
          <div class="flex flex-col gap-5 pr-2">
            <!-- Detail Header -->
            <div
              class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 rounded-2xl bg-brand-light dark:bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0"
                >
                  <Icon icon={getDeptIcon(selectedDept.name)} class="w-8 h-8" />
                </div>
                <div>
                  <Typography variant="h3" weight="bold">{selectedDept.name}</Typography>
                  <div class="flex items-center gap-2 mt-2">
                    <span
                      class="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 font-mono border border-slate-200 dark:border-slate-700"
                    >
                      {selectedDept.code}
                    </span>
                    {@render statusBadge(selectedDept.status)}
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <Button variant="outline" size="sm" onclick={() => dir.openEdit(selectedDept!)}>
                  <Icon icon="lucide:pencil" class="w-4 h-4 shrink-0" />
                  Edit
                </Button>
                <Button variant="primary" size="sm" onclick={() => dir.openDetail(selectedDept!)}>
                  Lihat Lengkap
                </Button>
              </div>
            </div>

            <!-- Head of Department Profile -->
            <Card
              class="p-5 border border-slate-100 dark:border-slate-800 shadow-none relative overflow-hidden group"
            >
              <!-- Decorative background -->
              <div
                class="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-bl-[100px] z-0 transition-transform duration-500 group-hover:scale-110"
              ></div>

              <div
                class="flex flex-col sm:flex-row gap-5 items-start sm:items-center relative z-10"
              >
                <Avatar
                  name={selectedDept.managerName || 'Belum Ditentukan'}
                  size="xl"
                  variant="primary"
                  class="ring-4 ring-brand-primary/10 w-20 h-20 text-xl shrink-0"
                />

                <div class="flex-1 w-full">
                  <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Typography variant="h5" weight="bold"
                      >{selectedDept.managerName || 'Belum Ditentukan'}</Typography
                    >
                    <Badge variant="primary" class="h-5 text-[10px] px-1.5 uppercase tracking-wider"
                      >Kepala Departemen</Badge
                    >
                  </div>

                  <Typography variant="body-sm" color="secondary" class="mb-4">
                    Memimpin {selectedDept.name} dan bertanggung jawab atas operasional serta pencapaian
                    target tim.
                  </Typography>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4">
                    <div class="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                      <div
                        class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                      >
                        <Icon icon="lucide:mail" class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs font-medium truncate"
                        >{selectedDept.managerName
                          ? selectedDept.managerName.toLowerCase().replace(/\s+/g, '.') +
                            '@perusahaan.com'
                          : '-'}</span
                      >
                    </div>
                    <div class="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                      <div
                        class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                      >
                        <Icon icon="lucide:phone" class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs font-medium">+62 812-3456-7890</span>
                    </div>
                    <div class="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                      <div
                        class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                      >
                        <Icon icon="lucide:briefcase" class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs font-medium truncate">VP of {selectedDept.name}</span>
                    </div>
                    <div class="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                      <div
                        class="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"
                      >
                        <Icon icon="lucide:map-pin" class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-xs font-medium truncate">Kantor Pusat (Lantai 3)</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <!-- Metrics -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card
                class="p-4 border border-slate-100 dark:border-slate-800 shadow-none flex flex-col gap-3 group hover:border-brand-primary/30 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  >
                    <Icon icon="lucide:users" class="w-5 h-5" />
                  </div>
                  <div>
                    <Typography
                      variant="body-xs"
                      color="secondary"
                      weight="medium"
                      class="uppercase tracking-wider">Total Karyawan</Typography
                    >
                    <Typography variant="body-sm" weight="semibold" class="mt-0.5"
                      >24 Orang</Typography
                    >
                  </div>
                </div>
                <div
                  class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4"
                >
                  <span>15 Tetap, 9 Kontrak</span>
                  <span class="text-brand-primary font-medium group-hover:underline"
                    >Lihat Detail</span
                  >
                </div>
              </Card>

              <Card
                class="p-4 border border-slate-100 dark:border-slate-800 shadow-none flex flex-col gap-3 group hover:border-brand-primary/30 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  >
                    <Icon icon="lucide:line-chart" class="w-5 h-5" />
                  </div>
                  <div>
                    <Typography
                      variant="body-xs"
                      color="secondary"
                      weight="medium"
                      class="uppercase tracking-wider">Performa Rata-rata</Typography
                    >
                    <div class="flex items-center gap-2 mt-0.5">
                      <Typography variant="body-sm" weight="semibold">4.5</Typography>
                      <span class="text-xs text-slate-500">/ 5.0</span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-col gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4"
                >
                  <div class="flex justify-between text-xs text-slate-500">
                    <span>Target: 4.0</span>
                    <span class="font-medium text-emerald-600 dark:text-emerald-500">Exceeds</span>
                  </div>
                  <div
                    class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden"
                  >
                    <div
                      class="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                      style="width: 90%"
                    ></div>
                  </div>
                </div>
              </Card>

              <Card
                class="p-4 border border-slate-100 dark:border-slate-800 shadow-none flex flex-col gap-3 group hover:border-brand-primary/30 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  >
                    <Icon icon="lucide:user-check" class="w-5 h-5" />
                  </div>
                  <div>
                    <Typography
                      variant="body-xs"
                      color="secondary"
                      weight="medium"
                      class="uppercase tracking-wider">Tingkat Kehadiran</Typography
                    >
                    <div class="flex items-center gap-2 mt-0.5">
                      <Typography variant="body-sm" weight="semibold">98.5%</Typography>
                      <span
                        class="flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-sm"
                      >
                        <Icon icon="lucide:trending-up" class="w-3 h-3 mr-0.5" />
                        +2%
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4"
                >
                  <span>Rata-rata bulan ini</span>
                  <span class="text-amber-600 dark:text-amber-500 font-medium">1 Sakit, 2 Cuti</span
                  >
                </div>
              </Card>

              <Card
                class="p-4 border border-slate-100 dark:border-slate-800 shadow-none flex flex-col gap-3 group hover:border-brand-primary/30 transition-colors cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  >
                    <Icon icon="lucide:briefcase" class="w-5 h-5" />
                  </div>
                  <div>
                    <Typography
                      variant="body-xs"
                      color="secondary"
                      weight="medium"
                      class="uppercase tracking-wider">Posisi Terbuka</Typography
                    >
                    <div class="flex items-center gap-2 mt-0.5">
                      <Typography variant="body-sm" weight="semibold">3 Posisi</Typography>
                      <span
                        class="flex items-center text-[10px] font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-1.5 py-0.5 rounded-sm"
                      >
                        Hiring
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  class="flex flex-wrap gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4"
                >
                  <Badge
                    variant="default"
                    class="text-[10px] h-5 py-0 px-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >Frontend</Badge
                  >
                  <Badge
                    variant="default"
                    class="text-[10px] h-5 py-0 px-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >Backend</Badge
                  >
                  <Badge
                    variant="default"
                    class="text-[10px] h-5 py-0 px-1.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >QA</Badge
                  >
                </div>
              </Card>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <Typography variant="body-sm" weight="semibold" class="mb-2">Deskripsi</Typography>
              <Typography variant="body-sm" color="secondary" class="leading-relaxed">
                {selectedDept.description ||
                  'Tidak ada deskripsi yang ditambahkan untuk departemen ini.'}
              </Typography>
            </div>

            <!-- Employee List Datatable -->
            <div class="mb-4">
              <div class="mb-3">
                <Typography variant="body-sm" weight="semibold">Daftar Karyawan</Typography>
              </div>

              <div class="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
                <div class="relative w-full overflow-x-auto bg-neutral-card">
                  <table class="w-full caption-bottom text-sm border-collapse">
                    <thead
                      class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      <tr class="hover:bg-transparent">
                        <th
                          class="px-4 text-left align-middle font-semibold text-slate-500 text-xs py-2.5 w-5/12"
                          >Nama Karyawan</th
                        >
                        <th
                          class="px-4 text-left align-middle font-semibold text-slate-500 text-xs py-2.5"
                          >Posisi</th
                        >
                        <th
                          class="px-4 text-left align-middle font-semibold text-slate-500 text-xs py-2.5"
                          >Performa</th
                        >
                        <th
                          class="px-4 text-left align-middle font-semibold text-slate-500 text-xs py-2.5"
                          >Status</th
                        >
                      </tr>
                    </thead>
                    <tbody class="[&_tr:last-child]:border-0">
                      <!-- Mock Data -->
                      <tr
                        class="border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-3">
                            <Avatar name="Sarah Jeni" size="sm" variant="primary" />
                            <div class="flex flex-col">
                              <span class="text-sm font-medium text-slate-900 dark:text-slate-100"
                                >Sarah Jeni</span
                              >
                              <span class="text-xs text-slate-500">sarah@perusahaan.com</span>
                            </div>
                          </div>
                        </td>
                        <td
                          class="px-4 align-middle py-2.5 text-sm text-slate-600 dark:text-slate-400"
                          >Senior Designer</td
                        >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-1.5">
                            <Icon
                              icon="lucide:star"
                              class="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                            />
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300"
                              >5.0</span
                            >
                          </div>
                        </td>
                        <td class="px-4 align-middle py-2.5">
                          <Badge variant="success">Tetap</Badge>
                        </td>
                      </tr>
                      <tr
                        class="border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-3">
                            <Avatar name="Budi Santoso" size="sm" variant="default" />
                            <div class="flex flex-col">
                              <span class="text-sm font-medium text-slate-900 dark:text-slate-100"
                                >Budi Santoso</span
                              >
                              <span class="text-xs text-slate-500">budi@perusahaan.com</span>
                            </div>
                          </div>
                        </td>
                        <td
                          class="px-4 align-middle py-2.5 text-sm text-slate-600 dark:text-slate-400"
                          >Frontend Developer</td
                        >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-1.5">
                            <Icon
                              icon="lucide:star"
                              class="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                            />
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300"
                              >4.2</span
                            >
                          </div>
                        </td>
                        <td class="px-4 align-middle py-2.5">
                          <Badge variant="primary">Kontrak</Badge>
                        </td>
                      </tr>
                      <tr
                        class="border-b border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-3">
                            <Avatar name="Andi Setiawan" size="sm" variant="default" />
                            <div class="flex flex-col">
                              <span class="text-sm font-medium text-slate-900 dark:text-slate-100"
                                >Andi Setiawan</span
                              >
                              <span class="text-xs text-slate-500">andi@perusahaan.com</span>
                            </div>
                          </div>
                        </td>
                        <td
                          class="px-4 align-middle py-2.5 text-sm text-slate-600 dark:text-slate-400"
                          >QA Tester</td
                        >
                        <td class="px-4 align-middle py-2.5">
                          <div class="flex items-center gap-1.5">
                            <Icon
                              icon="lucide:star"
                              class="w-3.5 h-3.5 text-amber-500 fill-amber-500"
                            />
                            <span class="text-sm font-medium text-slate-700 dark:text-slate-300"
                              >3.8</span
                            >
                          </div>
                        </td>
                        <td class="px-4 align-middle py-2.5">
                          <Badge variant="warning">Probation</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        {/if}
      </Card>
    </div>
</div>

<DepartmentFormDialog
  bind:open={() => dir.isFormOpen, (v) => (dir.isFormOpen = v)}
  department={dir.editingDepartment}
  parentOptions={dir.parentOptions}
  isSubmitting={dir.isSubmitting}
  onsubmit={dir.submit}
  onclose={dir.closeForm}
/>

<AlertDialog
  bind:open={() => dir.isDeleteOpen, (v) => (dir.isDeleteOpen = v)}
  title="Hapus Departemen?"
  description={`Ini akan menghapus "${dir.deleteTarget?.name}" secara permanen dari struktur organisasi.`}
  variant="danger"
  confirmText="Hapus"
  isLoading={dir.isDeleting}
  onconfirm={dir.confirmDelete}
  oncancel={() => (dir.isDeleteOpen = false)}
/>

<DepartmentDetailDrawer
  isOpen={dir.isDrawerOpen}
  onClose={() => (dir.isDrawerOpen = false)}
  department={dir.selectedDepartment}
/>
