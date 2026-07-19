<script lang="ts" generics="T">
  import { fade } from 'svelte/transition';
  import Icon from '@iconify/svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { comboboxInputVariants, type ComboboxInputVariants } from './combobox.variants';
  import Label from '../label/Label.svelte';
  import HelperText from '../helpertext/HelperText.svelte';
  import type { Option } from './Combobox.svelte';

  interface Props extends ComboboxInputVariants {
    fetchFn: (input: { page: number; limit: number; q: string }) => Promise<{
      items: T[];
      hasNextPage: boolean;
    }>;
    mapFn: (item: T) => Option;
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
    limit?: number;
    debounceMs?: number;
  }

  let {
    fetchFn,
    mapFn,
    value = $bindable(),
    placeholder = 'Search & select...',
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
    multiple = false,
    limit = 10,
    debounceMs = 300
  }: Props = $props();

  // Generate a unique ID if one isn't provided
  let fallbackId = Math.random().toString(36).substring(2, 9);
  let inputId = $derived(id ?? fallbackId);

  // Error state overrides the variant
  let currentVariant = $derived(error ? 'error' : variant);

  let isOpen = $state(false);
  let searchQuery = $state('');
  let rawItems = $state<T[]>([]);
  let isLoading = $state(false);
  let isLoadingMore = $state(false);
  let hasMore = $state(false);
  let currentPage = $state(1);

  // Map raw domain items to generic Options
  let options = $derived(rawItems.map(mapFn));

  async function fetchPage(reset = false) {
    if (reset) {
      if (isLoading) return;
      isLoading = true;
      try {
        const result = await fetchFn({ page: 1, limit, q: searchQuery });
        rawItems = result.items || [];
        currentPage = 1;
        hasMore = result.hasNextPage && rawItems.length > 0;
      } catch (err) {
        console.error(err);
        hasMore = false;
      } finally {
        isLoading = false;
      }
    } else {
      if (isLoadingMore || !hasMore) return;
      isLoadingMore = true;
      try {
        const nextPage = currentPage + 1;
        const result = await fetchFn({ page: nextPage, limit, q: searchQuery });
        if (!result.items || result.items.length === 0) {
          hasMore = false;
        } else {
          rawItems = [...rawItems, ...result.items];
          currentPage = nextPage;
          hasMore = result.hasNextPage;
        }
      } catch (err) {
        console.error(err);
        hasMore = false;
      } finally {
        isLoadingMore = false;
      }
    }
  }

  // Track previous open state to detect open transitions
  let prevIsOpen = $state(false);

  // Single unified effect: handles both initial-open fetch and debounced search
  $effect(() => {
    void searchQuery; // track dependency
    const open = isOpen; // track dependency

    if (!open) {
      prevIsOpen = false;
      return;
    }

    // When dropdown just opened, fetch immediately (no debounce)
    if (!prevIsOpen) {
      prevIsOpen = true;
      fetchPage(true);
      return;
    }

    // For subsequent search query changes, debounce
    const timer = setTimeout(() => {
      fetchPage(true);
    }, debounceMs);

    return () => clearTimeout(timer);
  });

  function isSelected(opt: Option): boolean {
    if (multiple) {
      const arr = (value as Option[]) || [];
      return arr.some((item) => item.value === opt.value);
    } else {
      return value ? (value as Option).value === opt.value : false;
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
    multiple ? ((value as Option[]) || []).length > 0 : value !== undefined && value !== null
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

  // Click outside action
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

  // Intersection Observer action for infinite scrolling
  // Uses a mutable ref so the callback is always up-to-date (avoids stale closure)
  function intersectionObserver(node: HTMLElement, callback: () => void) {
    const callbackRef = { current: callback };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(node);
    return {
      update(newCallback: () => void) {
        callbackRef.current = newCallback;
      },
      destroy() {
        observer.disconnect();
      }
    };
  }

  let selectedOption = $derived(!multiple && value ? (value as Option) : undefined);
  let selectedLabel = $derived(selectedOption ? selectedOption.label : '');
  let displayValue = $derived(multiple ? searchQuery : isOpen ? searchQuery : selectedLabel);

  let currentPlaceholder = $derived(
    multiple
      ? ((value as Option[]) || []).length > 0
        ? ''
        : placeholder
      : selectedLabel || placeholder
  );
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)} use:clickOutside>
  {#if label}
    <Label for={inputId} {required}>
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
          onclick={() => {
            if (!disabled) {
              isOpen = !isOpen;
            }
          }}
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
        <!-- Loading State -->
        {#if isLoading && options.length === 0}
          <div
            class="px-3 py-6 flex flex-col items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500"
          >
            <Icon icon="lucide:loader-2" class="animate-spin h-5 w-5 text-brand-primary" />
            <span>Searching...</span>
          </div>
        {:else}
          {#each options as opt (opt.value)}
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

          <!-- Infinite Scroll Sentinel -->
          {#if hasMore}
            <div
              use:intersectionObserver={() => {
                if (!isLoadingMore) fetchPage(false);
              }}
              class="py-2.5 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500"
            >
              <Icon icon="lucide:loader-2" class="animate-spin h-3.5 w-3.5 text-brand-primary" />
              <span>Loading more options...</span>
            </div>
          {/if}
        {/if}
      </div>
    {/if}
  </div>

  {#if error}
    <HelperText variant="error">{error}</HelperText>
  {:else if helperText}
    <HelperText>{helperText}</HelperText>
  {/if}
</div>
