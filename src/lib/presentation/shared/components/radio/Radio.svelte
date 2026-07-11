<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import Label from '../label/Label.svelte';
	import HelperText from '../helpertext/HelperText.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'value' | 'checked'> {
		value: unknown;
		group: unknown;
		label?: string;
		description?: string;
		error?: string;
		ref?: HTMLInputElement;
	}

	let {
		value,
		group = $bindable(),
		label,
		description,
		error,
		class: className = '',
		ref = $bindable(),
		id,
		...restProps
	}: Props = $props();

	// Generate a unique ID if one isn't provided
	let fallbackId = Math.random().toString(36).substring(2, 9);
	let radioId = $derived(id ?? fallbackId);
	let isRequired = $derived(!!restProps.required);
	let isFocused = $state(false);

	// Determine if this option is selected
	let isChecked = $derived(group === value);

	function handleClick(e: MouseEvent) {
		if (restProps.disabled) return;
		e.preventDefault();
		if (isChecked) {
			group = undefined;
		} else {
			group = value;
		}
	}
</script>

<div class="flex items-start gap-3">
	<div class="flex h-5 items-center">
		<div class="relative flex items-center">
			<input
				bind:this={ref}
				id={radioId}
				type="radio"
				checked={isChecked}
				{value}
				class="sr-only"
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				onclick={handleClick}
				{...restProps}
			/>
			<label
				for={radioId}
				class={cn(
					'h-4 w-4 rounded-full border flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
					isChecked
						? 'border-brand-primary text-brand-primary'
						: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900',
					error && 'border-rose-500 dark:border-rose-500',
					isFocused && 'ring-2 ring-brand-primary/20 ring-offset-1 dark:ring-offset-slate-950',
					restProps.disabled && 'opacity-50 cursor-not-allowed',
					className
				)}
			>
				{#if isChecked}
					<span class="h-2 w-2 rounded-full bg-brand-primary"></span>
				{/if}
			</label>
		</div>
	</div>

	{#if label || description || error}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<Label for={radioId} required={isRequired}>
					{label}
				</Label>
			{/if}

			{#if error}
				<HelperText variant="error">{error}</HelperText>
			{:else if description}
				<HelperText>{description}</HelperText>
			{/if}
		</div>
	{/if}
</div>


