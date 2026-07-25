<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { BranchModel } from '$lib/core/branch';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Button } from '$lib/presentation/shared/components/button';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';

  interface Props {
    branch: BranchModel;
    onEdit: () => void;
    onDelete: () => void;
  }

  let { branch, onEdit, onDelete }: Props = $props();
</script>

<div
  class="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-neutral-card transition-all duration-200 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
>
  <!-- Top accent for main office -->
  {#if branch.isMain}
    <div
      class="absolute top-0 left-3 right-3 h-0.5 bg-linear-to-r from-brand-primary via-emerald-400 to-brand-primary/40 rounded-b-full"
    ></div>
  {/if}

  <div class="flex flex-col gap-3">
    <!-- Header row: icon + name + menu -->
    <div class="flex items-start justify-between gap-2">
      <div class="flex items-center gap-2.5 min-w-0">
        <div
          class="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
          {branch.isMain
            ? 'bg-brand-primary/10 text-brand-primary'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}"
        >
          <Icon icon="lucide:map-pin" class="w-4 h-4" />
        </div>
        <div class="flex flex-col min-w-0">
          <Typography
            variant="body-sm"
            weight="bold"
            class="text-slate-800 dark:text-slate-100 line-clamp-1 leading-snug"
          >
            {branch.name}
          </Typography>
          <span class="text-[11px] text-slate-400 truncate">{branch.city || 'Belum diset'}</span>
        </div>
      </div>

      <!-- Context menu (visible on hover) -->
      <div class="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Dropdown align="right">
          {#snippet trigger(toggle)}
            <Button
              variant="ghost"
              size="icon"
              onclick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              class="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <Icon icon="lucide:ellipsis" class="w-4 h-4" />
            </Button>
          {/snippet}
          {#snippet content()}
            <DropdownItem class="text-xs gap-2" onclick={onEdit}>
              <Icon icon="lucide:pencil" class="w-3.5 h-3.5 text-slate-400" />
              Edit Cabang
            </DropdownItem>
            <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
            <DropdownItem class="text-xs gap-2" variant="danger" onclick={onDelete}>
              <Icon icon="lucide:trash-2" class="w-3.5 h-3.5" />
              Hapus Cabang
            </DropdownItem>
          {/snippet}
        </Dropdown>
      </div>
    </div>
  </div>

  <!-- Footer: code + badges -->
  <div
    class="flex items-center justify-between mt-4 pt-3 border-t border-slate-100/80 dark:border-slate-800/40"
  >
    <span
      class="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 px-2 py-0.5 rounded"
    >
      {branch.code}
    </span>

    <div class="flex items-center gap-2">
      {#if branch.isMain}
        <Badge
          variant="primary"
          class="text-[10px] py-0 px-2 bg-brand-primary text-white border-0 gap-1 font-medium"
        >
          <Icon icon="lucide:crown" class="w-3 h-3" />
          Pusat
        </Badge>
      {/if}

      <div class="flex items-center gap-1">
        <span class="h-1.5 w-1.5 rounded-full {branch.isActive ? 'bg-emerald-500' : 'bg-slate-300'}"
        ></span>
        <span
          class="text-[10px] font-medium {branch.isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-400'}"
        >
          {branch.isActive ? 'Aktif' : 'Nonaktif'}
        </span>
      </div>
    </div>
  </div>
</div>
