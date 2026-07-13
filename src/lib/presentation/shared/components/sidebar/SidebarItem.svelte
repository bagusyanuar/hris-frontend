<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { getContext } from 'svelte';
	import Icon from '@iconify/svelte';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { page } from '$app/state';
	import type { SidebarContext } from './Sidebar.svelte';

	interface Props {
		label: string;
		icon?: string;
		isActive?: boolean;
		isSubItem?: boolean;
		href?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let { label, icon, isActive, isSubItem = false, href, onclick }: Props = $props();

	const sidebar = getContext<SidebarContext>('sidebar');

	// Jika isActive tidak didefinisikan secara manual, otomatis deteksi berdasarkan URL pathname saat ini
	const computedActive = $derived(
		isActive !== undefined 
			? isActive 
			: (href ? page.url.pathname === href || page.url.hash === href : false)
	);

	const className = $derived(isSubItem
		? `w-full flex items-center py-1.5 px-3 rounded-lg text-left text-xs transition-all duration-150 cursor-pointer ${
				computedActive
					? 'text-brand-text dark:text-emerald-400 font-semibold bg-brand-light dark:bg-emerald-500/10'
					: 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/40'
			}`
		: `w-full flex items-center rounded-xl text-left transition-all duration-150 group cursor-pointer ${
				sidebar.isCollapsed ? 'justify-center p-2.5' : 'gap-3 p-2.5'
			} ${
				computedActive
					? 'bg-brand-light dark:bg-emerald-500/10 text-brand-text dark:text-emerald-400 font-medium'
					: 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'
			}`);

	const title = $derived(!isSubItem && sidebar.isCollapsed ? label : '');
</script>

{#if href}
	<a
		href={href.startsWith('/') && !href.startsWith('//') ? resolve(href as Pathname) : href}
		{onclick}
		class={className}
		{title}
	>
		{#if !isSubItem && icon}
			<Icon {icon} class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
		{/if}
		{#if isSubItem}
			{label}
		{:else if !sidebar.isCollapsed}
			<span class="text-xs">{label}</span>
		{/if}
	</a>
{:else}
	<button
		{onclick}
		class={className}
		{title}
		type="button"
	>
		{#if !isSubItem && icon}
			<Icon {icon} class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
		{/if}
		{#if isSubItem}
			{label}
		{:else if !sidebar.isCollapsed}
			<span class="text-xs">{label}</span>
		{/if}
	</button>
{/if}
