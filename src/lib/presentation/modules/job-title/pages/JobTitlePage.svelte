<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import { AlertDialog } from '$lib/presentation/shared/components/dialog';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import * as TableUI from '$lib/presentation/shared/components/table';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import { Badge } from '$lib/presentation/shared/components/badge';
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
  <!-- Header Panel with Quick Insights -->
  <Card>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div class="flex items-center gap-4">
        <div
          class="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand-primary shrink-0"
        >
          <Icon icon="lucide:award" class="w-6 h-6" />
        </div>
        <div class="flex flex-col gap-1">
          <Typography variant="h4" weight="bold">Jabatan</Typography>
          <Typography variant="body-sm" color="secondary">
            Kelola data master jabatan baku perusahaan.
          </Typography>
        </div>
      </div>
      <div
        class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800 self-stretch sm:self-auto"
      >
        <div class="flex items-center gap-2 px-3">
          <Icon icon="lucide:award" class="w-4 h-4 text-slate-400" />
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dir.stats.total} <span class="text-slate-500 font-normal">Jabatan</span>
          </span>
        </div>
        <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
        <div class="flex items-center gap-2 px-3">
          <Icon icon="lucide:activity" class="w-4 h-4 text-emerald-500" />
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dir.stats.activePercentage}% <span class="text-slate-500 font-normal">Aktif</span>
          </span>
        </div>
      </div>
    </div>
  </Card>

  <Card>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <Typography variant="h5" weight="semibold">Daftar Jabatan</Typography>
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
              class="whitespace-nowrap text-xs font-normal"
              onclick={toggle}
            >
              <Icon icon="lucide:filter" class="w-4 h-4" />
              {dir.statusFilter === 'all'
                ? 'Semua Status'
                : dir.statusFilter === 'active'
                  ? 'Aktif'
                  : 'Nonaktif'}
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
              <Icon icon="lucide:minus-circle" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span class="text-slate-500 dark:text-slate-400">Nonaktif</span>
            </DropdownItem>
          {/snippet}
        </Dropdown>
        <Button variant="primary" size="sm" onclick={dir.openCreate} class="whitespace-nowrap">
          <Icon icon="lucide:plus" class="w-4 h-4 shrink-0" />
          Tambah Jabatan
        </Button>
      </div>
    </div>

    <TableUI.Root table={dir.table} isLoading={dir.isLoading}>
      <TableUI.Header>
        {#each dir.table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <TableUI.Row>
            {#each headerGroup.headers as header (header.id)}
              <TableUI.Head {header} />
            {/each}
          </TableUI.Row>
        {/each}
      </TableUI.Header>
      <TableUI.Body>
        {#each dir.table.getRowModel().rows as row (row.id)}
          <TableUI.Row
            hoverable={true}
            onclick={() => dir.openDetail(row.original)}
            class="cursor-pointer"
          >
            {#each row.getVisibleCells() as cell (cell.id)}
              <TableUI.Cell {cell}>
                {#if cell.column.id === 'name'}
                  <div class="flex items-center gap-2">
                    <Icon icon="lucide:award" class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="font-medium text-slate-900 dark:text-slate-100"
                      >{cell.getValue()}</span
                    >
                  </div>
                {:else if cell.column.id === 'code'}
                  <span
                    class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 font-mono dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    {cell.getValue()}
                  </span>
                {:else if cell.column.id === 'description'}
                  <span
                    class="text-slate-500 dark:text-slate-400 text-sm truncate max-w-[300px] block"
                    title={cell.getValue() as string}
                  >
                    {cell.getValue() ?? '-'}
                  </span>
                {:else if cell.column.id === 'status'}
                  {@render statusBadge(cell.getValue() as string)}
                {:else if cell.column.id === 'actions'}
                  <Dropdown align="right">
                    {#snippet trigger(toggle)}
                      <button
                        onclick={(e) => {
                          e.stopPropagation();
                          toggle();
                        }}
                        class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                      >
                        <Icon icon="lucide:more-horizontal" class="w-4 h-4" />
                      </button>
                    {/snippet}
                    {#snippet content()}
                      <div
                        class="px-2.5 py-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                      >
                        Aksi
                      </div>
                      <DropdownItem
                        class="text-xs font-normal gap-2"
                        onclick={() => dir.openDetail(row.original)}
                      >
                        <Icon icon="lucide:eye" class="w-4 h-4 text-slate-400" />
                        Lihat Detail
                      </DropdownItem>
                      <DropdownItem
                        class="text-xs font-normal gap-2"
                        onclick={() => dir.openEdit(row.original)}
                      >
                        <Icon icon="lucide:pencil" class="w-4 h-4 text-slate-400" />
                        Edit Jabatan
                      </DropdownItem>
                      <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                      <DropdownItem
                        class="text-xs font-normal gap-2"
                        variant="danger"
                        onclick={() => dir.requestDelete(row.original)}
                      >
                        <Icon icon="lucide:trash-2" class="w-4 h-4" />
                        Hapus Jabatan
                      </DropdownItem>
                    {/snippet}
                  </Dropdown>
                {:else}
                  {cell.getValue()}
                {/if}
              </TableUI.Cell>
            {/each}
          </TableUI.Row>
        {/each}
      </TableUI.Body>
    </TableUI.Root>
    <TableUI.Pagination table={dir.table} />
  </Card>
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
