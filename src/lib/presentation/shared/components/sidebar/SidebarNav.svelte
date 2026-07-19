<script lang="ts">
  import { getContext } from 'svelte';
  import type { SidebarContext } from './Sidebar.svelte';

  interface Props {
    children?: import('svelte').Snippet;
  }

  let { children }: Props = $props();

  const sidebar = getContext<SidebarContext>('sidebar');
</script>

<nav
  class="flex-1 mt-6 {sidebar?.isCollapsed
    ? 'overflow-visible'
    : 'overflow-y-auto'} no-scrollbar space-y-4"
>
  {@render children?.()}
</nav>
