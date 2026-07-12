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
		value?: Option | Option[] | undefined;
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
		multiple?: boolean;
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
		prefix,
		multiple = false
	}: Props = $props();

	// Generate a unique ID if one isn't provided (for linking label to input)
	let fallbackId = Math.random().toString(36).substring(2, 9);
	let inputId = $derived(id ?? fallbackId);

	// Error state overrides the variant
	let currentVariant = $derived(error ? 'error' : variant);

	let isOpen = $state(false);
	let searchQuery = $state('');

	// Check if an option is selected
	function isSelected(opt: Option): boolean {
		if (multiple) {
			const arr = (value as Option[]) || [];
			return arr.some((item) => item.value === opt.value);
		} else {
			return value ? (value as Option).value === opt.value : false;
		}
	}

	// Get label of currently selected option (for single select)
	let selectedOption = $derived(!multiple && value ? options.find((opt) => opt.value === (value as Option).value) || (value as Option) : undefined);
	let selectedLabel = $derived(selectedOption ? selectedOption.label : '');

	// Determine what is displayed in the input field
	let displayValue = $derived(multiple ? searchQuery : (isOpen ? searchQuery : selectedLabel));

	// Determine current placeholder
	let currentPlaceholder = $derived(
		multiple
			? (((value as Option[]) || []).length > 0 ? '' : placeholder)
			: (selectedLabel || placeholder)
	);

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
		if (multiple) {
			const currentVal = (value as Option[]) || [];
			if (currentVal.some((item) => item.value === opt.value)) {
				value = currentVal.filter((item) => item.value !== opt.value);
			} else {
				value = [...currentVal, opt];
			}
			searchQuery = '';
		} else {
			value = opt;
			searchQuery = '';
			isOpen = false;
		}
	}

	function removeOption(opt: Option, e: MouseEvent) {
		e.stopPropagation();
		const currentVal = (value as Option[]) || [];
		value = currentVal.filter((item) => item.value !== opt.value);
	}

	let hasValue = $derived(
		multiple
			? ((value as Option[]) || []).length > 0
			: (value !== undefined && value !== null)
	);

	function clearSelection(e: MouseEvent) {
		e.stopPropagation();
		value = multiple ? [] : undefined;
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

			<!-- Selected tags/chips + Input field -->
			<div class="flex flex-wrap items-center gap-1.5 flex-1 min-w-0 pr-12 py-1">
				{#if multiple && Array.isArray(value)}
					{#each value as opt (opt.value)}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-brand-light pl-2 pr-0.5 py-0.5 text-xs font-medium text-brand-text border border-brand-border"
						>
							{opt.label}
							<button
								type="button"
								onclick={(e) => removeOption(opt, e)}
								class="flex h-3.5 w-3.5 items-center justify-center rounded-full text-brand-text/60 hover:bg-brand-primary/10 hover:text-brand-text"
								aria-label="Remove {opt.label}"
							>
								<Icon icon="lucide:x" class="h-2.5 w-2.5" />
							</button>
						</span>
					{/each}
				{/if}

				<input
					id={inputId}
					type="text"
					{disabled}
					value={displayValue}
					placeholder={currentPlaceholder}
					oninput={handleInput}
					onfocus={() => {
						if (!disabled) {
							isOpen = true;
							searchQuery = '';
						}
					}}
					onkeydown={handleKeyDown}
					class="flex-1 min-w-[60px] border-none bg-transparent p-0 text-inherit placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed dark:placeholder:text-slate-500"
				/>
			</div>

			<!-- Controls (Clear & Chevron) -->
			<div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
				{#if clearable && hasValue && !disabled}
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
							'w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-150 focus:outline-none flex items-center justify-between',
							isSelected(opt)
								? 'bg-brand-light text-brand-text font-medium dark:bg-brand-primary/20 dark:text-brand-primary'
								: 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'
						)}
					>
						<div class="flex items-center gap-2">
							{#if multiple}
								<!-- Checkbox Visual -->
								<div
									class={cn(
										'h-4 w-4 rounded border flex items-center justify-center transition-all duration-200 shrink-0',
										isSelected(opt)
											? 'bg-brand-primary border-brand-primary text-white'
											: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
									)}
								>
									{#if isSelected(opt)}
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
								</div>
							{/if}
							<span>{opt.label}</span>
						</div>
						{#if !multiple && isSelected(opt)}
							<Icon icon="lucide:check" class="h-4 w-4 text-brand-primary" />
						{/if}
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
