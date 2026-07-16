<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';

	interface Props extends HTMLAttributes<HTMLTableSectionElement> {
		children?: Snippet;
	}

	let { class: className = '', children, ...restProps }: Props = $props();
</script>

<thead class={cn('bg-neutral-bg/25', className)} {...restProps}>
	{#if children}
		{@render children()}
	{/if}
</thead>
