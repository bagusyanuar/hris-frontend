<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { slide, fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';

	interface Props {
		searchQuery?: string;
	}

	let {
		searchQuery = $bindable('')
	}: Props = $props();

	let isOpen = $state(false);
	let selectedIndex = $state(0);
	let inputRef = $state<HTMLInputElement | null>(null);

	function openPalette() {
		isOpen = true;
		searchQuery = '';
		selectedIndex = 0;
	}

	function closePalette() {
		isOpen = false;
		searchQuery = '';
	}

	function handleGlobalKeyDown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
			event.preventDefault();
			if (isOpen) {
				closePalette();
			} else {
				openPalette();
			}
		}
	}

	// Command list definition
	interface CommandItem {
		id: string;
		name: string;
		category: string;
		icon: string;
		shortcut?: string;
		action: () => void;
	}

	let commandItems = $derived.by(() => {
		const items: CommandItem[] = [
			// Go To Pages
			{
				id: 'nav-dashboard',
				name: 'Dashboard',
				category: 'Go to Page',
				icon: 'lucide:grid',
				shortcut: 'G D',
				action: () => {
					goto('/');
					closePalette();
				}
			},
			{
				id: 'nav-staff',
				name: 'Staff Directory',
				category: 'Go to Page',
				icon: 'lucide:users',
				shortcut: 'G S',
				action: () => {
					goto('/employees');
					closePalette();
				}
			},
			{
				id: 'nav-attendance',
				name: 'Time & Attendance',
				category: 'Go to Page',
				icon: 'lucide:clock',
				shortcut: 'G T',
				action: () => {
					goto('#time');
					closePalette();
				}
			},
			{
				id: 'nav-payroll-run',
				name: 'Run Payroll',
				category: 'Go to Page',
				icon: 'lucide:banknote',
				action: () => {
					goto('#run-payroll');
					closePalette();
				}
			},
			{
				id: 'nav-payslips',
				name: 'Payslips',
				category: 'Go to Page',
				icon: 'lucide:file-text',
				action: () => {
					goto('#payslips');
					closePalette();
				}
			},
			{
				id: 'nav-expenses',
				name: 'Expenses',
				category: 'Go to Page',
				icon: 'lucide:wallet',
				action: () => {
					goto('#expenses');
					closePalette();
				}
			},
			// Quick Actions
			{
				id: 'act-theme',
				name: 'Toggle Dark Mode',
				category: 'Quick Actions',
				icon: 'lucide:sun-moon',
				shortcut: 'T T',
				action: () => {
					const html = document.documentElement;
					const isDarkNow = html.classList.toggle('dark');
					localStorage.setItem('theme', isDarkNow ? 'dark' : 'light');
					closePalette();
				}
			},
			{
				id: 'act-add-employee',
				name: 'Add New Employee',
				category: 'Quick Actions',
				icon: 'lucide:user-plus',
				action: () => {
					goto('/employees');
					closePalette();
				}
			},
			// Mock Employees / Data
			{
				id: 'emp-sarah',
				name: 'Sarah Lincoln (HR Manager)',
				category: 'Employees',
				icon: 'lucide:user',
				action: () => {
					goto('/employees');
					closePalette();
				}
			},
			{
				id: 'emp-payroll-april',
				name: 'Payroll Run April 2026',
				category: 'Recent Activity',
				icon: 'lucide:banknote',
				action: () => {
					goto('#run-payroll');
					closePalette();
				}
			},
			{
				id: 'emp-timesheets',
				name: 'Time Sheets approval',
				category: 'Recent Activity',
				icon: 'lucide:clock',
				action: () => {
					goto('#time');
					closePalette();
				}
			}
		];
		return items;
	});

	let filteredItems = $derived.by(() => {
		const q = searchQuery.toLowerCase().trim();
		if (!q) return commandItems;
		return commandItems.filter(
			(item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
		);
	});

	let groupedItems = $derived.by(() => {
		const groups: { [key: string]: CommandItem[] } = {};
		filteredItems.forEach((item) => {
			if (!groups[item.category]) {
				groups[item.category] = [];
			}
			groups[item.category].push(item);
		});
		return groups;
	});

	function handleInputKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (filteredItems.length > 0) {
				selectedIndex = (selectedIndex + 1) % filteredItems.length;
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (filteredItems.length > 0) {
				selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
			}
		} else if (event.key === 'Enter') {
			event.preventDefault();
			if (filteredItems[selectedIndex]) {
				filteredItems[selectedIndex].action();
			}
		} else if (event.key === 'Escape') {
			event.preventDefault();
			closePalette();
		}
	}

	$effect(() => {
		// Reset selection index when search query changes
		void searchQuery;
		selectedIndex = 0;
	});

	$effect(() => {
		if (isOpen && inputRef) {
			inputRef.focus();
		}
	});
</script>

<svelte:window onkeydown={handleGlobalKeyDown} />

<!-- Search Trigger Button -->
<button
	onclick={openPalette}
	class="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/40 border border-neutral-border rounded-xl w-64 hover:border-emerald-500/50 transition-all duration-300 ml-4 relative text-left outline-none cursor-pointer"
>
	<Icon icon="lucide:search" class="w-4 h-4 text-slate-400" />
	<span class="text-xs text-slate-400 w-full select-none">Search anything...</span>
	<kbd
		class="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-slate-400 bg-neutral-card border border-neutral-border rounded select-none"
	>
		<span class="text-[10px]">⌘</span>K
	</kbd>
</button>

<!-- Command Palette Modal -->
{#if isOpen}
	<!-- Backdrop Overlay -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-100 flex items-start justify-center pt-[15vh] p-4 transition-all duration-300"
		onclick={closePalette}
		role="presentation"
		transition:fade={{ duration: 150 }}
	>
		<!-- Modal Content Box -->
		<div
			class="bg-neutral-card border border-neutral-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh] text-slate-700 dark:text-slate-200"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			transition:slide={{ duration: 200 }}
		>
			<!-- Header with Input -->
			<div class="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-border">
				<Icon icon="lucide:search" class="w-5 h-5 text-slate-400 shrink-0" />
				<input
					bind:this={inputRef}
					bind:value={searchQuery}
					type="text"
					placeholder="Search pages, actions, or employees..."
					class="w-full bg-transparent border-none outline-none focus:ring-0 text-sm placeholder-slate-400"
					onkeydown={handleInputKeyDown}
				/>
				<kbd
					class="text-[10px] text-slate-400 px-1.5 py-0.5 border border-neutral-border rounded bg-slate-50 dark:bg-slate-800"
				>
					ESC
				</kbd>
			</div>

			<!-- Scrollable Items List -->
			<div class="overflow-y-auto p-2 flex-1 max-h-[40vh]">
				{#if filteredItems.length === 0}
					<div class="px-4 py-8 text-center text-slate-400 text-xs">
						No results found for "{searchQuery}"
					</div>
				{:else}
					{#each Object.entries(groupedItems) as [category, items] (category)}
						<div
							class="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2 first:mt-0"
						>
							{category}
						</div>
						<div class="flex flex-col gap-0.5 mt-1">
							{#each items as item (item.id)}
								{@const flatIndex = filteredItems.indexOf(item)}
								<button
									onclick={item.action}
									onmouseenter={() => (selectedIndex = flatIndex)}
									class="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs cursor-pointer transition-colors duration-150 {selectedIndex ===
									flatIndex
										? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
										: 'text-slate-600 dark:text-slate-300'}"
								>
									<div class="flex items-center gap-2">
										<Icon icon={item.icon} class="w-4 h-4 text-slate-400 shrink-0" />
										<span class="font-medium">{item.name}</span>
									</div>
									{#if item.shortcut}
										<kbd
											class="text-[9px] bg-slate-50 dark:bg-slate-900 border border-neutral-border text-slate-400 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shrink-0 select-none"
										>
											{item.shortcut}
										</kbd>
									{/if}
								</button>
							{/each}
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
{/if}
