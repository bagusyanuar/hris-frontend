<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { badgeVariants, type BadgeVariants } from './badge.variants';

	interface Props extends HTMLAttributes<HTMLSpanElement>, BadgeVariants {
		children?: Snippet;
	}

	let {
		variant,
		size,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<span class={cn(badgeVariants({ variant, size }), className)} {...restProps}>
	{@render children?.()}
</span>
