<script lang="ts">
	import { slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	interface SearchResult {
		name: string;
		type: string;
		route: string;
		icon: string;
	}

	interface Props {
		searchQuery: string;
		activeMenu: string;
		recentSearches?: string[];
		searchResults?: SearchResult[];
	}

	let {
		searchQuery = $bindable(''),
		activeMenu = $bindable(), // eslint-disable-line no-useless-assignment
		recentSearches = ['Sarah L. (Staff)', 'Payroll Draft (April)', 'Time & Attendance'],
		searchResults = [
			{ name: 'Sarah Lincoln (HR Manager)', type: 'Employee', route: 'Staff Directory', icon: 'lucide:user' },
			{ name: 'Payroll Run April 2026', type: 'Payroll', route: 'Payroll', icon: 'lucide:banknote' },
			{ name: 'Time Sheets approval', type: 'Attendance', route: 'Time & Attendance', icon: 'lucide:clock' },
			{ name: 'Integrations settings', type: 'Settings', route: 'Integrations', icon: 'lucide:puzzle' }
		]
	}: Props = $props();

	let isSearchFocused = $state(false);
	let inputRef = $state<HTMLInputElement | null>(null);
	let containerRef = $state<HTMLElement | null>(null);

	function handleKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			inputRef?.focus();
		}
	}

	function handleWindowClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isSearchFocused && containerRef && !containerRef.contains(target)) {
			isSearchFocused = false;
		}
	}

	let filteredResults = $derived.by(() => {
		if (!searchQuery.trim()) return [];
		const q = searchQuery.toLowerCase();
		return searchResults.filter(r => 
			r.name.toLowerCase().includes(q) || 
			r.type.toLowerCase().includes(q)
		);
	});
</script>

<svelte:window onkeydown={handleKeyDown} onclick={handleWindowClick} />

<!-- Search Bar (Desktop) -->
<div 
	bind:this={containerRef}
	class="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-neutral-border rounded-xl w-64 focus-within:w-80 focus-within:border-emerald-500/50 transition-all duration-300 ml-4 relative"
>
	<Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
	<input
		bind:this={inputRef}
		type="text"
		bind:value={searchQuery}
		onfocus={() => (isSearchFocused = true)}
		placeholder="Search anything..."
		class="bg-transparent border-none focus:ring-0 focus:border-transparent outline-none focus:outline-none text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
	/>
	<kbd class="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 bg-neutral-card border border-neutral-border rounded">
		<span class="text-[10px]">⌘</span>K
	</kbd>

	<!-- Autocomplete Popover Dropdown -->
	{#if isSearchFocused}
		<div
			transition:slide={{ duration: 150 }}
			class="absolute top-full left-0 right-0 mt-2 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 p-2 text-xs flex flex-col gap-2 min-w-[280px]"
		>
			{#if searchQuery.trim() === ''}
				<!-- Mock Recent Searches -->
				<div>
					<div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recent Searches</div>
					<div class="flex flex-col gap-0.5 mt-1">
						{#each recentSearches as item (item)}
							<button
								onclick={() => {
									searchQuery = item;
									if (item.includes('Staff')) activeMenu = 'Staff Directory';
									if (item.includes('Payroll')) activeMenu = 'Payroll';
									if (item.includes('Time')) activeMenu = 'Time & Attendance';
									isSearchFocused = false;
								}}
								class="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 text-left text-slate-600 dark:text-slate-300 cursor-pointer"
							>
								<Icon icon="lucide:history" class="w-3.5 h-3.5 text-slate-400" />
								<span>{item}</span>
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Search Results -->
				<div>
					<div class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Results</div>
					<div class="flex flex-col gap-0.5 mt-1">
						{#each filteredResults as res (res.name)}
							<button
								onclick={() => {
									activeMenu = res.route;
									searchQuery = '';
									isSearchFocused = false;
								}}
								class="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/60 text-left text-slate-600 dark:text-slate-300 cursor-pointer"
							>
								<div class="flex items-center gap-2">
									<Icon icon={res.icon} class="w-3.5 h-3.5 text-slate-400" />
									<span>{res.name}</span>
								</div>
								<span class="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-medium">{res.type}</span>
							</button>
						{:else}
							<div class="px-2 py-3 text-center text-slate-400">
								No results found for "{searchQuery}"
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
