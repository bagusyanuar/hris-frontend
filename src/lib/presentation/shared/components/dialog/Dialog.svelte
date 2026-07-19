<script lang="ts">
  import { type Snippet } from 'svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import Icon from '@iconify/svelte';
  import { dialogVariants } from './dialog.variants';

  interface Props {
    open: boolean;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    position?: 'center' | 'top' | 'right';
    closable?: boolean;
    children: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    title,
    size = 'md',
    position = 'center',
    closable = true,
    children,
    footer,
    onclose
  }: Props = $props();

  let dialogElement: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (open) {
      if (dialogElement && !dialogElement.open) {
        dialogElement.showModal();
      }
    } else {
      if (dialogElement && dialogElement.open) {
        dialogElement.close();
      }
    }
  });

  function handleClose() {
    open = false;
    onclose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (closable && e.target === dialogElement) {
      handleClose();
    }
  }
</script>

<dialog
  bind:this={dialogElement}
  onclose={handleClose}
  onclick={handleBackdropClick}
  oncancel={(e) => {
    if (!closable) {
      e.preventDefault();
    }
  }}
  class={cn(dialogVariants({ size, position }), `pos-${position}`)}
>
  <!-- Header -->
  {#if title || closable}
    <div class="flex items-center justify-between border-b border-neutral-border px-5 py-3.5">
      {#if title}
        <Typography variant="h4" weight="semibold" color="primary">
          {title}
        </Typography>
      {:else}
        <div></div>
      {/if}
      {#if closable}
        <button
          type="button"
          onclick={handleClose}
          class="rounded-lg p-1 text-slate-400 hover:bg-neutral-bg hover:text-slate-600 transition-colors duration-200 focus:outline-none cursor-pointer"
          aria-label="Close dialog"
        >
          <Icon icon="lucide:x" class="h-5 w-5" />
        </button>
      {/if}
    </div>
  {/if}

  <!-- Body -->
  <div class="px-5 py-4 overflow-y-auto max-h-[70vh]">
    {@render children()}
  </div>

  <!-- Footer -->
  {#if footer}
    <div
      class="flex justify-end gap-3 border-t border-neutral-border bg-slate-50/50 dark:bg-slate-900/20 px-5 py-3.5"
    >
      {@render footer()}
    </div>
  {/if}
</dialog>

<style>
  dialog {
    transition:
      opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
      display 300ms allow-discrete,
      overlay 300ms allow-discrete;
    opacity: 0;
  }

  /* center position */
  dialog.pos-center {
    transform: scale(0.95);
  }
  dialog.pos-center[open] {
    opacity: 1;
    transform: scale(1);
  }
  @starting-style {
    dialog.pos-center[open] {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  /* top position */
  dialog.pos-top {
    transform: translateY(-30px);
  }
  dialog.pos-top[open] {
    opacity: 1;
    transform: translateY(0);
  }
  @starting-style {
    dialog.pos-top[open] {
      opacity: 0;
      transform: translateY(-30px);
    }
  }

  /* right position */
  dialog.pos-right {
    transform: translateX(100%);
  }
  dialog.pos-right[open] {
    opacity: 1;
    transform: translateX(0);
  }
  @starting-style {
    dialog.pos-right[open] {
      opacity: 0;
      transform: translateX(100%);
    }
  }

  /* Backdrop */
  dialog::backdrop {
    transition:
      background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
      backdrop-filter 300ms cubic-bezier(0.4, 0, 0.2, 1),
      display 300ms allow-discrete,
      overlay 300ms allow-discrete;
    background-color: transparent;
    backdrop-filter: blur(0px);
  }
  dialog[open]::backdrop {
    background-color: rgba(2, 6, 23, 0.4); /* slate-950/40 */
    backdrop-filter: blur(4px); /* backdrop-blur-xs */
  }
  @starting-style {
    dialog[open]::backdrop {
      background-color: transparent;
      backdrop-filter: blur(0px);
    }
  }
</style>
