<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Navbar from './Navbar.svelte';
  import NavbarMobileToggle from './NavbarMobileToggle.svelte';
  import NavbarSidebarToggle from './NavbarSidebarToggle.svelte';
  import NavbarBreadcrumbs from './NavbarBreadcrumbs.svelte';
  import NavbarSearch from './NavbarSearch.svelte';
  import NavbarThemeToggle from './NavbarThemeToggle.svelte';
  import NavbarNotifications from './NavbarNotifications.svelte';

  const { Story } = defineMeta({
    title: 'Navbar',
    component: Navbar,
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  let isMobileOpen = $state(false);
  let isCollapsed = $state(false);
  let activeMenu = $state('Dashboard');
  let searchQuery = $state('');
  let isDark = $state(false);
</script>

<Story name="Default">
  <div class="p-6 bg-slate-100 dark:bg-slate-950 min-h-[300px]">
    <Navbar>
      <!-- Left side -->
      <div class="flex items-center gap-3">
        <NavbarMobileToggle bind:isOpen={isMobileOpen} />
        <NavbarSidebarToggle bind:isCollapsed />
        <NavbarBreadcrumbs {activeMenu} />
      </div>

      <!-- Center/Search -->
      <NavbarSearch bind:searchQuery />

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <NavbarThemeToggle bind:isDark />
        <NavbarNotifications hasUnread={true} />
      </div>
    </Navbar>

    <div
      class="mt-6 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-300"
    >
      <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100 mb-2">Interactive States:</h4>
      <p>Mobile Menu Open: <strong>{isMobileOpen}</strong></p>
      <p>Sidebar Collapsed: <strong>{isCollapsed}</strong></p>
      <p>Active Page: <strong>{activeMenu}</strong></p>
      <p>Search Query: <strong>{searchQuery || '(empty)'}</strong></p>
      <p>Dark Theme: <strong>{isDark}</strong></p>
    </div>
  </div>
</Story>
