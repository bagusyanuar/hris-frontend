<script lang="ts">
	import Sidebar from '$lib/presentation/shared/components/sidebar/Sidebar.svelte';
	import SidebarBrand from '$lib/presentation/shared/components/sidebar/SidebarBrand.svelte';
	import SidebarBranchSwitcher from '$lib/presentation/shared/components/sidebar/SidebarBranchSwitcher.svelte';
	import SidebarNav from '$lib/presentation/shared/components/sidebar/SidebarNav.svelte';
	import SidebarGroup from '$lib/presentation/shared/components/sidebar/SidebarGroup.svelte';
	import SidebarItem from '$lib/presentation/shared/components/sidebar/SidebarItem.svelte';
	import SidebarExpandable from '$lib/presentation/shared/components/sidebar/SidebarExpandable.svelte';
	import SidebarProfile from '$lib/presentation/shared/components/sidebar/SidebarProfile.svelte';
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

	let activeMenu = $state('Dashboard');

	$effect(() => {
		if (page.url.pathname === '/employees') {
			activeMenu = 'Staff Directory';
		} else {
			activeMenu = 'Dashboard';
		}
	});
</script>

<div
	class="h-screen flex bg-slate-100 dark:bg-slate-950 p-3 gap-3 overflow-hidden text-slate-900 transition-colors duration-200"
>
	<!-- REUSABLE SIDEBAR -->
	<Sidebar bind:isCollapsed>
		<SidebarBrand />
		<SidebarBranchSwitcher {branches} bind:activeBranch />

		<SidebarNav>
			<SidebarGroup title="Employees">
				<SidebarItem label="Dashboard" icon="lucide:grid" href="/" />
				<SidebarItem label="Staff Directory" icon="lucide:users" href="/employees" />
				<SidebarItem label="Time & Attendance" icon="lucide:clock" href="#time" />
			</SidebarGroup>

			<SidebarGroup title="Finance">
				<SidebarExpandable
					label="Payroll"
					icon="lucide:banknote"
					isActive={page.url.pathname.includes('/payroll') ||
						page.url.hash.includes('payroll') ||
						page.url.hash.includes('payslips')}
				>
					<SidebarItem label="Run Payroll" isSubItem href="#run-payroll" />
					<SidebarItem label="Payslips" isSubItem href="#payslips" />
				</SidebarExpandable>

				<SidebarItem label="Expenses" icon="lucide:wallet" href="#expenses" />
			</SidebarGroup>
		</SidebarNav>

		<SidebarProfile
			user={currentUser}
			onProfileClick={() => alert('Profile Clicked')}
			onLogoutClick={() => alert('Logout Clicked')}
		/>
	</Sidebar>

	<!-- CONTENT AREA (Navbar + Main Page Body) -->
	<div class="flex-1 flex flex-col gap-3 min-w-0">
		<!-- REUSABLE NAVBAR -->
		<Navbar>
			<!-- Left actions + Search Bar -->
			<div class="flex items-center gap-3">
				<NavbarMobileToggle bind:isOpen={isMobileOpen} />
				<NavbarSidebarToggle bind:isCollapsed />
				<NavbarBreadcrumbs {activeMenu} />
				<NavbarSearch bind:searchQuery bind:activeMenu />
			</div>

			<!-- Right actions -->
			<div class="flex items-center gap-3">
				<NavbarThemeToggle bind:isDark />
				<NavbarNotifications hasUnread={true} />
			</div>
		</Navbar>

		<!-- MAIN PAGE BODY -->
		<main
			class="flex-1 overflow-y-auto border border-neutral-border rounded-xl p-6 md:p-8 space-y-6 scrollable-content bg-white dark:bg-slate-900 transition-colors"
		>
			{@render children()}
		</main>
	</div>
</div>
