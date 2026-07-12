<script lang="ts">
	import { fade } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { comboboxInputVariants, type ComboboxInputVariants } from './combobox.variants';
	import Label from '../label/Label.svelte';
	import HelperText from '../helpertext/HelperText.svelte';

	export interface Option {
		value: string | number;
		label: string;
	}

	interface Props extends ComboboxInputVariants {
		options: Option[];
		value?: Option | undefined;
		placeholder?: string;
		label?: string;
		error?: string;
		helperText?: string;
		disabled?: boolean;
		required?: boolean;
		class?: string;
		wrapperClass?: string;
		id?: string;
		clearable?: boolean;
		prefix?: string;
	}

	let {
		options = [],
		value = $bindable(),
		placeholder = 'Select option...',
		label,
		error,
		helperText,
		disabled = false,
		required = false,
		variant = 'default',
		size = 'md',
		class: className = '',
		wrapperClass = '',
		id,
		clearable = true,
		prefix
	}: Props = $props();

	// Generate a unique ID if one isn't provided (for linking label to input)
	let fallbackId = Math.random().toString(36).substring(2, 9);
	let inputId = $derived(id ?? fallbackId);

	// Error state overrides the variant
	let currentVariant = $derived(error ? 'error' : variant);

	let isOpen = $state(false);
	let searchQuery = $state('');

	// Get label of currently selected option
	let selectedOption = $derived(value ? options.find((opt) => opt.value === value?.value) || value : undefined);
	let selectedLabel = $derived(selectedOption ? selectedOption.label : '');

	// Determine what is displayed in the input field
	let displayValue = $derived(isOpen ? searchQuery : selectedLabel);

	// Reactive filtering based on search query
	let filteredOptions = $derived(
		searchQuery === ''
			? options
			: options.filter((opt) =>
					opt.label.toLowerCase().includes(searchQuery.toLowerCase())
				)
	);

	function toggleDropdown() {
		if (disabled) return;
		if (isOpen) {
			isOpen = false;
		} else {
			isOpen = true;
			searchQuery = '';
		}
	}

	function selectOption(opt: Option) {
		value = opt;
		searchQuery = '';
		isOpen = false;
	}

	function clearSelection(e: MouseEvent) {
		e.stopPropagation();
		value = undefined;
		searchQuery = '';
	}

	function handleInput(e: Event) {
		if (!isOpen) isOpen = true;
		searchQuery = (e.target as HTMLInputElement).value;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			isOpen = false;
		} else if (e.key === 'ArrowDown' && !isOpen) {
			isOpen = true;
			searchQuery = '';
			e.preventDefault();
		}
	}

	// Click outside Svelte action
	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				isOpen = false;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)} use:clickOutside>
	{#if label}
		<Label for={inputId} required={required}>
			{label}
		</Label>
	{/if}

	<div class="relative">
		<!-- Trigger Wrapper -->
		<div
			class={cn(
				comboboxInputVariants({
					variant: currentVariant,
					size
				}),
				disabled && 'opacity-50 pointer-events-none',
				className
			)}
		>
			{#if prefix}
				<Icon icon={prefix} class="mr-2 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
			{/if}
			<input
				id={inputId}
				type="text"
				{disabled}
				value={displayValue}
				placeholder={selectedLabel || placeholder}
				oninput={handleInput}
				onfocus={() => {
					if (!disabled) {
						isOpen = true;
						searchQuery = '';
					}
				}}
				onkeydown={handleKeyDown}
				class="flex-1 min-w-0 border-none bg-transparent p-0 pr-12 text-inherit placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-slate-500"
			/>

			<!-- Controls (Clear & Chevron) -->
			<div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
				{#if clearable && value !== undefined && value !== null && !disabled}
					<button
						type="button"
						onclick={clearSelection}
						class="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
						aria-label="Clear selection"
					>
						<Icon icon="lucide:x" class="h-3.5 w-3.5" />
					</button>
				{/if}

				<button
					type="button"
					onclick={toggleDropdown}
					{disabled}
					class="flex h-5 w-5 items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
					aria-label="Toggle dropdown"
				>
					<Icon
						icon="lucide:chevron-down"
						class={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')}
					/>
				</button>
			</div>
		</div>

		<!-- Dropdown Popover -->
		{#if isOpen && !disabled}
			<div
				transition:fade={{ duration: 100 }}
				class="absolute z-50 mt-1.5 max-h-60 w-full overflow-auto rounded-lg border border-neutral-border bg-neutral-card p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
			>
				{#each filteredOptions as opt (opt.value)}
					<button
						type="button"
						onclick={() => selectOption(opt)}
						class={cn(
							'w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 focus:outline-none',
							opt.value === value?.value
								? 'bg-brand-light text-brand-text font-medium dark:bg-brand-primary/20 dark:text-brand-primary'
								: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
						)}
					>
						{opt.label}
					</button>
				{:else}
					<div class="px-3 py-2.5 text-center text-sm text-slate-400 dark:text-slate-500">
						No options found
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if error}
		<HelperText variant="error">{error}</HelperText>
	{:else if helperText}
		<HelperText>{helperText}</HelperText>
	{/if}
</div>
