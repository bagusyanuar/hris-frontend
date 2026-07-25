<script lang="ts">
  import { getContext } from 'svelte';
  import { fly } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import type { SidebarContext } from './Sidebar.svelte';

  interface Branch {
    id: string;
    name: string;
    short: string;
    color: string;
  }

  interface Company {
    id: string;
    name: string;
    short: string;
    color: string;
    branches: Branch[];
  }

  interface Props {
    companies: Company[];
    activeBranch: Branch;
  }

  let { companies, activeBranch = $bindable() }: Props = $props();

  const sidebar = getContext<SidebarContext>('sidebar');

  let isDropdownOpen = $state(false);
  let searchQuery = $state('');
  let elementRef = $state<HTMLElement | null>(null);

  // Derive active company from active branch
  const activeCompany = $derived(
    companies.find((company) => company.branches.some((branch) => branch.id === activeBranch.id))
  );

  // Derive filtered list of companies based on search query
  const filteredCompanies = $derived.by(() => {
    if (!searchQuery.trim()) return companies;
    const query = searchQuery.toLowerCase();
    return companies
      .map((company) => {
        const companyMatches =
          company.name.toLowerCase().includes(query) || company.short.toLowerCase().includes(query);

        const matchedBranches = company.branches.filter(
          (branch) =>
            branch.name.toLowerCase().includes(query) || branch.short.toLowerCase().includes(query)
        );

        // If company matches, show all branches. Otherwise show matched branches.
        const finalBranches = companyMatches ? company.branches : matchedBranches;

        return {
          ...company,
          branches: finalBranches
        };
      })
      .filter((company) => company.branches.length > 0);
  });

  // Reset search query when dropdown state changes
  $effect(() => {
    if (!isDropdownOpen) {
      searchQuery = '';
    }
  });

  function handleWindowClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isDropdownOpen && elementRef && !elementRef.contains(target)) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="mt-4 relative" bind:this={elementRef}>
  <button
    onclick={() => (isDropdownOpen = !isDropdownOpen)}
    class="w-full flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900/60 border border-neutral-border hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-150 text-left cursor-pointer
			{sidebar.isCollapsed
      ? 'justify-center p-0 h-10 w-10 mx-auto bg-transparent border-none hover:bg-slate-50 dark:hover:bg-slate-900'
      : ''}"
  >
    <div
      class="w-8 h-8 rounded-lg {activeBranch.color} flex items-center justify-center font-bold text-xs shrink-0"
    >
      {activeBranch.short.slice(0, 2)}
    </div>
    {#if !sidebar.isCollapsed}
      <div class="flex-1 min-w-0">
        <div
          class="text-[10px] font-bold text-brand-text dark:text-emerald-400 uppercase tracking-wider truncate"
        >
          {activeCompany ? activeCompany.name : 'Select Company'}
        </div>
        <div class="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate mt-0.5">
          {activeBranch.name}
        </div>
      </div>
      <Icon icon="lucide:chevrons-up-down" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
    {/if}
  </button>

  <!-- Grouped Switcher Dropdown (Option A) -->
  {#if isDropdownOpen}
    <div
      transition:fly={{ x: 12, duration: 200 }}
      class="absolute top-0 left-full ml-3 min-w-65 w-max max-h-100 overflow-y-auto bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-2 flex flex-col gap-2 scrollable-content"
    >
      <div
        class="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
      >
        Pilih Perusahaan & Cabang
      </div>

      <!-- Search Input -->
      <div class="px-1 py-0.5 relative">
        <Icon
          icon="lucide:search"
          class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
        />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Cari perusahaan/cabang..."
          class="w-full pl-7 pr-3 py-1 bg-slate-50 dark:bg-slate-900 border border-neutral-border focus:outline-none focus:ring-1 focus:ring-brand-primary dark:focus:ring-emerald-500 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      {#if filteredCompanies.length === 0}
        <div class="px-4 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          Tidak ada hasil pencarian
        </div>
      {:else}
        {#each filteredCompanies as company, cIdx (company.id)}
          {#if cIdx > 0}
            <div class="h-px bg-neutral-border my-1"></div>
          {/if}

          <div class="flex flex-col gap-1">
            <!-- Company Header (Non-clickable label) -->
            <div class="flex items-center gap-2 px-2 py-1 select-none">
              <div
                class="w-5 h-5 rounded {company.color} flex items-center justify-center text-[9px] font-extrabold shrink-0"
              >
                {company.short.slice(0, 2)}
              </div>
              <span class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {company.name}
              </span>
            </div>

            <!-- Branches in Company -->
            <div class="flex flex-col gap-0.5 pl-2">
              {#each company.branches as branch (branch.id)}
                <button
                  onclick={() => {
                    activeBranch = branch;
                    isDropdownOpen = false;
                  }}
                  class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs cursor-pointer transition-all duration-150
								{activeBranch.id === branch.id
                    ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
                    : 'text-slate-600 dark:text-slate-300'}"
                >
                  <div class="flex items-center gap-2 whitespace-nowrap">
                    <div
                      class="w-6 h-6 rounded-md {branch.color} flex items-center justify-center font-bold text-[10px] shrink-0"
                    >
                      {branch.short.slice(0, 2)}
                    </div>
                    <span>{branch.name}</span>
                  </div>
                  {#if activeBranch.id === branch.id}
                    <Icon
                      icon="lucide:check"
                      class="w-3.5 h-3.5 text-brand-text dark:text-emerald-400 shrink-0 ml-4"
                    />
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/each}
      {/if}
    </div>
  {/if}
</div>
