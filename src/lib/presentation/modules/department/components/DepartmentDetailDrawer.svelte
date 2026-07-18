<script lang="ts">
	import { Drawer } from '$lib/presentation/shared/components/drawer';
	import { Avatar } from '$lib/presentation/shared/components/avatar';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import Icon from '@iconify/svelte';
	import type { DepartmentModel } from '$lib/core/department';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		department: DepartmentModel | null;
	}

	let { isOpen, onClose, department }: Props = $props();
</script>

<Drawer {isOpen} {onClose} position="right" title="Department Details">
	{#if department}
		<div class="flex flex-col gap-6">
			<!-- Header Card -->
			<div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
				<div class="flex items-start justify-between">
					<div>
						<Typography variant="h4" weight="semibold" class="mb-1">{department.name}</Typography>
						<div class="flex items-center gap-2 text-slate-500 text-sm">
							<Icon icon="lucide:hash" class="w-4 h-4" />
							{department.code}
						</div>
					</div>
					<div
						class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
							department.status === 'active'
								? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
								: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
						}`}
					>
						{department.status === 'active' ? 'Active' : 'Inactive'}
					</div>
				</div>
				<p class="mt-4 text-sm text-slate-600 dark:text-slate-400">
					{department.description || 'No description provided.'}
				</p>
			</div>

			<!-- Manager Info -->
			<div>
				<Typography variant="h6" weight="medium" class="mb-3">Department Head</Typography>
				<div class="flex items-center gap-4">
					<Avatar name={department.managerName} size="lg" variant="primary" />
					<div>
						<Typography variant="body-sm" weight="medium">{department.managerName || 'Not Assigned'}</Typography>
						<Typography variant="caption" class="text-slate-500">Manager</Typography>
					</div>
				</div>
			</div>

			<!-- Stats -->
			<div>
				<Typography variant="h6" weight="medium" class="mb-3">Overview</Typography>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
						<Icon icon="lucide:users" class="w-5 h-5 text-brand-primary mb-2" />
						<Typography variant="h4" weight="bold">{department.employeeCount || 0}</Typography>
						<Typography variant="caption" class="text-slate-500">Total Employees</Typography>
					</div>
					<div class="rounded-xl border border-slate-200 dark:border-slate-800 p-4">
						<Icon icon="lucide:network" class="w-5 h-5 text-indigo-500 mb-2" />
						<Typography variant="h4" weight="bold">{department.children?.length || 0}</Typography>
						<Typography variant="caption" class="text-slate-500">Sub-departments</Typography>
					</div>
				</div>
			</div>
		</div>
	{/if}
</Drawer>
