<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Sidebar from './Sidebar.svelte';
  import SidebarBrand from './SidebarBrand.svelte';
  import SidebarBranchSwitcher from './SidebarBranchSwitcher.svelte';
  import SidebarNav from './SidebarNav.svelte';
  import SidebarGroup from './SidebarGroup.svelte';
  import SidebarItem from './SidebarItem.svelte';
  import SidebarExpandable from './SidebarExpandable.svelte';
  import SidebarProfile from './SidebarProfile.svelte';

  const { Story } = defineMeta({
    title: 'Sidebar',
    component: Sidebar,
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  let isCollapsed = $state(false);
  let activeMenu = $state('Dashboard');

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
</script>

<Story name="Default">
  <div class="h-[600px] flex bg-slate-100 dark:bg-slate-950 p-4 gap-4">
    <Sidebar bind:isCollapsed>
      <SidebarBrand />
      <SidebarBranchSwitcher {branches} bind:activeBranch />

      <SidebarNav>
        <SidebarGroup title="Employees">
          <SidebarItem
            label="Dashboard"
            icon="lucide:grid"
            isActive={activeMenu === 'Dashboard'}
            onclick={() => (activeMenu = 'Dashboard')}
          />
          <SidebarItem
            label="Staff Directory"
            icon="lucide:users"
            isActive={activeMenu === 'Staff Directory'}
            onclick={() => (activeMenu = 'Staff Directory')}
          />
          <SidebarItem
            label="Time & Attendance"
            icon="lucide:clock"
            isActive={activeMenu === 'Time & Attendance'}
            onclick={() => (activeMenu = 'Time & Attendance')}
          />
        </SidebarGroup>

        <SidebarGroup title="Finance">
          <SidebarExpandable
            label="Payroll"
            icon="lucide:banknote"
            isActive={activeMenu === 'Run Payroll' || activeMenu === 'Payslips'}
          >
            <SidebarItem
              label="Run Payroll"
              isSubItem
              isActive={activeMenu === 'Run Payroll'}
              onclick={() => (activeMenu = 'Run Payroll')}
            />
            <SidebarItem
              label="Payslips"
              isSubItem
              isActive={activeMenu === 'Payslips'}
              onclick={() => (activeMenu = 'Payslips')}
            />
          </SidebarExpandable>

          <SidebarItem
            label="Expenses"
            icon="lucide:wallet"
            isActive={activeMenu === 'Expenses'}
            onclick={() => (activeMenu = 'Expenses')}
          />
        </SidebarGroup>
      </SidebarNav>

      <SidebarProfile
        user={currentUser}
        onProfileClick={() => alert('Profile Clicked')}
        onLogoutClick={() => alert('Logout Clicked')}
      />
    </Sidebar>

    <div
      class="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6"
    >
      <button
        onclick={() => (isCollapsed = !isCollapsed)}
        class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm cursor-pointer"
      >
        Toggle Collapse (Current: {isCollapsed})
      </button>
      <p class="mt-4 text-sm text-slate-500">
        Active Menu: <strong class="text-slate-900 dark:text-slate-100">{activeMenu}</strong>
      </p>
    </div>
  </div>
</Story>
