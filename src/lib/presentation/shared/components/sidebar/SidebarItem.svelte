<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve */
  import { getContext } from 'svelte';
  import Icon from '@iconify/svelte';
  import { resolve } from '$app/paths';
  import type { Pathname } from '$app/types';
  import { page } from '$app/state';
  import type { SidebarContext } from './Sidebar.svelte';

  interface Props {
    label: string;
    icon?: string;
    isActive?: boolean;
    isSubItem?: boolean;
    href?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let { label, icon, isActive, isSubItem = false, href, onclick }: Props = $props();

  const sidebar = getContext<SidebarContext>('sidebar');

  // Jika isActive tidak didefinisikan secara manual, otomatis deteksi berdasarkan URL pathname saat ini
  const computedActive = $derived(
    isActive !== undefined
      ? isActive
      : href
        ? page.url.pathname === href || page.url.hash === href
        : false
  );

  const className = $derived(
    isSubItem
      ? `w-full flex items-center py-1.5 px-3 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
          computedActive
            ? 'text-brand-text dark:text-emerald-400 font-semibold bg-brand-light dark:bg-emerald-500/10'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/80'
        }`
      : `w-full flex items-center rounded-xl text-left transition-all duration-150 group relative cursor-pointer ${
          sidebar.isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'
        } ${
          computedActive
            ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'
        }`
  );
</script>

{#if href}
  <a
    href={href.startsWith('/') && !href.startsWith('//') ? resolve(href as Pathname) : href}
    {onclick}
    class={className}
  >
    {#if !isSubItem && icon}
      <Icon
        {icon}
        class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
      />
    {/if}
    {#if isSubItem}
      {label}
    {:else if !sidebar.isCollapsed}
      <span class="text-xs">{label}</span>
    {/if}

    <!-- Custom Premium Tooltip -->
    {#if !isSubItem && sidebar.isCollapsed}
      <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-[11px] font-medium rounded-lg shadow-lg border border-slate-100 dark:border-emerald-500/30 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-999 whitespace-nowrap flex items-center"
      >
        <div
          class="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white dark:border-r-slate-950"
        ></div>
        {label}
      </div>
    {/if}
  </a>
{:else}
  <button {onclick} class={className} type="button">
    {#if !isSubItem && icon}
      <Icon
        {icon}
        class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
      />
    {/if}
    {#if isSubItem}
      {label}
    {:else if !sidebar.isCollapsed}
      <span class="text-xs">{label}</span>
    {/if}

    <!-- Custom Premium Tooltip -->
    {#if !isSubItem && sidebar.isCollapsed}
      <div
        class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-[11px] font-medium rounded-lg shadow-lg border border-slate-100 dark:border-emerald-500/30 pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-999 whitespace-nowrap flex items-center"
      >
        <div
          class="absolute right-full top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-white dark:border-r-slate-950"
        ></div>
        {label}
      </div>
    {/if}
  </button>
{/if}
