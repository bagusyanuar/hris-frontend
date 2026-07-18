<script lang="ts">
	import type { DepartmentModel } from '$lib/core/department';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Avatar } from '$lib/presentation/shared/components/avatar';
	import Icon from '@iconify/svelte';

	interface Props {
		departments: DepartmentModel[];
		onSelectDepartment: (department: DepartmentModel) => void;
	}

	let { departments, onSelectDepartment }: Props = $props();
</script>

<div class="overflow-x-auto p-4 sm:p-8 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[500px]">
	{#if departments.length === 0}
		<div class="flex flex-col items-center justify-center h-full text-slate-500 py-12">
			<Icon icon="lucide:network" class="w-12 h-12 mb-4 text-slate-300" />
			<Typography variant="body-md">No departments to display in Org Chart.</Typography>
		</div>
	{:else}
		<div class="flex flex-col gap-6 w-max min-w-full">
			{#each departments as dept (dept.id)}
				{@render orgNode(dept)}
			{/each}
		</div>
	{/if}
</div>

{#snippet orgNode(dept: DepartmentModel, depth = 0)}
	<div class="flex flex-col relative {depth > 0 ? 'ml-12' : ''}">
		<!-- Connecting line for children -->
		{#if depth > 0}
			<div class="absolute -left-6 top-6 w-6 h-px bg-slate-300 dark:bg-slate-700"></div>
			<div class="absolute -left-6 -top-6 h-12 w-px bg-slate-300 dark:bg-slate-700"></div>
		{/if}

		<!-- Node Card -->
		<button
			onclick={() => onSelectDepartment(dept)}
			class="group relative flex flex-col w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs p-4 text-left transition-all hover:border-brand-primary/50 hover:shadow-md hover:-translate-y-0.5 z-10"
		>
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-mono font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
					{dept.code}
				</span>
				<div class={`w-2 h-2 rounded-full ${dept.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
			</div>
			
			<Typography variant="h6" weight="medium" class="mb-1 text-slate-900 dark:text-slate-100 line-clamp-1">
				{dept.name}
			</Typography>
			
			<div class="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
				<div class="flex items-center gap-2">
					<Avatar name={dept.managerName} size="xs" variant="primary" />
					<span class="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[80px]">
						{dept.managerName || 'No Mgr'}
					</span>
				</div>
				<div class="flex items-center gap-1 text-slate-500 text-xs" title="Employees">
					<Icon icon="lucide:users" class="w-3.5 h-3.5" />
					{dept.employeeCount || 0}
				</div>
			</div>
		</button>

		<!-- Children -->
		{#if dept.children && dept.children.length > 0}
			<div class="flex flex-col gap-4 mt-4 relative">
				{#each dept.children as child, i (child.id)}
					<!-- Vertical line connecting siblings -->
					{#if i !== dept.children.length - 1}
						<div class="absolute left-6 top-0 bottom-0 w-px bg-slate-300 dark:bg-slate-700"></div>
					{/if}
					{@render orgNode(child, depth + 1)}
				{/each}
			</div>
		{/if}
	</div>
{/snippet}
