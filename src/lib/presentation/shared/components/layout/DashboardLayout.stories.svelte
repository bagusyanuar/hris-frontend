<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
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
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Card } from '$lib/presentation/shared/components/card';
	import { Button } from '$lib/presentation/shared/components/button';
	import Icon from '@iconify/svelte';

	const { Story } = defineMeta({
		title: 'Layout/Dashboard Shell',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	let isCollapsed = $state(false);
	let isMobileOpen = $state(false);
	let activeMenu = $state('Dashboard');
	let searchQuery = $state('');
	let isDark = $state(false);

	const branches = [
		{ id: '1', name: 'Panorama Veteran', short: 'PV', color: 'bg-emerald-600 dark:bg-emerald-500 text-white' },
		{ id: '2', name: 'Panorama Pasar Kliwon', short: 'PK', color: 'bg-blue-600 dark:bg-blue-500 text-white' }
	];
	let activeBranch = $state(branches[0]);

	const currentUser = {
		name: 'administrator',
		role: 'ADMINISTRATOR',
		initials: 'A'
	};
</script>

<Story name="Default">
	<div class="h-[750px] flex bg-slate-100 dark:bg-slate-950 p-3 gap-3 overflow-hidden text-slate-900 transition-colors duration-200">
		<!-- REUSABLE SIDEBAR -->
		<Sidebar bind:isCollapsed>
			<SidebarBrand />
			<SidebarBranchSwitcher {branches} bind:activeBranch />

			<SidebarNav>
				<SidebarGroup title="Employees">
					<SidebarItem
						label="Dashboard"
						icon="lucide:grid"
						isActive={activeMenu === 'Dashboard'}
						href="/demo/dashboard"
						onclick={() => (activeMenu = 'Dashboard')}
					/>
					<SidebarItem
						label="Staff Directory"
						icon="lucide:users"
						isActive={activeMenu === 'Staff Directory'}
						href="#staff"
						onclick={() => (activeMenu = 'Staff Directory')}
					/>
					<SidebarItem
						label="Time & Attendance"
						icon="lucide:clock"
						isActive={activeMenu === 'Time & Attendance'}
						href="#time"
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
							href="#run-payroll"
							onclick={() => (activeMenu = 'Run Payroll')}
						/>
						<SidebarItem
							label="Payslips"
							isSubItem
							isActive={activeMenu === 'Payslips'}
							href="#payslips"
							onclick={() => (activeMenu = 'Payslips')}
						/>
					</SidebarExpandable>

					<SidebarItem
						label="Expenses"
						icon="lucide:wallet"
						isActive={activeMenu === 'Expenses'}
						href="#expenses"
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

		<!-- CONTENT AREA (Navbar + Main Page Body) -->
		<div class="flex-1 flex flex-col gap-3 min-w-0">
			<!-- REUSABLE NAVBAR -->
			<Navbar>
				<div class="flex items-center gap-3">
					<NavbarMobileToggle bind:isOpen={isMobileOpen} />
					<NavbarSidebarToggle bind:isCollapsed={isCollapsed} />
					<NavbarBreadcrumbs {activeMenu} />
				</div>

				<NavbarSearch bind:searchQuery />

				<div class="flex items-center gap-3">
					<NavbarThemeToggle bind:isDark />
					<NavbarNotifications hasUnread={true} />
				</div>
			</Navbar>

			<!-- MAIN PAGE BODY (Render mockup content) -->
			<main class="flex-1 overflow-y-auto bg-neutral-card border border-neutral-border rounded-xl p-6 md:p-8 space-y-6 scrollable-content bg-white dark:bg-slate-900 transition-colors">
				<!-- Welcome Header -->
				<div class="flex flex-col gap-1">
					<Typography variant="h4" weight="bold" class="text-slate-900 dark:text-slate-50">
						{activeMenu} Overview
					</Typography>
					<Typography variant="body-sm" color="secondary">
						Welcome back, Admin! Here is what's happening today in your workforce.
					</Typography>
				</div>

				<!-- Metrics Dashboard Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{#each [
						{ title: 'Total Employees', value: '185', icon: 'lucide:users', color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
						{ title: 'Present Today', value: '172 (93%)', icon: 'lucide:check-square', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
						{ title: 'On Leave', value: '8', icon: 'lucide:plane', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
						{ title: 'Upcoming Reviews', value: '4', icon: 'lucide:star', color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }
					] as stat (stat.title)}
						<Card hoverable={true} class="relative overflow-hidden border border-neutral-border bg-neutral-card p-4">
							<div class="flex items-center justify-between">
								<div class="flex flex-col gap-1">
									<Typography variant="caption" color="secondary">{stat.title}</Typography>
									<Typography variant="h5" weight="bold" class="text-slate-900 dark:text-slate-50">
										{stat.value}
									</Typography>
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
					<!-- Left Area (Leave request summary) -->
					<div class="lg:col-span-2 space-y-6">
						<Card title="Leave Requests" description="Review employee leave requests that require pending actions." class="bg-neutral-card border border-neutral-border p-5">
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
										{#each [
											{ name: 'Sarah L.', role: 'HR Manager', type: 'Annual Leave', duration: '3 days (Apr 20-22)' },
											{ name: 'Mark P.', role: 'Senior Developer', type: 'Sick Leave', duration: '1 day (Apr 18)' }
										] as leave (leave.name)}
											<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
												<td class="py-3 flex items-center gap-2.5">
													<div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center justify-center">
														{leave.name.charAt(0)}
													</div>
													<div class="flex flex-col">
														<span class="font-bold text-slate-800 dark:text-slate-200">{leave.name}</span>
														<span class="text-[10px] text-slate-400">{leave.role}</span>
													</div>
												</td>
												<td class="py-3 text-slate-600 dark:text-slate-300">{leave.type}</td>
												<td class="py-3 text-slate-600 dark:text-slate-300">{leave.duration}</td>
												<td class="py-3">
													<div class="flex items-center gap-1.5">
														<Button size="sm" variant="primary" class="h-7 px-2.5 text-[10px]">Approve</Button>
														<Button size="sm" variant="outline" class="h-7 px-2.5 text-[10px]">Reject</Button>
													</div>
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</div>
						</Card>
					</div>

					<!-- Right Area (Quick Actions & Recent Activity) -->
					<div class="space-y-6">
						<Card title="Quick Actions" class="bg-neutral-card border border-neutral-border p-5">
							<div class="grid grid-cols-2 gap-2.5 mt-4">
								<button class="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all cursor-pointer">
									<Icon icon="lucide:user-plus" class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500" />
									<span class="text-[10px] font-semibold">Add Employee</span>
								</button>
								<button class="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all cursor-pointer">
									<Icon icon="lucide:calendar" class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500" />
									<span class="text-[10px] font-semibold">Log Time</span>
								</button>
							</div>
						</Card>
					</div>
				</div>
			</main>
		</div>
	</div>
</Story>
