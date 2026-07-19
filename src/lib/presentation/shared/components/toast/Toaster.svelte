<script lang="ts">
  import { toast } from './ToastStore.svelte.ts';
  import ToastCard from './Toast.svelte';

  type ToastPosition =
    'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

  let { position = 'bottom-right' }: { position?: ToastPosition } = $props();

  const positionClasses: Record<ToastPosition, string> = {
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0'
  };
</script>

<div
  class="fixed z-100 flex w-full max-w-md flex-col gap-3 p-4 pointer-events-none sm:p-6 {positionClasses[
    position
  ]}"
  aria-live="assertive"
>
  {#each toast.toasts as item (item.id)}
    <ToastCard {item} />
  {/each}
</div>
