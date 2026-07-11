<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import Label from '../label/Label.svelte';
	import HelperText from '../helpertext/HelperText.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked'> {
		checked?: boolean;
		label?: string;
		description?: string;
		error?: string;
		ref?: HTMLInputElement;
	}

	let {
		checked = $bindable(false),
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
	let checkboxId = $derived(id ?? fallbackId);
	let isRequired = $derived(!!restProps.required);
	let isFocused = $state(false);
</script>

<div class="flex items-start gap-3">
	<div class="flex h-5 items-center">
		<div class="relative flex items-center">
			<input
				bind:this={ref}
				id={checkboxId}
				type="checkbox"
				bind:checked
				class="sr-only"
				onfocus={() => (isFocused = true)}
				onblur={() => (isFocused = false)}
				{...restProps}
			/>
			<label
				for={checkboxId}
				class={cn(
					'h-4 w-4 rounded border flex items-center justify-center transition-all duration-200 cursor-pointer select-none',
					checked
						? 'bg-brand-primary border-brand-primary text-white'
						: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900',
					error && 'border-rose-500 dark:border-rose-500 focus:ring-rose-500',
					isFocused && 'ring-2 ring-brand-primary/20 ring-offset-1 dark:ring-offset-slate-950',
					restProps.disabled && 'opacity-50 cursor-not-allowed',
					className
				)}
			>
				{#if checked}
					<svg
						class="h-2.5 w-2.5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				{/if}
			</label>
		</div>
	</div>

	{#if label || description || error}
		<div class="flex flex-col gap-0.5">
			{#if label}
				<Label for={checkboxId} required={isRequired}>
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
