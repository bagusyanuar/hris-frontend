<script lang="ts">
	import { getContext } from 'svelte';
	import Icon from '@iconify/svelte';
	import type { SidebarContext } from './Sidebar.svelte';

	const sidebar = getContext<SidebarContext>('sidebar');
</script>

<div class="flex items-center select-none transition-all duration-300
	{sidebar.isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-2 py-3'}"
>
	<div
		class="flex items-center justify-center shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-all duration-300
			{sidebar.isCollapsed ? 'w-9 h-9' : 'w-10 h-10'}"
	>
		<Icon icon="lucide:layers" class="transition-all duration-300 {sidebar.isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}" />
	</div>
	{#if !sidebar.isCollapsed}
		<div class="flex flex-col min-w-0">
			<span
				class="font-bold text-base tracking-tight text-slate-950 dark:text-slate-50 leading-none"
				>TALENTFLOW</span
			>
			<span class="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1"
				>HRIS Ecosystem</span
			>
		</div>
	{/if}
</div>
