<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { typographyVariants } from '$lib/presentation/shared/components/typography/typography.variants';

	interface Props extends HTMLLabelAttributes {
		required?: boolean;
		children?: Snippet;
	}

	let {
		required = false,
		class: className = '',
		children,
		...restProps
	}: Props = $props();
</script>

<label
	class={cn(
		typographyVariants({ variant: 'body-sm', weight: 'medium' }),
		'inline-flex items-center gap-0.5 text-slate-700 dark:text-slate-300 cursor-pointer select-none',
		className
	)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{/if}
	{#if required}
		<span class="text-rose-500 font-semibold" aria-hidden="true">*</span>
	{/if}
</label>
