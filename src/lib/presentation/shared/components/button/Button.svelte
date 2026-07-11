<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { buttonVariants, type ButtonVariants } from './button.variants';
  import Icon from '@iconify/svelte';

  interface Props extends HTMLButtonAttributes, ButtonVariants {
    children?: Snippet;
    isLoading?: boolean;
    loadingText?: string;
  }

  let {
    variant,
    size,
    class: className = '',
    children,
    type = 'button',
    isLoading = false,
    loadingText,
    ...restProps
  }: Props = $props();
</script>

<button
  {type}
  class={cn(buttonVariants({ variant, size }), className)}
  disabled={restProps.disabled || isLoading}
  {...restProps}
>
  {#if isLoading}
    <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
    {#if size !== 'icon'}
      {#if loadingText}
        {loadingText}
      {:else if children}
        {@render children()}
      {/if}
    {/if}
  {:else if children}
    {@render children()}
  {/if}
</button>
