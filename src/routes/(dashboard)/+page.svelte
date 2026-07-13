<script lang="ts">
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Card } from '$lib/presentation/shared/components/card';
	import { Button } from '$lib/presentation/shared/components/button';
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
</script>

<svelte:head>
	<title>Dashboard | HRIS</title>
</svelte:head>

<!-- Welcome Header -->
<div class="flex flex-col gap-1">
	<Typography variant="h4" weight="bold" class="text-slate-900 dark:text-slate-50">
		Dashboard Overview
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
				<a href={resolve('/employees' as Pathname)} class="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all cursor-pointer">
					<Icon icon="lucide:users" class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500" />
					<span class="text-[10px] font-semibold text-center">Staff Directory</span>
				</a>
				<button class="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-all cursor-pointer">
					<Icon icon="lucide:calendar" class="w-5 h-5 mb-1.5 text-slate-400 group-hover:text-emerald-500" />
					<span class="text-[10px] font-semibold text-center">Log Time</span>
				</button>
			</div>
		</Card>
	</div>
</div>
