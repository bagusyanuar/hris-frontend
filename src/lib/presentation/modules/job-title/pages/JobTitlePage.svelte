<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Button } from '$lib/presentation/shared/components/button';
  import { AlertDialog } from '$lib/presentation/shared/components/dialog';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Avatar } from '$lib/presentation/shared/components/avatar';
  import JobTitleFormDialog from '../components/JobTitleFormDialog.svelte';
  import JobTitleDetailDrawer from '../components/JobTitleDetailDrawer.svelte';
  import { useJobTitleDirectory } from '../runes/job-title-directory.svelte';

  const dir = useJobTitleDirectory();
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
          <Icon icon="lucide:award" class="w-7 h-7 text-brand-primary drop-shadow-sm" />
        </div>
        <div class="flex flex-col gap-1.5 text-slate-900 dark:text-slate-100">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
            Manajemen Jabatan
          </h1>
          <p
            class="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg leading-relaxed"
          >
            Kelola master jabatan baku perusahaan untuk pemetaan peran, tanggung jawab, dan hierarki
            karyawan.
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
            <Icon icon="lucide:layers" class="w-3.5 h-3.5" /> Total Jabatan
          </span>
          <span class="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-none"
            >{dir.stats.total}</span
          >
        </div>
      </div>
    </div>
  </section>

  <section
    id="job-title-list"
    data-testid="job-title-list"
    class="bg-neutral-card border border-neutral-border rounded-2xl shadow-xs p-4 md:p-6 transition-all duration-300"
  >
    <div class="text-sm">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex flex-col">
          <Typography variant="h4" weight="semibold" class="leading-tight"
            >Daftar Jabatan</Typography
          >
          <span class="text-sm text-slate-500 font-medium">Manajemen Posisi Pekerjaan</span>
        </div>
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
          <TextField
            placeholder="Cari job title..."
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
          {#if dir.table.getRowModel().rows.length === 0}
            <div
              class="lg:col-span-2 md:col-span-1 flex flex-col items-center justify-center p-12 text-slate-500 gap-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl"
            >
              <Icon icon="lucide:inbox" class="w-10 h-10 opacity-20" />
              <span class="text-sm">Tidak ada data jabatan.</span>
            </div>
          {/if}
          {#each dir.table.getRowModel().rows as row (row.id)}
            {@const jobTitle = row.original}
            <div
              class="group flex flex-col p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-brand-primary/30 transition-all duration-300 gap-4"
            >
              <div class="flex items-start justify-between w-full">
                <!-- Avatar Initials & Title -->
                <div class="flex items-start gap-3 overflow-hidden">
                  <div
                    class="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-lg font-bold bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/20 dark:border-brand-primary/30 text-brand-primary backdrop-blur-sm"
                  >
                    {jobTitle.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-base font-bold text-slate-900 dark:text-slate-100 truncate"
                      >{jobTitle.name}</span
                    >
                    <Badge
                      variant="primary"
                      class="bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-2 py-0.5 text-[10px] rounded-md border-none w-fit mt-1"
                    >
                      {jobTitle.code}
                    </Badge>
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
                    <DropdownItem class="text-xs gap-2" onclick={() => dir.openDetail(jobTitle)}>
                      <Icon icon="lucide:eye" class="w-4 h-4 text-slate-400" />
                      Detail
                    </DropdownItem>
                    <DropdownItem class="text-xs gap-2" onclick={() => dir.openEdit(jobTitle)}>
                      <Icon icon="lucide:pencil" class="w-4 h-4 text-slate-400" />
                      Edit
                    </DropdownItem>
                    <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                    <DropdownItem
                      class="text-xs gap-2"
                      variant="danger"
                      onclick={() => dir.requestDelete(jobTitle)}
                    >
                      <Icon icon="lucide:trash-2" class="w-4 h-4" />
                      Hapus
                    </DropdownItem>
                  {/snippet}
                </Dropdown>
              </div>

              <p
                class="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-10"
                title={jobTitle.description}
              >
                {jobTitle.description || 'Bertanggung jawab atas operasional, merumuskan strategi, dan mengelola pencapaian target kerja untuk posisi ini dalam struktur organisasi perusahaan.'}
              </p>

              <div class="flex flex-col gap-3 mt-1">
                <!-- Avatars -->
                <div class="flex items-center gap-2.5">
                  <div class="flex -space-x-2">
                    <Avatar name="Sarah Jeni" size="sm" class="w-8 h-8 text-[11px] border-2 border-white dark:border-slate-900" />
                    <Avatar name="Budi Santoso" size="sm" class="w-8 h-8 text-[11px] border-2 border-white dark:border-slate-900" variant="default" />
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[11px] font-medium text-slate-500 shrink-0">
                      +4
                    </div>
                  </div>
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">6 Pegawai</span>
                </div>
              </div>

              <!-- Footer -->
              <div
                class="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between"
              >
                {@render statusBadge(jobTitle.status)}
                
                <!-- Last Updated -->
                <div class="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <Icon icon="lucide:clock" class="w-3.5 h-3.5" />
                  <span>Diperbarui 2 hari lalu</span>
                </div>
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
                >Tambah Jabatan</span
              >
              <span class="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                Buat posisi baru untuk pemetaan hierarki karyawan
              </span>
            </div>
          </button>
        {/if}
      </div>
    </div>
  </section>
</div>

<JobTitleFormDialog
  bind:open={() => dir.isFormOpen, (v) => (dir.isFormOpen = v)}
  jobTitle={dir.editingJobTitle}
  isSubmitting={dir.isSubmitting}
  onsubmit={dir.submit}
  onclose={dir.closeForm}
/>

<AlertDialog
  bind:open={() => dir.isDeleteOpen, (v) => (dir.isDeleteOpen = v)}
  title="Hapus Jabatan?"
  description={`Ini akan menghapus "${dir.deleteTarget?.name}" secara permanen. Lanjutkan?`}
  variant="danger"
  confirmText="Hapus"
  isLoading={dir.isDeleting}
  onconfirm={dir.confirmDelete}
  oncancel={() => (dir.isDeleteOpen = false)}
/>

<JobTitleDetailDrawer
  isOpen={dir.isDrawerOpen}
  onClose={() => (dir.isDrawerOpen = false)}
  jobTitle={dir.selectedJobTitle}
/>
