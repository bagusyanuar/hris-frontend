<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { buttonVariants, type ButtonVariants } from './button.variants';

  interface Props extends HTMLButtonAttributes, ButtonVariants {
    children?: Snippet;
  }

  let {
    variant,
    size,
    class: className = '',
    children,
    type = 'button',
    ...restProps
  }: Props = $props();
</script>

<button
  {type}
  class={cn(buttonVariants({ variant, size }), className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>
