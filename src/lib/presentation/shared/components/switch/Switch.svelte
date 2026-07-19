<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import Label from '../label/Label.svelte';
  import HelperText from '../helpertext/HelperText.svelte';
  import { switchVariants, thumbVariants, type SwitchVariants } from './switch.variants';

  interface Props extends Omit<HTMLInputAttributes, 'type' | 'checked' | 'size'>, SwitchVariants {
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
    variant = 'primary',
    size = 'md',
    class: className = '',
    ref = $bindable(),
    id,
    ...restProps
  }: Props = $props();

  // Generate a unique ID if one isn't provided
  let fallbackId = Math.random().toString(36).substring(2, 9);
  let switchId = $derived(id ?? fallbackId);
  let isRequired = $derived(!!restProps.required);
  let isFocused = $state(false);

  let checkedBg = $derived(
    checked
      ? {
          primary: 'bg-brand-primary',
          danger: 'bg-rose-600',
          success: 'bg-emerald-600'
        }[variant ?? 'primary']
      : 'bg-slate-200 dark:bg-slate-800'
  );

  let thumbTranslate = $derived(
    checked
      ? {
          sm: 'translate-x-3',
          md: 'translate-x-4',
          lg: 'translate-x-5'
        }[size ?? 'md']
      : 'translate-x-0'
  );

  let wrapperHeight = $derived(
    {
      sm: 'h-4',
      md: 'h-5',
      lg: 'h-6'
    }[size ?? 'md']
  );
</script>

<div class="flex items-start gap-3">
  <div class={cn('flex items-center', wrapperHeight)}>
    <div class="relative flex items-center">
      <input
        bind:this={ref}
        id={switchId}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        bind:checked
        class="sr-only"
        onfocus={() => (isFocused = true)}
        onblur={() => (isFocused = false)}
        {...restProps}
      />
      <label
        for={switchId}
        class={cn(
          switchVariants({ variant, size }),
          checkedBg,
          error && 'border border-rose-500 dark:border-rose-500',
          isFocused && 'ring-2 ring-brand-primary/20 ring-offset-1 dark:ring-offset-slate-950',
          restProps.disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <span class={cn(thumbVariants({ size }), thumbTranslate)}></span>
      </label>
    </div>
  </div>

  {#if label || description || error}
    <div class="flex flex-col gap-0.5">
      {#if label}
        <Label for={switchId} required={isRequired}>
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
