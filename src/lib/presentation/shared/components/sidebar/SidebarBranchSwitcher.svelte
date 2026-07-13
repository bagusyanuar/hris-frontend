<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { SidebarContext } from './Sidebar.svelte';

	interface Branch {
		id: string;
		name: string;
		short: string;
		color: string;
	}

	interface Props {
		branches: Branch[];
		activeBranch: Branch;
	}

	let {
		branches,
		activeBranch = $bindable()
	}: Props = $props();

	const sidebar = getContext<SidebarContext>('sidebar');

	let isDropdownOpen = $state(false);
	let elementRef = $state<HTMLElement | null>(null);

	function handleWindowClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isDropdownOpen && elementRef && !elementRef.contains(target)) {
			isDropdownOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div class="mt-4 relative" bind:this={elementRef}>
	<button
		onclick={() => (isDropdownOpen = !isDropdownOpen)}
		class="w-full flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900/60 border border-neutral-border hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all duration-150 text-left cursor-pointer
			{sidebar.isCollapsed ? 'justify-center p-0 h-10 w-10 mx-auto bg-transparent border-none hover:bg-slate-50 dark:hover:bg-slate-900' : ''}"
	>
		<div
			class="w-8 h-8 rounded-lg {activeBranch.color} flex items-center justify-center font-bold text-xs shrink-0"
		>
			{activeBranch.short}
		</div>
		{#if !sidebar.isCollapsed}
			<div class="flex-1 min-w-0">
				<div class="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
					{activeBranch.name}
				</div>
				<div class="text-[9px] text-slate-500 truncate mt-0.5">HRIS Portal</div>
			</div>
			<Icon icon="lucide:chevrons-up-down" class="w-3.5 h-3.5 text-slate-400 shrink-0" />
		{/if}
	</button>

	<!-- Branch Dropdown -->
	{#if isDropdownOpen}
		<div
			transition:fly={{ x: 12, duration: 200 }}
			class="absolute top-0 left-full ml-3 min-w-[220px] w-max bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1"
		>
			<div class="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
				Select Branch
			</div>
			{#each branches as branch (branch.id)}
				<button
					onclick={() => {
						activeBranch = branch;
						isDropdownOpen = false;
					}}
					class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs cursor-pointer
						{activeBranch.id === branch.id
							? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
							: 'text-slate-600 dark:text-slate-300'}"
				>
					<div class="flex items-center gap-2.5 whitespace-nowrap">
						<div class="w-6 h-6 rounded-md {branch.color} flex items-center justify-center font-bold text-[10px] shrink-0">
							{branch.short}
						</div>
						<span>{branch.name}</span>
					</div>
					{#if activeBranch.id === branch.id}
						<Icon icon="lucide:check" class="w-3.5 h-3.5 text-brand-text dark:text-emerald-400 shrink-0 ml-4" />
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>
