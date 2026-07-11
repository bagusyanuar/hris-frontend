<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { typographyVariants, type TypographyVariants } from './typography.variants';

	type SupportedTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
		tag?: SupportedTags;
		variant?: TypographyVariants['variant'];
		weight?: TypographyVariants['weight'];
		color?: TypographyVariants['color'];
		children?: Snippet;
	}

	let {
		tag,
		variant = 'body-md',
		weight,
		color = 'primary',
		class: className = '',
		children,
		...restProps
	}: Props = $props();

	// Automatically resolve tag if not specified
	const resolvedTag = $derived(
		tag ??
		(variant === 'h1' ||
		variant === 'h2' ||
		variant === 'h3' ||
		variant === 'h4' ||
		variant === 'h5' ||
		variant === 'h6'
			? (variant as SupportedTags)
			: variant === 'caption' || variant === 'code'
				? 'span'
				: 'p')
	);
</script>

<svelte:element
	this={resolvedTag}
	class={cn(typographyVariants({ variant, weight, color }), className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
