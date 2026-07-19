<script lang="ts" module>
  export interface SidebarContext {
    isCollapsed: boolean;
    isMobile: boolean;
    closeMobile: () => void;
  }
</script>

<script lang="ts">
  import Icon from '@iconify/svelte';
  import ContextBridge from './ContextBridge.svelte';

  interface Props {
    isCollapsed?: boolean;
    isMobileOpen?: boolean;
    children?: import('svelte').Snippet;
  }

  let {
    isCollapsed = $bindable(false),
    isMobileOpen = $bindable(false),
    children
  }: Props = $props();

  function closeMobile() {
    isMobileOpen = false;
  }
</script>

<!-- Helper snippet to establish context dynamically for desktop vs mobile -->
{#snippet container(isMobileView: boolean)}
  {@const ctx = {
    get isCollapsed() {
      return isMobileView ? false : isCollapsed;
    },
    get isMobile() {
      return isMobileView;
    },
    closeMobile
  }}
  <ContextBridge value={ctx}>
    {@render children?.()}
  </ContextBridge>
{/snippet}

<!-- DESKTOP SIDEBAR -->
<aside
  class="hidden md:flex flex-col shrink-0 bg-neutral-card border border-neutral-border rounded-xl p-4 transition-all duration-300 relative
		{isCollapsed ? 'w-20' : 'w-64'}"
>
  {@render container(false)}
</aside>

<!-- MOBILE NAV DRAWER OVERLAY -->
{#if isMobileOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={closeMobile}
    class="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
  ></div>
{/if}

<!-- MOBILE NAV DRAWER PANEL -->
<aside
  class="fixed top-0 bottom-0 left-0 w-64 bg-neutral-card p-4 border-r border-neutral-border flex flex-col z-50 transition-transform duration-300 md:hidden
		{isMobileOpen ? 'translate-x-0' : '-translate-x-full'}"
>
  <!-- Drawer close button (only visible on mobile layout) -->
  <div class="absolute top-4 right-4 md:hidden z-10">
    <button
      onclick={closeMobile}
      class="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
    >
      <Icon icon="lucide:x" class="w-5 h-5" />
    </button>
  </div>
  {@render container(true)}
</aside>
