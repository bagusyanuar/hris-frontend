<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Button } from '$lib/presentation/shared/components/button';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Avatar } from '$lib/presentation/shared/components/avatar';
  import JobPositionFormDialog from '../components/JobPositionFormDialog.svelte';
  import JobPositionDetailDrawer from '../components/JobPositionDetailDrawer.svelte';
  import { useJobPositionDirectory } from '../runes/job-position-directory.svelte';

  const dir = useJobPositionDirectory();
</script>

{#snippet statusBadge(status: string)}
  <Badge variant={status === 'active' ? 'success' : 'default'}>
    <Icon
      icon={status === 'active' ? 'lucide:check-circle-2' : 'lucide:minus-circle'}
      class="w-3.5 h-3.5"
    />
    {status === 'active' ? 'Aktif' : 'Nonaktif'}
  </Badge>
{/snippet}

<div class="flex flex-col gap-3">
  <!-- Premium Page Header -->
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
          <Icon icon="lucide:briefcase" class="w-7 h-7 text-brand-primary drop-shadow-sm" />
        </div>
        <div class="flex flex-col gap-1.5 text-slate-900 dark:text-slate-100">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">Posisi</h1>
          <p
            class="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed"
          >
            Kelola data posisi jabatan dan struktur reporting line dalam organisasi perusahaan.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3 w-full lg:w-auto self-stretch lg:self-auto">
        <!-- Stat Item -->
        <div
          class="flex-1 lg:flex-none flex flex-col gap-1.5 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl px-5 py-3.5 min-w-32.5 backdrop-blur-sm"
        >
          <span
            class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5"
          >
            <Icon icon="lucide:layers" class="w-3.5 h-3.5" /> Total Posisi
          </span>
          <span class="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none"
            >{dir.stats.total}</span
          >
        </div>
      </div>
    </div>
  </section>

  <section
    id="job-position-list"
    data-testid="job-position-list"
    class="bg-neutral-card border border-neutral-border rounded-2xl shadow-xs p-4 md:p-6 transition-all duration-300"
  >
    <div class="text-sm">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex flex-col">
          <Typography variant="h4" class="text-slate-900 dark:text-slate-100 font-bold"
            >Direktori Posisi</Typography
          >
          <span class="text-sm text-slate-500 font-medium">Manajemen Struktur Posisi</span>
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          <TextField
            placeholder="Cari posisi..."
            size="sm"
            class="w-full sm:w-64"
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
                class="px-2.5 flex items-center justify-center shrink-0"
                onclick={toggle}
              >
                <Icon icon="lucide:filter" class="w-4 h-4" />
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
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {#if dir.isLoading}
          <div class="col-span-full flex items-center justify-center p-12 text-slate-400">
            <Icon icon="lucide:loader-2" class="w-6 h-6 animate-spin" />
          </div>
        {:else}
          {#if dir.items.length === 0}
            <div
              class="col-span-full flex flex-col items-center justify-center p-12 text-slate-500 gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl"
            >
              <Icon icon="lucide:inbox" class="w-10 h-10 opacity-20" />
              <span class="text-sm">Tidak ada data posisi.</span>
            </div>
          {/if}
          {#each dir.items as position (position.id)}
            {@const occupied = position.employeeCount ?? 0}
            {@const quota = position.headcountQuota || 0}
            {@const remaining = Math.max(0, quota - occupied)}
            <div
              class="group flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-primary/30 transition-all duration-300 gap-4"
            >
              <div class="flex items-start justify-between w-full">
                <!-- Avatar Initials & Title -->
                <div class="flex items-start gap-3 overflow-hidden">
                  <div
                    class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 dark:border-brand-primary/30 text-brand-primary backdrop-blur-sm"
                  >
                    {position.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-base font-bold text-slate-900 dark:text-slate-100 truncate"
                      >{position.name}</span
                    >
                    {#if position.departmentName || position.jobTitleName}
                      <div class="flex items-center gap-1.5 flex-wrap mt-1">
                        {#if position.departmentName}
                          <Badge
                            variant="default"
                            class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 px-2 py-0.5 text-[10px] rounded-md border-none w-fit"
                          >
                            <Icon icon="lucide:building-2" class="w-3 h-3 mr-1" />
                            {position.departmentName}
                          </Badge>
                        {/if}
                        {#if position.jobTitleName}
                          <Badge
                            variant="primary"
                            class="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-2 py-0.5 text-[10px] rounded-md border-none w-fit"
                          >
                            <Icon icon="lucide:award" class="w-3 h-3 mr-1" />
                            {position.jobTitleName}
                          </Badge>
                        {/if}
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Actions -->
                <Dropdown align="right">
                  {#snippet trigger(toggle)}
                    <button
                      onclick={toggle}
                      class="p-1.5 -mr-2 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Icon icon="lucide:more-vertical" class="w-4 h-4" />
                    </button>
                  {/snippet}
                  {#snippet content()}
                    <DropdownItem class="text-xs gap-2" onclick={() => dir.openDetail(position)}>
                      <Icon icon="lucide:eye" class="w-4 h-4 text-slate-400" />
                      Detail
                    </DropdownItem>
                    <DropdownItem class="text-xs gap-2" onclick={() => dir.openEdit(position)}>
                      <Icon icon="lucide:pencil" class="w-4 h-4 text-slate-400" />
                      Edit
                    </DropdownItem>
                    <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <DropdownItem
                      class="text-xs gap-2"
                      variant="danger"
                      onclick={() => dir.confirmDelete(position)}
                    >
                      <Icon icon="lucide:trash-2" class="w-4 h-4" />
                      Hapus
                    </DropdownItem>
                  {/snippet}
                </Dropdown>
              </div>

              <p
                class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-10"
                title={position.description}
              >
                {position.description ||
                  'Posisi dalam struktur organisasi dengan tanggung jawab dan wewenang tertentu.'}
              </p>

              <div
                class="flex flex-col gap-2 mt-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-slate-700 dark:text-slate-300">
                    Terisi: <span class="text-slate-900 dark:text-slate-100">{occupied}</span> org
                  </span>
                  <span class="font-medium text-slate-500 dark:text-slate-400">
                    Quota: {quota}
                  </span>
                </div>

                <div
                  class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all duration-500 {occupied >= quota &&
                    quota > 0
                      ? 'bg-emerald-500'
                      : 'bg-brand-primary'}"
                    style="width: {quota > 0 ? Math.min(100, (occupied / quota) * 100) : 0}%"
                  ></div>
                </div>

                <div
                  class="flex items-center gap-1.5 text-[11px] font-medium {remaining > 0
                    ? 'text-amber-600 dark:text-amber-500'
                    : 'text-emerald-600 dark:text-emerald-500'}"
                >
                  {#if remaining > 0}
                    <Icon icon="lucide:alert-circle" class="w-3.5 h-3.5" />
                    Dibutuhkan {remaining} karyawan lagi
                  {:else if quota === 0}
                    <Icon icon="lucide:minus-circle" class="w-3.5 h-3.5 text-slate-400" />
                    <span class="text-slate-500">Tidak ada quota</span>
                  {:else}
                    <Icon icon="lucide:check-circle-2" class="w-3.5 h-3.5" />
                    Quota sudah terpenuhi
                  {/if}
                </div>
              </div>

              <!-- Footer -->
              <div
                class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  {#if occupied > 0}
                    <div class="flex items-center gap-2.5">
                      <div class="flex -space-x-2.5 hover:space-x-0 transition-all duration-300">
                        <Avatar name="Sarah Jeni" size="sm" class="w-7 h-7 text-[10px] border-2 border-white dark:border-slate-800 shadow-sm transition-all duration-300" />
                        {#if occupied > 1}
                          <Avatar name="Budi Santoso" size="sm" class="w-7 h-7 text-[10px] border-2 border-white dark:border-slate-800 shadow-sm transition-all duration-300" variant="default" />
                        {/if}
                        {#if occupied > 2}
                          <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-medium text-slate-500 shadow-sm shrink-0 z-10 transition-all duration-300">
                            +{occupied - 2}
                          </div>
                        {/if}
                      </div>
                      <span class="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {#if occupied === 1}
                          Sarah Jeni
                        {:else if occupied === 2}
                          Sarah & Budi
                        {:else}
                          Sarah, Budi & {occupied - 2} lainnya
                        {/if}
                      </span>
                    </div>
                  {:else}
                    <span class="text-[11px] text-slate-400 font-medium">Belum ada karyawan</span>
                  {/if}
                </div>
                
                {@render statusBadge(position.status)}
              </div>
            </div>
          {/each}

          <button
            onclick={dir.openCreate}
            class="flex flex-col sm:flex-row items-center justify-center gap-5 p-6 bg-transparent border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-primary rounded-2xl hover:bg-brand-light/30 dark:hover:bg-brand-primary/5 transition-all duration-300 w-full cursor-pointer h-full min-h-45 group text-center sm:text-left"
          >
            <div
              class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand-light dark:group-hover:bg-brand-primary/20 group-hover:text-brand-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300"
            >
              <Icon icon="lucide:plus" class="w-6 h-6" />
            </div>
            <div class="flex flex-col gap-1 max-w-45">
              <span
                class="text-base font-bold text-slate-600 dark:text-slate-300 group-hover:text-brand-primary transition-colors duration-300"
                >Tambah Posisi</span
              >
              <span class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Buat posisi baru dalam struktur organisasi
              </span>
            </div>
          </button>
        {/if}
      </div>
    </div>
  </section>
</div>

<JobPositionFormDialog
  bind:isOpen={() => dir.isFormOpen, (v) => (dir.isFormOpen = v)}
  position={dir.editingPosition}
  parentOptions={dir.parentOptions}
  departmentOptions={dir.departmentOptions}
  jobTitleOptions={dir.jobTitleOptions}
  isSubmitting={dir.isSubmitting}
  onSubmit={dir.submit}
  onClose={dir.closeForm}
/>

<JobPositionDetailDrawer
  bind:isOpen={() => dir.isDrawerOpen, (v) => (dir.isDrawerOpen = v)}
  position={dir.selectedPosition}
  onClose={dir.closeDetail}
/>
