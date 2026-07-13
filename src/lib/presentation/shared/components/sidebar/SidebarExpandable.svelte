<script lang="ts">
	import { getContext } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { SidebarContext } from './Sidebar.svelte';

	interface Props {
		label: string;
		icon: string;
		isActive?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		label,
		icon,
		isActive = false,
		children
	}: Props = $props();

	const sidebar = getContext<SidebarContext>('sidebar');

	let isExpanded = $state(false);
	let isFlyoutOpen = $state(false);
	let containerRef = $state<HTMLElement | null>(null);

	function handleClick() {
		if (sidebar.isCollapsed) {
			isFlyoutOpen = !isFlyoutOpen;
		} else {
			isExpanded = !isExpanded;
		}
	}

	function handleWindowClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isFlyoutOpen && containerRef && !containerRef.contains(target)) {
			isFlyoutOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div class="w-full flex flex-col relative" bind:this={containerRef}>
	<button
		onclick={handleClick}
		class="w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer
			{sidebar.isCollapsed ? 'justify-center p-2.5' : 'justify-between p-2.5'}
			{isActive
			? 'bg-brand-light/50 dark:bg-emerald-500/5 text-brand-text dark:text-emerald-400 font-medium'
			: 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'}"
		title={sidebar.isCollapsed ? label : ''}
	>
		<div class="flex items-center {sidebar.isCollapsed ? '' : 'gap-3'}">
			<Icon
				{icon}
				class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105"
			/>
			{#if !sidebar.isCollapsed}
				<span class="text-xs">{label}</span>
			{/if}
		</div>
		{#if !sidebar.isCollapsed}
			<Icon
				icon="lucide:chevron-down"
				class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 {isExpanded ? 'rotate-180' : ''}"
			/>
		{/if}
	</button>

	<!-- Accordion Submenu (Desktop expanded / Mobile) -->
	{#if !sidebar.isCollapsed && isExpanded}
		<div
			transition:slide={{ duration: 200 }}
			class="pl-2.5 pr-2 py-0.5 space-y-1 mt-1 border-l border-slate-100 dark:border-slate-800 ml-[20px]"
		>
			{@render children?.()}
		</div>
	{/if}

	<!-- Floating Flyout Submenu (Collapsed mode) -->
	{#if sidebar.isCollapsed && isFlyoutOpen}
		<div
			transition:fly={{ x: 12, duration: 200 }}
			class="absolute top-0 left-full ml-3 min-w-[180px] bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1"
		>
			<div class="px-2 py-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
				{label}
			</div>
			<!-- Render sub-items. We wrap them so they click and close the flyout -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div onclick={() => (isFlyoutOpen = false)} class="flex flex-col gap-1">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>
