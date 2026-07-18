<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { typographyVariants } from '$lib/presentation/shared/components/typography/typography.variants';

	interface Props extends HTMLAttributes<HTMLParagraphElement> {
		variant?: 'default' | 'error';
		children?: Snippet;
	}

	let {
		variant = 'default',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	let color = $derived(variant === 'error' ? ('error' as const) : ('secondary' as const));
	let weight = $derived(variant === 'error' ? ('medium' as const) : undefined);
</script>

<p
	class={cn(
		typographyVariants({ variant: 'caption', color, weight }),
		'select-none',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</p>
