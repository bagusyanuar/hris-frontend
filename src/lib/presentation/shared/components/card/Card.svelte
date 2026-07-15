<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { cardVariants, type CardVariants } from './card.variants';
	import Typography from '../typography/Typography.svelte';

	interface Props extends HTMLAttributes<HTMLDivElement>, CardVariants {
		children?: Snippet;
		header?: Snippet;
		footer?: Snippet;
		title?: string;
		description?: string;
	}

	let {
		variant,
		padding,
		rounded,
		shadow,
		hoverable,
		class: className = '',
		children,
		header,
		footer,
		title,
		description,
		...restProps
	}: Props = $props();
</script>

<div
	class={cn(cardVariants({ variant, padding, rounded, shadow, hoverable }), className)}
	{...restProps}
>
	<!-- Card Header (with proportional mb-5 spacing) -->
	{#if header || title || description}
		<div class="mb-5 flex flex-col gap-1.5">
			{#if header}
				{@render header()}
			{:else}
				{#if title}
					<Typography variant="h6" weight="semibold">{title}</Typography>
				{/if}
				{#if description}
					<Typography variant="caption" color="secondary">{description}</Typography>
				{/if}
			{/if}
		</div>
	{/if}

	<!-- Card Content -->
	{#if children}
		<div class="text-sm">
			{@render children()}
		</div>
	{/if}

	<!-- Card Footer (with proportional border and spacing) -->
	{#if footer}
		<div class="mt-6 border-t border-neutral-border pt-5">
			{@render footer()}
		</div>
	{/if}
</div>
