<script lang="ts">
  import { onMount } from 'svelte';
  import { DashboardSidebar } from '$lib/presentation/shared/components/sidebar';
  import Navbar from '$lib/presentation/shared/components/navbar/Navbar.svelte';
  import NavbarMobileToggle from '$lib/presentation/shared/components/navbar/NavbarMobileToggle.svelte';
  import NavbarSidebarToggle from '$lib/presentation/shared/components/navbar/NavbarSidebarToggle.svelte';
  import NavbarBreadcrumbs from '$lib/presentation/shared/components/navbar/NavbarBreadcrumbs.svelte';
  import NavbarSearch from '$lib/presentation/shared/components/navbar/NavbarSearch.svelte';
  import NavbarThemeToggle from '$lib/presentation/shared/components/navbar/NavbarThemeToggle.svelte';
  import NavbarNotifications from '$lib/presentation/shared/components/navbar/NavbarNotifications.svelte';
  import { page } from '$app/state';

  let { children } = $props();

  let isCollapsed = $state(false);
  let isMobileOpen = $state(false);
  let searchQuery = $state('');
  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
  });

  const branches = [
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
  let activeBranch = $state(branches[0]);

  const currentUser = {
    name: 'administrator',
    role: 'ADMINISTRATOR',
    initials: 'A'
  };

  let activeMenu = $derived.by(() => {
    if (page.url.pathname === '/employees') {
      return 'Staff Directory';
    } else if (page.url.pathname === '/master-data/departments') {
      return 'Departments';
    } else {
      return 'Dashboard';
    }
  });
</script>

<div
  class="h-screen flex bg-slate-100 dark:bg-slate-950 p-3 gap-3 overflow-hidden text-slate-900 transition-colors duration-200"
>
  <!-- REUSABLE SIDEBAR -->
  <DashboardSidebar
    bind:isCollapsed
    {branches}
    bind:activeBranch
    user={currentUser}
    onProfileClick={() => alert('Profile Clicked')}
    onLogoutClick={() => alert('Logout Clicked')}
  />

  <!-- CONTENT AREA (Navbar + Main Page Body) -->
  <div class="flex-1 flex flex-col gap-3 min-w-0">
    <!-- REUSABLE NAVBAR -->
    <Navbar>
      <!-- Left actions + Search Bar -->
      <div class="flex items-center gap-3">
        <NavbarMobileToggle bind:isOpen={isMobileOpen} />
        <NavbarSidebarToggle bind:isCollapsed />
        <NavbarBreadcrumbs {activeMenu} />
        <NavbarSearch bind:searchQuery />
      </div>

      <!-- Right actions -->
      <div class="flex items-center gap-3">
        <NavbarThemeToggle bind:isDark />
        <NavbarNotifications hasUnread={true} />
      </div>
    </Navbar>

    <!-- MAIN PAGE BODY -->
    <main class="flex-1 overflow-y-auto scrollable-content transition-colors">
      {@render children()}
    </main>
  </div>
</div>
