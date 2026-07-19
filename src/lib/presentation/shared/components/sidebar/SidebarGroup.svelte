<script lang="ts">
  import { getContext } from 'svelte';
  import type { SidebarContext } from './Sidebar.svelte';

  interface Props {
    title: string;
    children?: import('svelte').Snippet;
  }

  let { title, children }: Props = $props();

  const sidebar = getContext<SidebarContext>('sidebar');
</script>

<div>
  {#if !sidebar.isCollapsed}
    <div class="px-2 py-1.5 select-none">
      <span
        class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase"
        >{title}</span
      >
    </div>
  {/if}

  <div class="space-y-1 mt-1">
    {@render children?.()}
  </div>
</div>
