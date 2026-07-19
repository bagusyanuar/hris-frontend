<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    isCollapsed: boolean;
  }

  let { isCollapsed = $bindable(false) }: Props = $props();
</script>

<button
  onclick={() => (isCollapsed = !isCollapsed)}
  class="hidden md:flex p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
  aria-label="Toggle Sidebar"
  title="Toggle Sidebar"
>
  <Icon icon="lucide:sidebar" class="w-5 h-5" />
</button>
