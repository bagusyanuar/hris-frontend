<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { CompanyModel } from '$lib/core/company';
  import type { BranchModel } from '$lib/core/branch';
  import { Button } from '$lib/presentation/shared/components/button';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';
  import { Typography } from '$lib/presentation/shared/components/typography';

  interface Props {
    company: CompanyModel;
    onEditBranch: (branch: BranchModel) => void;
    onDeleteBranch: (branch: BranchModel) => void;
    onAddBranch: () => void;
  }

  let { company, onEditBranch, onDeleteBranch, onAddBranch }: Props = $props();

  const branches = $derived(company.branches ?? []);
</script>

<div class="flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Icon icon="lucide:git-branch" class="w-4 h-4 text-slate-400" />
      <Typography variant="body-sm" weight="semibold" color="primary">
        Daftar Cabang ({branches.length})
      </Typography>
    </div>
    <Button variant="outline" size="xs" onclick={onAddBranch} class="gap-1 text-[11px] h-7">
      <Icon icon="lucide:plus" class="w-3.5 h-3.5" />
      Tambah Cabang
    </Button>
  </div>

  {#if branches.length === 0}
    <div class="flex flex-col items-center justify-center py-6 text-center">
      <div class="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
        <Icon icon="lucide:building-2" class="w-5 h-5" />
      </div>
      <Typography variant="body-xs" color="secondary">
        Belum ada cabang terdaftar untuk perusahaan ini.
      </Typography>
    </div>
  {:else}
    <div class="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-medium">
            <th class="p-3">Nama Cabang</th>
            <th class="p-3">Kode</th>
            <th class="p-3">Kota</th>
            <th class="p-3 text-center">Kantor Pusat</th>
            <th class="p-3 text-center">Status</th>
            <th class="p-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          {#each branches as branch (branch.id)}
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
              <td class="p-3 font-medium text-slate-700 dark:text-slate-300">
                {branch.name}
              </td>
              <td class="p-3">
                <span class="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                  {branch.code}
                </span>
              </td>
              <td class="p-3 text-slate-500">
                {branch.city || '-'}
              </td>
              <td class="p-3 text-center">
                {#if branch.isMain}
                  <Badge variant="primary" class="text-[10px] py-0 px-1.5 bg-brand-primary text-white">
                    Pusat
                  </Badge>
                {:else}
                  <span class="text-slate-400">-</span>
                {/if}
              </td>
              <td class="p-3 text-center">
                {#if branch.isActive}
                  <Badge variant="success" class="text-[10px] py-0 px-1.5">
                    Aktif
                  </Badge>
                {:else}
                  <Badge variant="default" class="text-[10px] py-0 px-1.5">
                    Nonaktif
                  </Badge>
                {/if}
              </td>
              <td class="p-3 text-right">
                <Dropdown align="right">
                  {#snippet trigger(toggle)}
                    <button
                      onclick={(e) => {
                        e.stopPropagation();
                        toggle();
                      }}
                      class="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      <Icon icon="lucide:more-horizontal" class="w-4 h-4" />
                    </button>
                  {/snippet}
                  {#snippet content()}
                    <DropdownItem class="text-xs gap-1.5" onclick={() => onEditBranch(branch)}>
                      <Icon icon="lucide:pencil" class="w-3.5 h-3.5" />
                      Edit Cabang
                    </DropdownItem>
                    <DropdownItem class="text-xs gap-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onclick={() => onDeleteBranch(branch)}>
                      <Icon icon="lucide:trash-2" class="w-3.5 h-3.5" />
                      Hapus Cabang
                    </DropdownItem>
                  {/snippet}
                </Dropdown>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
