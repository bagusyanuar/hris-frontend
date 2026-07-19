<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    activeMenu: string;
    parentLabel?: string;
  }

  let { activeMenu, parentLabel = 'Pages' }: Props = $props();
</script>

<div class="hidden md:flex items-center gap-2 select-none">
  <span class="text-slate-400 text-xs">{parentLabel}</span>
  <Icon icon="lucide:chevron-right" class="w-3 h-3 text-slate-300" />
  <span class="text-slate-800 dark:text-slate-200 text-xs font-medium">{activeMenu}</span>
</div>
