<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve */
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import { AlertDialog } from '$lib/presentation/shared/components/dialog';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import * as TableUI from '$lib/presentation/shared/components/table';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import RolesDetailDrawer from '../components/RolesDetailDrawer.svelte';
  import { useRolesDirectory } from '../runes/roles-directory.svelte';

  const dir = useRolesDirectory();
</script>

<div class="flex flex-col gap-3">
  <!-- Header Panel -->
  <Card>
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
      <div class="flex items-center gap-4">
        <div
          class="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand-primary shrink-0 border border-brand-primary/10"
        >
          <Icon icon="lucide:shield" class="w-6 h-6" />
        </div>
        <div class="flex flex-col gap-1">
          <Typography variant="h4" weight="bold">Role & Hak Akses</Typography>
          <Typography variant="body-sm" color="secondary">
            Kelola role hak akses pengguna dan izin operasional modul HRIS.
          </Typography>
        </div>
      </div>
      <div
        class="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/55 dark:border-slate-800 self-stretch sm:self-auto"
      >
        <div class="flex items-center gap-2 px-3">
          <Icon icon="lucide:shield" class="w-4 h-4 text-slate-400" />
          <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
            {dir.table.getRowModel().rows.length}
            <span class="text-slate-500 font-normal">Role Terdaftar</span>
          </span>
        </div>
      </div>
    </div>
  </Card>

  <!-- Table Card -->
  <Card>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <Typography variant="h5" weight="semibold">Daftar Role</Typography>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <TextField
          placeholder="Cari role..."
          size="sm"
          class="w-full sm:w-64"
          bind:value={() => dir.searchQuery, (v) => (dir.searchQuery = v)}
        >
          {#snippet prefix()}
            <Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
          {/snippet}
        </TextField>
        <Button
          variant="primary"
          size="sm"
          onclick={() => goto('/roles/new')}
          class="whitespace-nowrap"
        >
          <Icon icon="lucide:plus" class="w-4 h-4 shrink-0" />
          Tambah Role
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
                    <Icon icon="lucide:shield" class="w-4 h-4 text-slate-400 shrink-0" />
                    <span class="font-medium text-slate-900 dark:text-slate-100"
                      >{cell.getValue()}</span
                    >
                  </div>
                {:else if cell.column.id === 'description'}
                  <span
                    class="text-slate-500 dark:text-slate-400 text-sm truncate max-w-[300px] block"
                    title={cell.getValue() as string}
                  >
                    {cell.getValue() ?? '-'}
                  </span>
                {:else if cell.column.id === 'permissionsCount'}
                  <span
                    class="inline-flex items-center rounded-md bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-primary border border-brand-primary/10 shadow-2xs font-mono"
                  >
                    {cell.getValue()} Akses
                  </span>
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
                        onclick={() => goto(`/roles/${row.original.id}/edit`)}
                      >
                        <Icon icon="lucide:pencil" class="w-4 h-4 text-slate-400" />
                        Ubah Akses / Edit
                      </DropdownItem>
                      <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                      <DropdownItem
                        class="text-xs font-normal gap-2"
                        variant="danger"
                        onclick={() => dir.requestDelete(row.original)}
                      >
                        <Icon icon="lucide:trash-2" class="w-4 h-4" />
                        Hapus Role
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

<AlertDialog
  bind:open={() => dir.isDeleteOpen, (v) => (dir.isDeleteOpen = v)}
  title="Hapus Role?"
  description={`Ini akan menghapus role "${dir.deleteTarget?.name}" secara permanen. Pengguna yang memiliki role ini mungkin akan kehilangan hak akses mereka. Lanjutkan?`}
  variant="danger"
  confirmText="Hapus"
  isLoading={dir.isSubmitting}
  onconfirm={dir.confirmDelete}
  oncancel={() => (dir.isDeleteOpen = false)}
/>

<RolesDetailDrawer
  isOpen={dir.isDrawerOpen}
  onClose={() => (dir.isDrawerOpen = false)}
  role={dir.selectedRole}
/>
