<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { ComponentProps } from 'svelte';
  import TextField from '../textfield/TextField.svelte';
  import IMask from 'imask';

  interface Props extends Omit<ComponentProps<typeof TextField>, 'value' | 'type'> {
    value?: number | null;
    currencyPrefix?: string;
  }

  let { value = $bindable(null), currencyPrefix = 'Rp', ...restProps }: Props = $props();

  let inputRef: HTMLInputElement | undefined = $state();
  let maskInstance: ReturnType<typeof IMask> | null = null;

  // Initialize mask when ref is available
  $effect(() => {
    if (inputRef && !maskInstance) {
      maskInstance = IMask(inputRef, {
        mask: Number,
        scale: 0,
        signed: false,
        thousandsSeparator: '.',
        padFractionalZeros: false,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.']
      });

      maskInstance.on('accept', () => {
        const unmasked = maskInstance?.unmaskedValue;
        if (unmasked) {
          value = parseInt(unmasked, 10);
        } else {
          value = null;
        }
      });
    }
  });

  // Sync external value changes to the mask
  $effect(() => {
    if (maskInstance) {
      const strVal = value !== null && value !== undefined ? value.toString() : '';
      if (maskInstance.unmaskedValue !== strVal) {
        maskInstance.unmaskedValue = strVal;
      }
    }
  });

  onDestroy(() => {
    if (maskInstance) {
      maskInstance.destroy();
    }
  });
</script>

<TextField type="text" bind:ref={inputRef} {...restProps}>
  {#snippet prefix()}
    <span class="pl-1 text-sm font-semibold text-slate-500">{currencyPrefix}</span>
  {/snippet}
</TextField>
