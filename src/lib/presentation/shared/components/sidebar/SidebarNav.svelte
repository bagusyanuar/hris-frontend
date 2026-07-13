<script lang="ts">
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<nav class="flex-1 mt-6 overflow-y-auto no-scrollbar space-y-4">
	{@render children?.()}
</nav>
