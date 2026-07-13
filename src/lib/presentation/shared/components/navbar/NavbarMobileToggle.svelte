<script lang="ts">
	import Icon from '@iconify/svelte';

	interface Props {
		isOpen: boolean;
	}

	let { isOpen = $bindable(false) }: Props = $props();
</script>

<button
	onclick={() => (isOpen = true)}
	class="md:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
	aria-label="Open menu"
	aria-expanded={isOpen}
>
	<Icon icon="lucide:menu" class="w-5 h-5" />
</button>
