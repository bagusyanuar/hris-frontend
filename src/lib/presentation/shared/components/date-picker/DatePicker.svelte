<script lang="ts">
  import { DatePicker as BitsDatePicker } from 'bits-ui';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import Icon from '@iconify/svelte';
  import Label from '../label/Label.svelte';
  import HelperText from '../helpertext/HelperText.svelte';
  import { type DateValue, CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
  import {
    datePickerTriggerVariants,
    type DatePickerTriggerVariants
  } from './date-picker.variants';

  interface Props extends DatePickerTriggerVariants {
    value?: DateValue | undefined;
    type?: 'date' | 'month' | 'year';
    placeholder?: string;
    label?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    required?: boolean;
    class?: string;
    wrapperClass?: string;
    id?: string;
    displayFormat?: (date: DateValue) => string;
    minValue?: DateValue | undefined;
    maxValue?: DateValue | undefined;
    align?: 'start' | 'center' | 'end';
  }

  let {
    value = $bindable(),
    type = 'date',
    placeholder,
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
    displayFormat,
    minValue,
    maxValue,
    align = 'start'
  }: Props = $props();

  // Dynamic default placeholder
  const defaultPlaceholder = $derived(
    placeholder ??
      (type === 'month'
        ? 'Pilih bulan...'
        : type === 'year'
          ? 'Pilih tahun...'
          : 'Pilih tanggal...')
  );

  // Default formatting helper for dd/MM/yyyy, MM/yyyy, or yyyy
  const defaultFormatDate = (date: DateValue): string => {
    if (type === 'month') {
      const month = String(date.month).padStart(2, '0');
      return `${month}/${date.year}`;
    }
    if (type === 'year') {
      return `${date.year}`;
    }
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    return `${day}/${month}/${date.year}`;
  };

  let formatToShow = $derived(displayFormat ?? defaultFormatDate);

  // Generate a unique ID if one isn't provided (for linking label to input)
  let fallbackId = Math.random().toString(36).substring(2, 9);
  let inputId = $derived(id ?? fallbackId);

  // Error state overrides the variant
  let currentVariant = $derived(error ? 'error' : variant);

  // Control opening state of the dropdown
  let open = $state(false);

  // Active states for Month Picker
  let activeYear = $state(today(getLocalTimeZone()).year);
  $effect(() => {
    if (value) {
      activeYear = value.year;
    }
  });

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  // Active states for Year Picker (shows grid of 12 years)
  let activeYearRangeStart = $state(Math.floor(today(getLocalTimeZone()).year / 12) * 12);
  $effect(() => {
    if (value) {
      activeYearRangeStart = Math.floor(value.year / 12) * 12;
    }
  });

  let yearGrid = $derived(Array.from({ length: 12 }, (_, i) => activeYearRangeStart + i));

  function selectMonth(monthNum: number) {
    value = new CalendarDate(activeYear, monthNum, 1);
    open = false;
  }

  function selectYear(year: number) {
    value = new CalendarDate(year, 1, 1);
    open = false;
  }
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)}>
  {#if label}
    <Label for={inputId} {required}>
      {label}
    </Label>
  {/if}

  <BitsDatePicker.Root bind:value bind:open {disabled} {required} {minValue} {maxValue}>
    <div class="relative">
      <BitsDatePicker.Trigger
        id={inputId}
        class={cn(
          datePickerTriggerVariants({
            variant: currentVariant,
            size
          }),
          className
        )}
      >
        <span class="flex items-center gap-2">
          <Icon
            icon="lucide:calendar"
            class="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500"
          />
          {#if value}
            <span>{formatToShow(value)}</span>
          {:else}
            <span class="text-slate-400 dark:text-slate-500">{defaultPlaceholder}</span>
          {/if}
        </span>
      </BitsDatePicker.Trigger>

      <BitsDatePicker.Content
        sideOffset={6}
        {align}
        class="z-50 rounded-xl border border-neutral-border bg-neutral-card p-4 shadow-lg focus:outline-none dark:bg-slate-950 dark:border-slate-800 transition-all duration-150 ease-out opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100"
      >
        {#if type === 'date'}
          <BitsDatePicker.Calendar>
            {#snippet children({ months, weekdays })}
              {#each months as month (month.value.toString())}
                <div class="w-fit">
                  <header class="flex items-center justify-between pb-3">
                    <BitsDatePicker.PrevButton
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                    </BitsDatePicker.PrevButton>
                    <BitsDatePicker.Heading
                      class="text-sm font-semibold text-slate-900 dark:text-slate-100"
                    />
                    <BitsDatePicker.NextButton
                      class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                    </BitsDatePicker.NextButton>
                  </header>

                  <BitsDatePicker.Grid class="w-full border-collapse">
                    <BitsDatePicker.GridHead>
                      <BitsDatePicker.GridRow class="flex pb-2">
                        {#each weekdays as day, i (i)}
                          <BitsDatePicker.HeadCell
                            class="w-8 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500"
                          >
                            {day.slice(0, 2)}
                          </BitsDatePicker.HeadCell>
                        {/each}
                      </BitsDatePicker.GridRow>
                    </BitsDatePicker.GridHead>

                    <BitsDatePicker.GridBody>
                      {#each month.weeks as weekDates, i (i)}
                        <BitsDatePicker.GridRow class="flex w-full mt-1">
                          {#each weekDates as date (date.toString())}
                            <BitsDatePicker.Cell
                              {date}
                              month={month.value}
                              class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
                            >
                              <BitsDatePicker.Day
                                class="inline-flex h-8 w-8 items-center justify-center rounded-lg p-0 text-sm font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer
																data-selected:bg-brand-primary data-selected:text-white data-selected:hover:bg-brand-primary data-selected:hover:text-white
																data-disabled:text-slate-300 dark:data-disabled:text-slate-700 data-disabled:pointer-events-none data-outside-month:text-slate-300/50 dark:data-outside-month:text-slate-700/50"
                              />
                            </BitsDatePicker.Cell>
                          {/each}
                        </BitsDatePicker.GridRow>
                      {/each}
                    </BitsDatePicker.GridBody>
                  </BitsDatePicker.Grid>
                </div>
              {/each}
            {/snippet}
          </BitsDatePicker.Calendar>
        {:else if type === 'month'}
          <div class="w-64">
            <header class="flex items-center justify-between pb-3">
              <button
                type="button"
                onclick={() => activeYear--}
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:chevron-left" class="h-4 w-4" />
              </button>
              <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeYear}
              </span>
              <button
                type="button"
                onclick={() => activeYear++}
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:chevron-right" class="h-4 w-4" />
              </button>
            </header>

            <div class="grid grid-cols-3 gap-2 pt-1">
              {#each monthNames as name, index (name)}
                {@const monthNum = index + 1}
                {@const isSelected = value && value.year === activeYear && value.month === monthNum}
                <button
                  type="button"
                  onclick={() => selectMonth(monthNum)}
                  class="inline-flex h-10 items-center justify-center rounded-lg text-sm font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer
									{isSelected ? 'bg-brand-primary text-white hover:bg-brand-primary hover:text-white' : ''}"
                >
                  {name}
                </button>
              {/each}
            </div>
          </div>
        {:else if type === 'year'}
          <div class="w-64">
            <header class="flex items-center justify-between pb-3">
              <button
                type="button"
                onclick={() => (activeYearRangeStart -= 12)}
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:chevron-left" class="h-4 w-4" />
              </button>
              <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {activeYearRangeStart} - {activeYearRangeStart + 11}
              </span>
              <button
                type="button"
                onclick={() => (activeYearRangeStart += 12)}
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <Icon icon="lucide:chevron-right" class="h-4 w-4" />
              </button>
            </header>

            <div class="grid grid-cols-3 gap-2 pt-1">
              {#each yearGrid as year (year)}
                {@const isSelected = value && value.year === year}
                <button
                  type="button"
                  onclick={() => selectYear(year)}
                  class="inline-flex h-10 items-center justify-center rounded-lg text-sm font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer
									{isSelected ? 'bg-brand-primary text-white hover:bg-brand-primary hover:text-white' : ''}"
                >
                  {year}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </BitsDatePicker.Content>
    </div>
  </BitsDatePicker.Root>

  {#if error}
    <HelperText variant="error">{error}</HelperText>
  {:else if helperText}
    <HelperText>{helperText}</HelperText>
  {/if}
</div>
