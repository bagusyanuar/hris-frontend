<script lang="ts">
	import { getContext } from 'svelte';
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import type { SidebarContext } from './Sidebar.svelte';

	interface User {
		name: string;
		role: string;
		initials?: string;
	}

	interface Props {
		user: User;
		onProfileClick?: () => void;
		onLogoutClick?: () => void;
	}

	let {
		user,
		onProfileClick,
		onLogoutClick
	}: Props = $props();

	const sidebar = getContext<SidebarContext>('sidebar');

	let isDropdownOpen = $state(false);
	let elementRef = $state<HTMLElement | null>(null);

	const userInitials = $derived(user.initials || user.name.charAt(0).toUpperCase());

	function handleWindowClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isDropdownOpen && elementRef && !elementRef.contains(target)) {
			isDropdownOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

<div class="mt-auto pt-4 border-t border-neutral-border">
	<div class="relative" bind:this={elementRef}>
		<button
			onclick={() => (isDropdownOpen = !isDropdownOpen)}
			class="w-full flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all duration-150 text-left cursor-pointer
				{sidebar.isCollapsed ? 'justify-center hover:bg-transparent p-0' : ''}"
		>
			<div
				class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 font-bold shrink-0 relative"
			>
				<span>{userInitials}</span>
				<!-- Active Indicator Dot -->
				<span
					class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-card"
				></span>
			</div>
			{#if !sidebar.isCollapsed}
				<div class="flex-1 min-w-0">
					<div
						class="text-xs font-bold text-slate-900 dark:text-slate-100 leading-normal truncate"
					>
						{user.name}
					</div>
					<div class="text-[10px] text-slate-400 leading-none truncate mt-0.5">{user.role}</div>
				</div>
				<Icon icon="lucide:chevrons-up-down" class="w-4 h-4 text-slate-400 shrink-0" />
			{/if}
		</button>

		<!-- Profile Dropdown (mockup) -->
		{#if isDropdownOpen}
			<div
				transition:fly={{ x: sidebar.isCollapsed ? 12 : -12, duration: 200 }}
				class="absolute bottom-0 left-full ml-3 w-48 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-1.5 flex flex-col gap-1"
			>
				<button
					onclick={() => {
						onProfileClick?.();
						isDropdownOpen = false;
					}}
					class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
				>
					<Icon icon="lucide:user" class="w-4 h-4" />
					<span>My Profile</span>
				</button>
				<button
					onclick={() => {
						onLogoutClick?.();
						isDropdownOpen = false;
					}}
					class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 text-left text-xs text-rose-600 dark:text-rose-400 cursor-pointer"
				>
					<Icon icon="lucide:log-out" class="w-4 h-4" />
					<span>Log Out</span>
				</button>
			</div>
		{/if}
	</div>

	<!-- System Versioning -->
	{#if !sidebar.isCollapsed}
		<div class="border-t border-neutral-border my-3 mx-2"></div>
		<div
			class="px-2 flex flex-col text-[10px] text-slate-400 dark:text-slate-600 select-none leading-normal"
		>
			<span class="font-bold">TalentFlow v1.0.0-Beta</span>
			<span class="text-[9px]">HRIS Hub. Clean & Solid Portal.</span>
		</div>
	{/if}
</div>
