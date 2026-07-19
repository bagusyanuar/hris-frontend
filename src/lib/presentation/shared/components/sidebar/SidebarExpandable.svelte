<script lang="ts">
  import { getContext } from 'svelte';
  import { slide } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import type { SidebarContext } from './Sidebar.svelte';

  interface Props {
    label: string;
    icon: string;
    isActive?: boolean;
    children?: import('svelte').Snippet;
  }

  let { label, icon, isActive = false, children }: Props = $props();

  const sidebar = getContext<SidebarContext>('sidebar');

  let isExpanded = $state(false);

  $effect(() => {
    if (isActive) {
      isExpanded = true;
    }
  });

  function handleClick() {
    if (!sidebar.isCollapsed) {
      isExpanded = !isExpanded;
    }
  }
</script>

<div class="w-full flex flex-col relative">
  <button
    onclick={handleClick}
    class="w-full flex items-center rounded-xl text-left transition-all duration-150 group relative cursor-pointer
			{sidebar.isCollapsed ? 'justify-center p-2.5' : 'justify-between p-2.5'}
			{isActive
      ? 'bg-brand-light/50 dark:bg-emerald-500/5 text-brand-text dark:text-emerald-400 font-medium'
      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
  >
    <div class="flex items-center {sidebar.isCollapsed ? '' : 'gap-3'}">
      <Icon
        {icon}
        class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
      />
      {#if !sidebar.isCollapsed}
        <span class="text-xs">{label}</span>
      {/if}
    </div>
    {#if !sidebar.isCollapsed}
      <Icon
        icon="lucide:chevron-down"
        class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 {isExpanded
          ? 'rotate-180'
          : ''}"
      />
    {/if}

    <!-- Custom Hover Flyout Submenu (Collapsed mode) -->
    {#if sidebar.isCollapsed}
      <div
        class="absolute top-0 left-full pl-2 min-w-[188px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 transition-all duration-200 z-999"
      >
        <div
          class="bg-white dark:bg-slate-950 border border-slate-100 dark:border-emerald-500/40 rounded-xl shadow-xl p-2 flex flex-col gap-1 w-full relative"
        >
          <!-- Segitiga penunjuk -->
          <div
            class="absolute right-full top-5 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white dark:border-r-slate-950"
          ></div>

          <div
            class="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1"
          >
            {label}
          </div>
          <div class="flex flex-col gap-0.5">
            {@render children?.()}
          </div>
        </div>
      </div>
    {/if}
  </button>

  <!-- Accordion Submenu (Desktop expanded / Mobile) -->
  {#if !sidebar.isCollapsed && isExpanded}
    <div
      transition:slide={{ duration: 200 }}
      class="pl-2.5 pr-2 py-0.5 space-y-1 mt-1 border-l border-slate-100 dark:border-slate-800 ml-[20px]"
    >
      {@render children?.()}
    </div>
  {/if}
</div>
