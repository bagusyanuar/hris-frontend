<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import { slide, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import Icon from '@iconify/svelte';

  // State for theme and sidebar
  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  let isCollapsed = $state(false);
  let isMobileOpen = $state(false);
  let isProfileDropdownOpen = $state(false);
  let isNotificationsOpen = $state(false);

  // Track expandable items (e.g. Payroll tree)
  let isPayrollExpanded = $state(false);

  // Active route tracker
  let activeMenu = $state('Staff Directory');

  // Search bar state
  let searchQuery = $state('');
  let isSearchFocused = $state(false);

  // Toggle theme
  function toggleTheme() {
    isDark = !isDark;
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  // DOM element references for detecting clicks outside
  let orgSwitcherEl = $state<HTMLElement | null>(null);
  let profileWidgetEl = $state<HTMLElement | null>(null);
  let notifWidgetEl = $state<HTMLElement | null>(null);

  function handleWindowClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isOrgDropdownOpen && orgSwitcherEl && !orgSwitcherEl.contains(target)) {
      isOrgDropdownOpen = false;
    }
    if (isProfileDropdownOpen && profileWidgetEl && !profileWidgetEl.contains(target)) {
      isProfileDropdownOpen = false;
    }
    if (isNotificationsOpen && notifWidgetEl && !notifWidgetEl.contains(target)) {
      isNotificationsOpen = false;
    }
  }

  // Organization Switcher states
  let organizations = [
    {
      id: '1',
      name: 'Panorama Veteran',
      short: 'PV',
      color: 'bg-emerald-600 dark:bg-emerald-500 text-white'
    },
    {
      id: '2',
      name: 'Panorama Pasar Kliwon',
      short: 'PK',
      color: 'bg-blue-600 dark:bg-blue-500 text-white'
    }
  ];
  let activeOrg = $state(organizations[0]);
  let isOrgDropdownOpen = $state(false);
</script>

<svelte:window onclick={handleWindowClick} />

<div
  class="h-screen flex bg-neutral-bg p-3 gap-3 overflow-hidden text-slate-900 transition-colors duration-200"
>
  <!-- DESKTOP SIDEBAR -->
  <aside
    class="hidden md:flex flex-col shrink-0 bg-neutral-card border border-neutral-border rounded-xl p-4 transition-all duration-300 relative
			{isCollapsed ? 'w-20' : 'w-64'}"
  >
    <!-- Brand Logo Header -->
    <div
      class="flex items-center select-none transition-all duration-300
			{isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-2 py-3'}"
    >
      <div
        class="flex items-center justify-center shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all duration-300
					{isCollapsed ? 'w-9 h-9' : 'w-10 h-10'}"
      >
        <Icon
          icon="lucide:layers"
          class="transition-all duration-300 {isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}"
        />
      </div>
      {#if !isCollapsed}
        <div class="flex flex-col min-w-0">
          <span
            class="font-bold text-base tracking-tight text-slate-950 dark:text-slate-50 leading-none"
            >TALENTFLOW</span
          >
          <span class="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1"
            >HRIS Ecosystem</span
          >
        </div>
      {/if}
    </div>

    <!-- Organization Switcher -->
    <div class="mt-4 relative" bind:this={orgSwitcherEl}>
      <button
        onclick={() => (isOrgDropdownOpen = !isOrgDropdownOpen)}
        class="w-full flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900/60 border border-neutral-border hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-150 text-left cursor-pointer
					{isCollapsed
          ? 'justify-center p-0 h-10 w-10 mx-auto bg-transparent border-none hover:bg-slate-50 dark:hover:bg-slate-900'
          : ''}"
      >
        <div
          class="w-8 h-8 rounded-lg {activeOrg.color} flex items-center justify-center font-bold text-xs shrink-0"
        >
          {activeOrg.short}
        </div>
        {#if !isCollapsed}
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
              {activeOrg.name}
            </div>
            <div class="text-[9px] text-slate-500 truncate mt-0.5">HRIS Portal</div>
          </div>
          <Icon icon="lucide:chevrons-up-down" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        {/if}
      </button>

      <!-- Organization Dropdown -->
      {#if isOrgDropdownOpen}
        <div
          transition:fly={{ x: 12, duration: 200 }}
          class="absolute top-0 left-full ml-3 min-w-[220px] w-max bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1"
        >
          <div
            class="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
          >
            Select Organization
          </div>
          {#each organizations as org (org.id)}
            <button
              onclick={() => {
                activeOrg = org;
                isOrgDropdownOpen = false;
              }}
              class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs cursor-pointer
								{activeOrg.id === org.id
                ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
                : 'text-slate-600 dark:text-slate-300'}"
            >
              <div class="flex items-center gap-2.5 whitespace-nowrap">
                <div
                  class="w-6 h-6 rounded-md {org.color} flex items-center justify-center font-bold text-[10px] shrink-0"
                >
                  {org.short}
                </div>
                <span>{org.name}</span>
              </div>
              {#if activeOrg.id === org.id}
                <Icon
                  icon="lucide:check"
                  class="w-3.5 h-3.5 text-brand-text dark:text-emerald-400 shrink-0 ml-4"
                />
              {/if}
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 mt-6 overflow-y-auto no-scrollbar space-y-4">
      <!-- EMPLOYEES GROUP -->
      <div>
        {#if !isCollapsed}
          <div class="px-2 py-1.5 select-none">
            <span class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500"
              >EMPLOYEES</span
            >
          </div>
        {/if}

        <div class="space-y-1 mt-1">
          {#each [{ name: 'Dashboard', icon: 'lucide:grid' }, { name: 'Staff Directory', icon: 'lucide:users' }, { name: 'Onboarding', icon: 'lucide:user-plus' }, { name: 'Time & Attendance', icon: 'lucide:clock' }, { name: 'Performance', icon: 'lucide:trending-up' }] as item (item.name)}
            <button
              onclick={() => (activeMenu = item.name)}
              class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
								{isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'}
								{activeMenu === item.name
                ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
              title={isCollapsed ? item.name : ''}
            >
              <Icon
                icon={item.icon}
                class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              {#if !isCollapsed}
                <span class="text-xs">{item.name}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>

      <!-- FINANCE GROUP -->
      <div>
        {#if !isCollapsed}
          <div class="px-2 py-1.5 select-none">
            <span class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500"
              >FINANCE</span
            >
          </div>
        {/if}

        <div class="space-y-1 mt-1">
          <!-- Payroll Expandable Menu Item -->
          <div class="w-full flex flex-col">
            <button
              onclick={() => (isPayrollExpanded = !isPayrollExpanded)}
              class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
								{isCollapsed ? 'justify-center p-2.5' : 'justify-between p-2.5'}
								{activeMenu === 'Run Payroll' || activeMenu === 'Payslips'
                ? 'bg-brand-light/50 dark:bg-emerald-500/5 text-brand-text dark:text-emerald-400 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
              title={isCollapsed ? 'Payroll' : ''}
            >
              <div class="flex items-center {isCollapsed ? '' : 'gap-3'}">
                <Icon
                  icon="lucide:banknote"
                  class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
                />
                {#if !isCollapsed}
                  <span class="text-xs">Payroll</span>
                {/if}
              </div>
              {#if !isCollapsed}
                <Icon
                  icon="lucide:chevron-down"
                  class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 {isPayrollExpanded
                    ? 'rotate-180'
                    : ''}"
                />
              {/if}
            </button>

            <!-- Payroll Sub-Items -->
            {#if !isCollapsed && isPayrollExpanded}
              <div
                transition:slide={{ duration: 200 }}
                class="pl-2.5 pr-2 py-0.5 space-y-1 mt-1 border-l border-slate-100 dark:border-slate-800 ml-[20px]"
              >
                {#each [{ name: 'Run Payroll' }, { name: 'Payslips' }] as subItem (subItem.name)}
                  <button
                    onclick={() => (activeMenu = subItem.name)}
                    class="w-full flex items-center py-1.5 px-3 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer
											{activeMenu === subItem.name
                      ? 'text-brand-text dark:text-emerald-400 font-semibold bg-brand-light dark:bg-emerald-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'}"
                  >
                    {subItem.name}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Expenses -->
          <button
            onclick={() => (activeMenu = 'Expenses')}
            class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
							{isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'}
							{activeMenu === 'Expenses'
              ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
            title={isCollapsed ? 'Expenses' : ''}
          >
            <Icon
              icon="lucide:wallet"
              class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            {#if !isCollapsed}
              <span class="text-xs">Expenses</span>
            {/if}
          </button>

          <!-- Invoicing -->
          <button
            onclick={() => (activeMenu = 'Invoicing')}
            class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
							{isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'}
							{activeMenu === 'Invoicing'
              ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
            title={isCollapsed ? 'Invoicing' : ''}
          >
            <Icon
              icon="lucide:file-text"
              class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
            />
            {#if !isCollapsed}
              <span class="text-xs">Invoicing</span>
            {/if}
          </button>
        </div>
      </div>

      <!-- SETTINGS GROUP -->
      <div>
        {#if !isCollapsed}
          <div class="px-2 py-1.5 select-none">
            <span class="text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500"
              >SETTINGS</span
            >
          </div>
        {/if}

        <div class="space-y-1 mt-1">
          {#each [{ name: 'General Settings', icon: 'lucide:settings' }, { name: 'Integrations', icon: 'lucide:puzzle' }, { name: 'Access Control', icon: 'lucide:shield' }] as item (item.name)}
            <button
              onclick={() => (activeMenu = item.name)}
              class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
								{isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'}
								{activeMenu === item.name
                ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
              title={isCollapsed ? item.name : ''}
            >
              <Icon
                icon={item.icon}
                class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
              {#if !isCollapsed}
                <span class="text-xs">{item.name}</span>
              {/if}
            </button>
          {/each}
        </div>
      </div>
    </nav>

    <!-- Profile Widget Footer -->
    <div class="mt-auto pt-4 border-t border-neutral-border">
      <div class="relative" bind:this={profileWidgetEl}>
        <button
          onclick={() => (isProfileDropdownOpen = !isProfileDropdownOpen)}
          class="w-full flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all duration-150 text-left cursor-pointer
						{isCollapsed ? 'justify-center hover:bg-transparent p-0' : ''}"
        >
          <div
            class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold shrink-0 relative"
          >
            <span>A</span>
            <!-- Active Indicator Dot -->
            <span
              class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-card"
            ></span>
          </div>
          {#if !isCollapsed}
            <div class="flex-1 min-w-0">
              <div
                class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-normal truncate"
              >
                administrator
              </div>
              <div class="text-[10px] text-slate-400 leading-none truncate mt-0.5">
                ADMINISTRATOR
              </div>
            </div>
            <Icon icon="lucide:chevrons-up-down" class="w-4 h-4 text-slate-400 shrink-0" />
          {/if}
        </button>

        <!-- Profile Dropdown (mockup) -->
        {#if isProfileDropdownOpen}
          <div
            transition:fly={{ x: -12, duration: 200 }}
            class="absolute bottom-0 left-full ml-3 w-48 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1"
          >
            <button
              class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <Icon icon="lucide:user" class="w-4 h-4" />
              <span>My Profile</span>
            </button>
            <button
              class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs text-rose-600 dark:text-rose-400 cursor-pointer"
            >
              <Icon icon="lucide:log-out" class="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        {/if}
      </div>

      <!-- System Versioning -->
      {#if !isCollapsed}
        <div class="border-t border-neutral-border my-3 mx-2"></div>
        <div
          class="px-2 flex flex-col text-[10px] text-slate-400 dark:text-slate-600 select-none leading-normal"
        >
          <span class="font-bold">TalentFlow v1.0.0-Beta</span>
          <span class="text-[9px]">HRIS Hub. Clean & Solid Portal.</span>
        </div>
      {/if}
    </div>
  </aside>

  <!-- MOBILE NAV DRAWER OVERLAY -->
  {#if isMobileOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      onclick={() => (isMobileOpen = false)}
      class="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden"
    ></div>
  {/if}

  <!-- MOBILE NAV DRAWER PANEL -->
  <aside
    class="fixed top-0 bottom-0 left-0 w-64 bg-neutral-card p-4 border-r border-neutral-border flex flex-col z-50 transition-transform duration-300 md:hidden
			{isMobileOpen ? 'translate-x-0' : '-translate-x-full'}"
  >
    <!-- Drawer Header -->
    <div class="flex items-center justify-between px-2 py-3">
      <div class="flex items-center gap-3">
        <div
          class="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
        >
          <Icon icon="lucide:layers" class="w-6 h-6" />
        </div>
        <div class="flex flex-col">
          <span
            class="font-bold text-base tracking-tight text-slate-950 dark:text-slate-50 leading-none"
            >TALENTFLOW</span
          >
          <span class="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1"
            >HRIS Ecosystem</span
          >
        </div>
      </div>
      <button onclick={() => (isMobileOpen = false)} class="text-slate-500 hover:text-slate-800">
        <Icon icon="lucide:x" class="w-5 h-5" />
      </button>
    </div>

    <!-- Switcher Widget -->
    <div
      class="mt-5 p-2 bg-slate-50 dark:bg-slate-900/60 border border-neutral-border rounded-xl flex items-center gap-3"
    >
      <div
        class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0"
      >
        NV
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">Acme Corp.</div>
        <div class="text-[10px] text-slate-500 truncate mt-0.5">HRIS Portal</div>
      </div>
      <span class="text-[9px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded font-bold"
        >ACTIVE</span
      >
    </div>

    <!-- Nav -->
    <nav class="flex-1 mt-6 overflow-y-auto no-scrollbar space-y-4">
      <div>
        <div
          class="px-2 py-1.5 text-[10px] font-bold tracking-widest text-slate-400 dark:text-slate-500"
        >
          EMPLOYEES
        </div>
        <div class="space-y-1 mt-1">
          {#each [{ name: 'Dashboard', icon: 'lucide:grid' }, { name: 'Staff Directory', icon: 'lucide:users' }, { name: 'Onboarding', icon: 'lucide:user-plus' }, { name: 'Time & Attendance', icon: 'lucide:clock' }, { name: 'Performance', icon: 'lucide:trending-up' }] as item (item.name)}
            <button
              onclick={() => {
                activeMenu = item.name;
                isMobileOpen = false;
              }}
              class="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all duration-150
								{activeMenu === item.name
                ? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium border-l-4 border-emerald-500 pl-2'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
            >
              <Icon icon={item.icon} class="w-5 h-5 shrink-0" />
              <span class="text-xs">{item.name}</span>
            </button>
          {/each}
        </div>
      </div>
    </nav>

    <!-- Footer -->
    <div class="mt-auto pt-4 border-t border-neutral-border">
      <div class="flex items-center gap-3 p-2">
        <div
          class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold shrink-0"
        >
          <span>A</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            administrator
          </div>
          <div class="text-[10px] text-slate-400 truncate mt-0.5">ADMINISTRATOR</div>
        </div>
      </div>
      <div
        class="mt-2 px-2 flex flex-col text-[10px] text-slate-400 dark:text-slate-600 select-none"
      >
        <span class="font-bold">TalentFlow v1.0.0-Beta</span>
        <span class="text-[9px]">HRIS Hub. Clean & Solid Portal.</span>
      </div>
    </div>
  </aside>

  <!-- MAIN WORKSPACE -->
  <div class="flex-1 flex flex-col min-w-0 gap-3 overflow-hidden">
    <!-- HEADER BAR -->
    <header
      class="h-16 shrink-0 bg-neutral-card border border-neutral-border rounded-xl flex items-center justify-between px-6 z-30 transition-colors duration-200"
    >
      <!-- Left actions -->
      <div class="flex items-center gap-3">
        <!-- Hamburger mobile trigger -->
        <button
          onclick={() => (isMobileOpen = true)}
          class="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Icon icon="lucide:menu" class="w-5 h-5" />
        </button>

        <!-- Desktop Sidebar Collapse Trigger -->
        <button
          onclick={() => (isCollapsed = !isCollapsed)}
          class="hidden md:flex p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          <Icon icon="lucide:sidebar" class="w-5 h-5" />
        </button>

        <div class="hidden md:flex items-center gap-2">
          <span class="text-slate-400 text-xs">Pages</span>
          <Icon icon="lucide:chevron-right" class="w-3 h-3 text-slate-300" />
          <span class="text-slate-800 dark:text-slate-200 text-xs font-medium">{activeMenu}</span>
        </div>

        <!-- Search Bar (Desktop) -->
        <div
          class="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-neutral-border rounded-xl w-64 focus-within:w-80 focus-within:border-emerald-500/50 transition-all duration-300 ml-4 relative"
        >
          <Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
          <input
            type="text"
            bind:value={searchQuery}
            onfocus={() => (isSearchFocused = true)}
            onblur={() => setTimeout(() => (isSearchFocused = false), 200)}
            placeholder="Search anything..."
            class="bg-transparent border-none focus:ring-0 focus:border-transparent outline-none focus:outline-none text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
          />
          <kbd
            class="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 bg-neutral-card border border-neutral-border rounded"
          >
            <span class="text-[10px]">⌘</span>K
          </kbd>

          <!-- Autocomplete Popover Dropdown -->
          {#if isSearchFocused}
            <div
              transition:slide={{ duration: 150 }}
              class="absolute top-full left-0 right-0 mt-2 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-2 text-xs flex flex-col gap-2 min-w-[280px]"
            >
              {#if searchQuery.trim() === ''}
                <!-- Mock Recent Searches -->
                <div>
                  <div
                    class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                  >
                    Recent Searches
                  </div>
                  <div class="flex flex-col gap-0.5 mt-1">
                    {#each ['Sarah L. (Staff)', 'Payroll Draft (April)', 'Time & Attendance'] as item (item)}
                      <button
                        onclick={() => {
                          searchQuery = item;
                          if (item.includes('Staff')) activeMenu = 'Staff Directory';
                          if (item.includes('Payroll')) activeMenu = 'Payroll';
                          if (item.includes('Time')) activeMenu = 'Time & Attendance';
                        }}
                        class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 text-left text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        <Icon icon="lucide:history" class="w-3.5 h-3.5 text-slate-400" />
                        <span>{item}</span>
                      </button>
                    {/each}
                  </div>
                </div>
              {:else}
                <!-- Mock Search Results -->
                <div>
                  <div
                    class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider"
                  >
                    Search Results
                  </div>
                  <div class="flex flex-col gap-0.5 mt-1">
                    <!-- Filter mock results -->
                    {#each [{ name: 'Sarah Lincoln (HR Manager)', type: 'Employee', route: 'Staff Directory', icon: 'lucide:user' }, { name: 'Payroll Run April 2026', type: 'Payroll', route: 'Payroll', icon: 'lucide:banknote' }, { name: 'Time Sheets approval', type: 'Attendance', route: 'Time & Attendance', icon: 'lucide:clock' }, { name: 'Integrations settings', type: 'Settings', route: 'Integrations', icon: 'lucide:puzzle' }].filter((r) => r.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) || r.type
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())) as res (res.name)}
                      <button
                        onclick={() => {
                          activeMenu = res.route;
                          searchQuery = '';
                        }}
                        class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 text-left text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        <div class="flex items-center gap-2">
                          <Icon icon={res.icon} class="w-3.5 h-3.5 text-slate-400" />
                          <span>{res.name}</span>
                        </div>
                        <span
                          class="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium"
                          >{res.type}</span
                        >
                      </button>
                    {:else}
                      <div class="px-2 py-3 text-center text-slate-400">
                        No results found for "{searchQuery}"
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          <Icon icon={isDark ? 'lucide:sun' : 'lucide:moon'} class="w-5 h-5" />
        </button>

        <!-- Dummy Notifications -->
        <div class="relative" bind:this={notifWidgetEl}>
          <button
            onclick={() => (isNotificationsOpen = !isNotificationsOpen)}
            class="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
          >
            <Icon icon="lucide:bell" class="w-5 h-5" />
            <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          <!-- Notifications Popover -->
          {#if isNotificationsOpen}
            <div
              transition:fly={{ y: -12, duration: 200 }}
              class="absolute top-full right-0 mt-2 w-72 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 flex flex-col overflow-hidden"
            >
              <div
                class="px-3 py-2.5 border-b border-neutral-border flex justify-between items-center bg-slate-50 dark:bg-slate-900/40"
              >
                <span class="font-bold text-xs text-slate-800 dark:text-slate-100"
                  >Notifications</span
                >
                <button
                  class="text-[10px] text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >Mark all read</button
                >
              </div>
              <div class="flex flex-col max-h-[300px] overflow-y-auto no-scrollbar">
                <!-- Dummy Notif 1 -->
                <button
                  class="w-full text-left px-3 py-3 border-b border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer flex gap-3 opacity-100 bg-emerald-500/5"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Icon icon="lucide:user-plus" class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs text-slate-800 dark:text-slate-200 font-medium"
                      >New Employee Onboarding</span
                    >
                    <span class="text-[10px] text-slate-500 leading-tight mt-0.5"
                      >Please review onboarding documents for Sarah Lincoln.</span
                    >
                    <span class="text-[9px] text-emerald-600 font-medium mt-1.5">2 mins ago</span>
                  </div>
                </button>
                <!-- Dummy Notif 2 -->
                <button
                  class="w-full text-left px-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer flex gap-3 opacity-75"
                >
                  <div
                    class="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <Icon icon="lucide:calendar-clock" class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs text-slate-800 dark:text-slate-200 font-medium"
                      >Leave Request Pending</span
                    >
                    <span class="text-[10px] text-slate-500 leading-tight mt-0.5"
                      >John Doe requested 3 days off for vacation.</span
                    >
                    <span class="text-[9px] text-slate-400 mt-1.5">1 hour ago</span>
                  </div>
                </button>
              </div>
              <div
                class="px-3 py-2 border-t border-neutral-border text-center bg-slate-50 dark:bg-slate-900/40"
              >
                <button
                  class="text-[10px] text-slate-500 hover:text-emerald-600 font-semibold cursor-pointer"
                  >View all notifications</button
                >
              </div>
            </div>
          {/if}
        </div>
      </div>
    </header>

    <!-- PAGE BODY -->
    <main
      class="flex-1 overflow-y-auto bg-neutral-card border border-neutral-border rounded-xl p-6 md:p-8 space-y-6 scrollable-content"
    >
      <!-- Welcome Header -->
      <div class="flex flex-col gap-1">
        <Typography variant="h4" weight="bold" class="text-slate-900 dark:text-slate-50"
          >Dashboard Overview</Typography
        >
        <Typography variant="body-sm" color="secondary"
          >Welcome back, Admin! Here is what's happening today in your workforce.</Typography
        >
      </div>

      <!-- Metrics Dashboard Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each [{ title: 'Total Employees', value: '185', icon: 'lucide:users', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' }, { title: 'Present Today', value: '172 (93%)', icon: 'lucide:check-square', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' }, { title: 'On Leave', value: '8', icon: 'lucide:plane', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' }, { title: 'Upcoming Reviews', value: '4', icon: 'lucide:star', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }] as stat (stat.title)}
          <Card
            hoverable={true}
            class="relative overflow-hidden border border-neutral-border bg-neutral-card"
          >
            <div class="flex items-center justify-between">
              <div class="flex flex-col gap-1">
                <Typography variant="caption" color="secondary">{stat.title}</Typography>
                <Typography variant="h5" weight="bold" class="text-slate-900 dark:text-slate-50"
                  >{stat.value}</Typography
                >
              </div>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center {stat.color}">
                <Icon icon={stat.icon} class="w-5 h-5" />
              </div>
            </div>
          </Card>
        {/each}
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Area (Leave request summary / list) -->
        <div class="lg:col-span-2 space-y-6">
          <Card
            title="Leave Requests"
            description="Review employee leave requests that require pending actions."
            class="bg-neutral-card border border-neutral-border"
          >
            <div class="mt-4 divide-y divide-neutral-border overflow-x-auto">
              <table class="w-full text-left text-xs">
                <thead>
                  <tr class="text-slate-400 font-semibold border-b border-neutral-border pb-3">
                    <th class="py-2.5 font-bold">Employee</th>
                    <th class="py-2.5 font-bold">Type</th>
                    <th class="py-2.5 font-bold">Duration</th>
                    <th class="py-2.5 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-border">
                  {#each [{ name: 'Sarah L.', role: 'HR Manager', type: 'Annual Leave', duration: '3 days (Apr 20-22)' }, { name: 'Mark P.', role: 'Senior Developer', type: 'Sick Leave', duration: '1 day (Apr 18)' }, { name: 'Alex K.', role: 'QA Lead', type: 'Remote Work', duration: '2 days (Apr 21-22)' }] as leave (leave.name)}
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                      <td class="py-3 flex items-center gap-2.5">
                        <div
                          class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center justify-center"
                        >
                          {leave.name.charAt(0)}
                        </div>
                        <div class="flex flex-col">
                          <span class="font-bold text-slate-800 dark:text-slate-200"
                            >{leave.name}</span
                          >
                          <span class="text-[10px] text-slate-400">{leave.role}</span>
                        </div>
                      </td>
                      <td class="py-3 text-slate-600 dark:text-slate-300 font-medium"
                        >{leave.type}</td
                      >
                      <td class="py-3 text-slate-500">{leave.duration}</td>
                      <td class="py-3">
                        <div class="flex items-center gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            class="py-1 px-2.5 text-[11px] h-7 bg-emerald-600 hover:bg-emerald-700"
                            >Approve</Button
                          >
                          <Button
                            variant="ghost"
                            size="sm"
                            class="py-1 px-2.5 text-[11px] h-7 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            >Deny</Button
                          >
                        </div>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </Card>

          <!-- Attendance Chart Mock -->
          <Card
            title="Weekly Attendance Trends"
            description="Analysis of average workplace attendance rates by day."
            class="bg-neutral-card border border-neutral-border"
          >
            <div class="h-64 flex flex-col justify-end mt-4 gap-4">
              <!-- Daily Bars -->
              <div class="flex items-end justify-between flex-1 gap-2.5 px-4">
                {#each [{ day: 'Mon', percentage: 80, height: 'h-[80%]' }, { day: 'Tue', percentage: 85, height: 'h-[85%]' }, { day: 'Wed', percentage: 70, height: 'h-[70%]' }, { day: 'Thu', percentage: 90, height: 'h-[90%]' }, { day: 'Fri', percentage: 94, height: 'h-[94%]' }] as item (item.day)}
                  <div class="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <!-- Bar tooltip -->
                    <span
                      class="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm mb-1"
                      >{item.percentage}%</span
                    >
                    <div
                      class="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden h-full flex items-end"
                    >
                      <div
                        class="w-full bg-emerald-500 rounded-t-lg transition-all duration-500 {item.height}"
                      ></div>
                    </div>
                    <span class="text-xs text-slate-500 font-medium">{item.day}</span>
                  </div>
                {/each}
              </div>
            </div>
          </Card>
        </div>

        <!-- Right Area (Upcoming events / quick summaries) -->
        <div class="space-y-6">
          <Card
            title="Upcoming Events"
            description="HR and company event logs."
            class="bg-neutral-card border border-neutral-border"
          >
            <div class="mt-4 space-y-3.5">
              {#each [{ title: 'Quarterly Town Hall', time: 'Apr 25, 2:00 PM', desc: 'Company performance overview' }, { title: "Sarah's Birthday", time: 'Apr 27, All Day', desc: 'Send birthday card' }, { title: 'UI/UX Workshop', time: 'Apr 29, 10:00 AM', desc: 'Design systems sync' }, { title: 'Performance Reviews Due', time: 'Apr 30, 5:00 PM', desc: 'Manager feedback submissions' }] as event (event.title)}
                <div
                  class="flex items-start gap-3 p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl transition-all duration-150"
                >
                  <div
                    class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0"
                  >
                    <Icon icon="lucide:calendar" class="w-4 h-4" />
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-bold text-slate-800 dark:text-slate-200"
                      >{event.title}</span
                    >
                    <span
                      class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5"
                      >{event.time}</span
                    >
                    <span class="text-[10px] text-slate-400 truncate mt-0.5">{event.desc}</span>
                  </div>
                </div>
              {/each}
            </div>
          </Card>

          <Card
            title="Activity Feed"
            description="Recent operations logs."
            class="bg-neutral-card border border-neutral-border"
          >
            <div class="mt-4 space-y-4 relative pl-4 border-l border-neutral-border">
              {#each [{ user: 'Admin', act: 'updated salary structures.', time: '2 mins ago' }, { user: 'Sarah L.', act: 'submitted leave request.', time: '1 hour ago' }, { user: 'System', act: 'generated payroll draft for April.', time: '3 hours ago' }] as act (act.user + act.time)}
                <div class="relative">
                  <!-- Dot timeline indicator -->
                  <span
                    class="absolute left-[-20px] top-1.5 w-2 h-2 rounded-full bg-emerald-500 border border-neutral-card"
                  ></span>
                  <div class="flex flex-col">
                    <span class="text-xs text-slate-700 dark:text-slate-200">
                      <strong class="font-bold text-slate-900 dark:text-slate-100"
                        >{act.user}</strong
                      >
                      {act.act}
                    </span>
                    <span class="text-[10px] text-slate-400 mt-0.5">{act.time}</span>
                  </div>
                </div>
              {/each}
            </div>
          </Card>
        </div>
      </div>
    </main>
  </div>
</div>

<style>
  /* Global custom scrollbar for all scrollable elements in this page */
  :global(*::-webkit-scrollbar) {
    width: 4px;
    height: 4px;
  }

  :global(*::-webkit-scrollbar-track) {
    background: transparent;
  }

  :global(*::-webkit-scrollbar-thumb) {
    background: var(--color-neutral-border, #e2e8f0);
    border-radius: 9999px;
    transition: background-color 0.2s ease;
  }

  :global(*::-webkit-scrollbar-thumb:hover) {
    background: var(--color-slate-300, #cbd5e1);
  }

  /* Dark mode overrides for scrollbar thumb */
  :global(.dark *::-webkit-scrollbar-thumb) {
    background: var(--color-neutral-border, #334155);
  }

  :global(.dark *::-webkit-scrollbar-thumb:hover) {
    background: var(--color-slate-600, #475569);
  }

  /* Firefox scrollbar support */
  :global(*) {
    scrollbar-width: thin;
    scrollbar-color: var(--color-neutral-border, #e2e8f0) transparent;
  }
</style>
