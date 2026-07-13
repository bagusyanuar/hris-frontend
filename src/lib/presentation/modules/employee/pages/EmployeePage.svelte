<script lang="ts">
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Card } from '$lib/presentation/shared/components/card';
	import { Button } from '$lib/presentation/shared/components/button';
	import Icon from '@iconify/svelte';

	// Dummy data for employee list
	const initialEmployees = [
		{ id: 'EMP001', name: 'Bagus Yanuar', role: 'Head of Technology', dept: 'Engineering', date: '12 Jan 2021', status: 'Active', email: 'bagus@hris.corp', initials: 'BY', color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' },
		{ id: 'EMP002', name: 'Sarah Lestari', role: 'HR Manager', dept: 'Human Resources', date: '04 Mar 2022', status: 'Active', email: 'sarah.l@hris.corp', initials: 'SL', color: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' },
		{ id: 'EMP003', name: 'Mark Pratama', role: 'Lead Developer', dept: 'Engineering', date: '18 Jun 2020', status: 'On Leave', email: 'mark.p@hris.corp', initials: 'MP', color: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' },
		{ id: 'EMP004', name: 'Jessica Wong', role: 'Senior UX Designer', dept: 'Product Design', date: '15 Sep 2023', status: 'Active', email: 'jessica.w@hris.corp', initials: 'JW', color: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' },
		{ id: 'EMP005', name: 'Reza Fahlevi', role: 'Finance Officer', dept: 'Finance', date: '01 Nov 2022', status: 'Inactive', email: 'reza.f@hris.corp', initials: 'RF', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
		{ id: 'EMP006', name: 'Diana Putri', role: 'System Administrator', dept: 'Engineering', date: '10 Feb 2023', status: 'Active', email: 'diana.p@hris.corp', initials: 'DP', color: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300' },
		{ id: 'EMP007', name: 'Ahmad Shodiq', role: 'QA Engineer', dept: 'Engineering', date: '25 May 2024', status: 'On Leave', email: 'ahmad.s@hris.corp', initials: 'AS', color: 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300' }
	];

	// Reactive states
	let employees = $state(initialEmployees);
	let searchQuery = $state('');
	let selectedDept = $state('All');
	let activeTab = $state('All');
	
	// Filtering logic
	const filteredEmployees = $derived(
		employees.filter((emp) => {
			const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
								  emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
								  emp.id.toLowerCase().includes(searchQuery.toLowerCase());
			
			const matchesDept = selectedDept === 'All' || emp.dept === selectedDept;
			
			const matchesTab = activeTab === 'All' || emp.status === activeTab;
			
			return matchesSearch && matchesDept && matchesTab;
		})
	);

	// Stats derived from all employees
	const totalEmployees = $derived(employees.length);
	const activeCount = $derived(employees.filter(e => e.status === 'Active').length);
	const leaveCount = $derived(employees.filter(e => e.status === 'On Leave').length);
	const inactiveCount = $derived(employees.filter(e => e.status === 'Inactive').length);

	const departments = ['All', 'Engineering', 'Human Resources', 'Product Design', 'Finance'];

	// Actions
	function handleDelete(id: string) {
		if (confirm(`Are you sure you want to delete employee ${id}?`)) {
			employees = employees.filter(emp => emp.id !== id);
		}
	}
</script>

<div class="space-y-6">
	<!-- Page Header -->
	<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div class="flex flex-col gap-1">
			<Typography variant="h4" weight="bold">Staff Directory</Typography>
			<Typography variant="body-sm" color="secondary">
				Manage employees details, track statuses, and search profiles.
			</Typography>
		</div>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm">
				<Icon icon="lucide:download" class="w-4 h-4 mr-1.5" />
				Export CSV
			</Button>
			<Button variant="primary" size="sm" onclick={() => alert('Add Employee Dialog (Dummy)')}>
				<Icon icon="lucide:user-plus" class="w-4 h-4 mr-1.5" />
				Add Employee
			</Button>
		</div>
	</div>

	<!-- Filter Cards / Overview -->
	<div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
		<button onclick={() => activeTab = 'All'} class="text-left w-full">
			<Card hoverable={true} class="p-4 border border-neutral-border bg-neutral-card transition-all {activeTab === 'All' ? 'ring-2 ring-brand-primary/50' : ''}">
				<Typography variant="caption" color="secondary">All Staffs</Typography>
				<Typography variant="h5" weight="bold" class="mt-1">{totalEmployees}</Typography>
			</Card>
		</button>
		<button onclick={() => activeTab = 'Active'} class="text-left w-full">
			<Card hoverable={true} class="p-4 border border-neutral-border bg-neutral-card transition-all {activeTab === 'Active' ? 'ring-2 ring-emerald-500/50' : ''}">
				<Typography variant="caption" color="success">Active</Typography>
				<Typography variant="h5" weight="bold" class="mt-1 text-emerald-600 dark:text-emerald-500">{activeCount}</Typography>
			</Card>
		</button>
		<button onclick={() => activeTab = 'On Leave'} class="text-left w-full">
			<Card hoverable={true} class="p-4 border border-neutral-border bg-neutral-card transition-all {activeTab === 'On Leave' ? 'ring-2 ring-amber-500/50' : ''}">
				<Typography variant="caption" color="warning">On Leave</Typography>
				<Typography variant="h5" weight="bold" class="mt-1 text-amber-600 dark:text-amber-500">{leaveCount}</Typography>
			</Card>
		</button>
		<button onclick={() => activeTab = 'Inactive'} class="text-left w-full">
			<Card hoverable={true} class="p-4 border border-neutral-border bg-neutral-card transition-all {activeTab === 'Inactive' ? 'ring-2 ring-slate-500/50' : ''}">
				<Typography variant="caption" color="secondary">Inactive</Typography>
				<Typography variant="h5" weight="bold" class="mt-1 text-slate-500">{inactiveCount}</Typography>
			</Card>
		</button>
	</div>

	<!-- Main Directory Card -->
	<Card class="bg-neutral-card border border-neutral-border p-6">
		<!-- Search and Filter Bar -->
		<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-border mb-5">
			<!-- Tab Switcher -->
			<div class="flex border-b border-slate-200 dark:border-slate-800">
				{#each ['All', 'Active', 'On Leave', 'Inactive'] as tab (tab)}
					<button
						onclick={() => activeTab = tab}
						class="px-4 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer {activeTab === tab ? 'border-brand-primary text-brand-text dark:text-brand-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}"
					>
						{tab}
					</button>
				{/each}
			</div>

			<!-- Filters -->
			<div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
				<!-- Search box -->
				<div class="relative w-full sm:w-64">
					<Icon icon="lucide:search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
					<input
						type="text"
						placeholder="Search by name, ID, or email..."
						bind:value={searchQuery}
						class="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-neutral-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-primary/50 text-slate-900 dark:text-slate-100"
					/>
				</div>

				<!-- Department select -->
				<select
					bind:value={selectedDept}
					class="w-full sm:w-44 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-neutral-border rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-primary/50 text-slate-900 dark:text-slate-100 cursor-pointer"
				>
					{#each departments as dept (dept)}
						<option value={dept}>{dept} Department</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Table -->
		<div class="overflow-x-auto">
			<table class="w-full text-left text-xs min-w-[650px]">
				<thead>
					<tr class="text-slate-400 font-semibold border-b border-neutral-border pb-3">
						<th class="py-3 px-4 font-bold">Employee</th>
						<th class="py-3 px-4 font-bold">Employee ID</th>
						<th class="py-3 px-4 font-bold">Department</th>
						<th class="py-3 px-4 font-bold">Join Date</th>
						<th class="py-3 px-4 font-bold">Status</th>
						<th class="py-3 px-4 font-bold text-right">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-neutral-border">
					{#if filteredEmployees.length === 0}
						<tr>
							<td colspan="6" class="py-8 text-center text-slate-400">
								No employees found matching the filters.
							</td>
						</tr>
					{:else}
						{#each filteredEmployees as emp (emp.id)}
							<tr class="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
								<td class="py-3.5 px-4 flex items-center gap-3">
									<div class="w-9 h-9 rounded-full font-semibold flex items-center justify-center {emp.color}">
										{emp.initials}
									</div>
									<div class="flex flex-col">
										<Typography variant="body-sm" weight="semibold" class="text-slate-800 dark:text-slate-200">
											{emp.name}
										</Typography>
										<Typography variant="caption" color="secondary">
											{emp.role} &bull; {emp.email}
										</Typography>
									</div>
								</td>
								<td class="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
									{emp.id}
								</td>
								<td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
									{emp.dept}
								</td>
								<td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
									{emp.date}
								</td>
								<td class="py-3.5 px-4">
									{#if emp.status === 'Active'}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30">
											<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
											Active
										</span>
									{:else if emp.status === 'On Leave'}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30">
											<span class="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
											On Leave
										</span>
									{:else}
										<span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
											<span class="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
											Inactive
										</span>
									{/if}
								</td>
								<td class="py-3.5 px-4 text-right">
									<div class="inline-flex items-center gap-1.5">
										<button
											onclick={() => alert(`View details of ${emp.name}`)}
											class="p-1.5 rounded-lg border border-neutral-border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
											title="View Profile"
										>
											<Icon icon="lucide:eye" class="w-4 h-4" />
										</button>
										<button
											onclick={() => alert(`Edit profile of ${emp.name}`)}
											class="p-1.5 rounded-lg border border-neutral-border text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
											title="Edit"
										>
											<Icon icon="lucide:pencil" class="w-4 h-4" />
										</button>
										<button
											onclick={() => handleDelete(emp.id)}
											class="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/50 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
											title="Delete"
										>
											<Icon icon="lucide:trash" class="w-4 h-4" />
										</button>
									</div>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<!-- Footer Pagination -->
		<div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-border pt-5">
			<Typography variant="caption" color="secondary">
				Showing {filteredEmployees.length} of {totalEmployees} employees
			</Typography>
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" class="h-8 py-0 px-2" disabled={true}>
					<Icon icon="lucide:chevron-left" class="w-4 h-4" />
				</Button>
				<button class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold bg-brand-light text-brand-text dark:bg-emerald-500/10 dark:text-emerald-400">
					1
				</button>
				<Button variant="outline" size="sm" class="h-8 py-0 px-2" disabled={true}>
					<Icon icon="lucide:chevron-right" class="w-4 h-4" />
				</Button>
			</div>
		</div>
	</Card>
</div>
