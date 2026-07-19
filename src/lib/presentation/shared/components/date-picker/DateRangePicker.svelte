<script lang="ts">
  import { DateRangePicker as BitsDateRangePicker } from 'bits-ui';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import Icon from '@iconify/svelte';
  import Label from '../label/Label.svelte';
  import HelperText from '../helpertext/HelperText.svelte';
  import { type DateRange } from 'bits-ui';
  import {
    datePickerTriggerVariants,
    type DatePickerTriggerVariants
  } from './date-picker.variants';
  import { type DateValue } from '@internationalized/date';

  interface Props extends DatePickerTriggerVariants {
    value?: DateRange | undefined;
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

  // Default formatting helper for dd/MM/yyyy
  const defaultFormatDate = (date: DateValue): string => {
    const day = String(date.day).padStart(2, '0');
    const month = String(date.month).padStart(2, '0');
    return `${day}/${month}/${date.year}`;
  };

  let {
    value = $bindable(),
    placeholder = 'Pilih rentang tanggal...',
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
    displayFormat = defaultFormatDate,
    minValue,
    maxValue,
    align = 'start'
  }: Props = $props();

  // Generate a unique ID if one isn't provided (for linking label to input)
  let fallbackId = Math.random().toString(36).substring(2, 9);
  let inputId = $derived(id ?? fallbackId);

  // Error state overrides the variant
  let currentVariant = $derived(error ? 'error' : variant);
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)}>
  {#if label}
    <Label for={inputId} {required}>
      {label}
    </Label>
  {/if}

  <BitsDateRangePicker.Root bind:value {disabled} {required} {minValue} {maxValue}>
    <div class="relative">
      <BitsDateRangePicker.Trigger
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
          {#if value?.start && value?.end}
            <span>{displayFormat(value.start)} - {displayFormat(value.end)}</span>
          {:else if value?.start}
            <span>{displayFormat(value.start)} - ...</span>
          {:else}
            <span class="text-slate-400 dark:text-slate-500">{placeholder}</span>
          {/if}
        </span>
      </BitsDateRangePicker.Trigger>

      <BitsDateRangePicker.Content
        sideOffset={6}
        {align}
        class="z-50 rounded-xl border border-neutral-border bg-neutral-card p-4 shadow-lg focus:outline-none dark:bg-slate-950 dark:border-slate-800 transition-all duration-150 ease-out opacity-0 scale-95 data-[state=open]:opacity-100 data-[state=open]:scale-100"
      >
        <BitsDateRangePicker.Calendar>
          {#snippet children({ months, weekdays })}
            {#each months as month (month.value.toString())}
              <div class="w-fit">
                <header class="flex items-center justify-between pb-3">
                  <BitsDateRangePicker.PrevButton
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Icon icon="lucide:chevron-left" class="h-4 w-4" />
                  </BitsDateRangePicker.PrevButton>
                  <BitsDateRangePicker.Heading
                    class="text-sm font-semibold text-slate-900 dark:text-slate-100"
                  />
                  <BitsDateRangePicker.NextButton
                    class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-border bg-transparent text-slate-500 hover:bg-neutral-bg hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  >
                    <Icon icon="lucide:chevron-right" class="h-4 w-4" />
                  </BitsDateRangePicker.NextButton>
                </header>

                <BitsDateRangePicker.Grid class="w-full border-collapse">
                  <BitsDateRangePicker.GridHead>
                    <BitsDateRangePicker.GridRow class="flex pb-2">
                      {#each weekdays as day, i (i)}
                        <BitsDateRangePicker.HeadCell
                          class="w-8 text-center text-[11px] font-medium text-slate-400 dark:text-slate-500"
                        >
                          {day.slice(0, 2)}
                        </BitsDateRangePicker.HeadCell>
                      {/each}
                    </BitsDateRangePicker.GridRow>
                  </BitsDateRangePicker.GridHead>

                  <BitsDateRangePicker.GridBody>
                    {#each month.weeks as weekDates, i (i)}
                      <BitsDateRangePicker.GridRow class="flex w-full mt-1">
                        {#each weekDates as date (date.toString())}
                          <BitsDateRangePicker.Cell
                            {date}
                            month={month.value}
                            class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20
														data-selected:bg-brand-light
														data-highlighted:bg-brand-light
														data-selection-start:rounded-l-lg data-selection-end:rounded-r-lg"
                          >
                            <BitsDateRangePicker.Day
                              class="inline-flex h-8 w-8 items-center justify-center rounded-lg p-0 text-sm font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:outline-none dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100 transition-all cursor-pointer
															data-selected:bg-transparent data-selected:text-brand-text
															data-disabled:text-slate-300 dark:data-disabled:text-slate-700 data-disabled:pointer-events-none data-outside-month:text-slate-300/50 dark:data-outside-month:text-slate-700/50
															data-selection-start:bg-brand-primary! data-selection-start:text-white! data-selection-start:hover:bg-brand-primary! data-selection-start:hover:text-white!
															data-selection-end:bg-brand-primary! data-selection-end:text-white! data-selection-end:hover:bg-brand-primary! data-selection-end:hover:text-white!"
                            />
                          </BitsDateRangePicker.Cell>
                        {/each}
                      </BitsDateRangePicker.GridRow>
                    {/each}
                  </BitsDateRangePicker.GridBody>
                </BitsDateRangePicker.Grid>
              </div>
            {/each}
          {/snippet}
        </BitsDateRangePicker.Calendar>
      </BitsDateRangePicker.Content>
    </div>
  </BitsDateRangePicker.Root>

  {#if error}
    <HelperText variant="error">{error}</HelperText>
  {:else if helperText}
    <HelperText>{helperText}</HelperText>
  {/if}
</div>
