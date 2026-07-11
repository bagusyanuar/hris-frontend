<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { textfieldInputVariants, type TextfieldInputVariants } from './textfield.variants';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix'>, TextfieldInputVariants {
		value?: string | number | string[];
		label?: string;
		error?: string;
		helperText?: string;
		prefix?: Snippet;
		suffix?: Snippet;
		wrapperClass?: string;
		ref?: HTMLInputElement;
	}

	let {
		value = $bindable(),
		variant = 'default',
		size = 'md',
		label,
		error,
		helperText,
		prefix,
		suffix,
		class: className = '',
		wrapperClass = '',
		ref = $bindable(),
		id,
		type = 'text',
		...restProps
	}: Props = $props();

	// Generate a unique ID if one isn't provided (for linking label to input)
	let fallbackId = Math.random().toString(36).substring(2, 9);
	let inputId = $derived(id ?? fallbackId);
	
	// Error state overrides the variant
	let currentVariant = $derived(error ? 'error' : variant);
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)}>
	{#if label}
		<label for={inputId} class="text-sm font-medium text-slate-700 dark:text-slate-300">
			{label}
		</label>
	{/if}

	<div class="relative flex items-center">
		{#if prefix}
			<div class="pointer-events-none absolute left-3 z-10 flex items-center justify-center text-slate-500">
				{@render prefix()}
			</div>
		{/if}

		<input
			bind:this={ref}
			id={inputId}
			{type}
			bind:value
			class={cn(
				textfieldInputVariants({ 
					variant: currentVariant, 
					size, 
					hasPrefix: !!prefix, 
					hasSuffix: !!suffix 
				}),
				className
			)}
			{...restProps}
		/>

		{#if suffix}
			<div class="absolute right-3 z-10 flex items-center justify-center text-slate-500">
				{@render suffix()}
			</div>
		{/if}
	</div>

	{#if error}
		<p class="text-xs font-medium text-rose-500">{error}</p>
	{:else if helperText}
		<p class="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
	{/if}
</div>
