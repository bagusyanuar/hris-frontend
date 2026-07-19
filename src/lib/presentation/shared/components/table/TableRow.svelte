<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { rowVariants, type RowVariants } from './table.variants';

  interface Props extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onclick'>, RowVariants {
    children?: Snippet;
    onclick?: (e: MouseEvent) => void;
  }

  let {
    hoverable = false,
    selected = false,
    striped = false,
    class: className = '',
    children,
    onclick,
    ...restProps
  }: Props = $props();
</script>

<tr
  class={cn(
    rowVariants({
      hoverable: hoverable || !!onclick,
      selected,
      striped
    }),
    className
  )}
  {onclick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</tr>
