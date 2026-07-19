<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { textfieldInputVariants, type TextfieldInputVariants } from './textfield.variants';
  import Label from '../label/Label.svelte';
  import HelperText from '../helpertext/HelperText.svelte';

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
    required,
    ...restProps
  }: Props = $props();

  // Generate a unique ID if one isn't provided (for linking label to input)
  let fallbackId = Math.random().toString(36).substring(2, 9);
  let inputId = $derived(id ?? fallbackId);

  // Error state overrides the variant
  let currentVariant = $derived(error ? 'error' : variant);

  // Check if input is required to show the asterisk on the label
  let isRequired = $derived(!!required);
</script>

<div class={cn('flex w-full flex-col gap-1.5', wrapperClass)}>
  {#if label}
    <Label for={inputId} required={isRequired}>
      {label}
    </Label>
  {/if}

  <div class="relative flex items-center">
    {#if prefix}
      <div
        class="pointer-events-none absolute left-3 z-10 flex items-center justify-center text-slate-500"
      >
        {@render prefix()}
      </div>
    {/if}

    <input
      bind:this={ref}
      id={inputId}
      {type}
      bind:value
      aria-required={required ? 'true' : undefined}
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
    <HelperText variant="error">{error}</HelperText>
  {:else if helperText}
    <HelperText>{helperText}</HelperText>
  {/if}
</div>
