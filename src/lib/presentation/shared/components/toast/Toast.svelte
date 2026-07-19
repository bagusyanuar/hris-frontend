<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import Icon from '@iconify/svelte';
  import { toast, type Toast } from './ToastStore.svelte.ts';

  interface Props {
    item: Toast;
  }

  let { item }: Props = $props();

  // Map Toast type to theme icon and colors
  const config = $derived.by(() => {
    switch (item.type) {
      case 'success':
        return {
          icon: 'lucide:check-circle-2',
          iconClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
        };
      case 'error':
        return {
          icon: 'lucide:alert-circle',
          iconClass: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
        };
      case 'warning':
        return {
          icon: 'lucide:alert-triangle',
          iconClass: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
        };
      case 'info':
      default:
        return {
          icon: 'lucide:info',
          iconClass: 'text-sky-500 bg-sky-50 dark:bg-sky-950/30'
        };
    }
  });

  function handleDismiss() {
    toast.dismiss(item.id);
  }
</script>

<div
  transition:fly={{ y: 20, duration: 300 }}
  class="flex w-full max-w-sm gap-3 rounded-xl border border-neutral-border bg-neutral-card/90 p-4 shadow-lg backdrop-blur-md transition-all duration-200 hover:shadow-xl pointer-events-auto"
  role="alert"
>
  <!-- Status Icon -->
  <div class="flex shrink-0 items-center justify-center">
    <div class="flex h-9 w-9 items-center justify-center rounded-lg {config.iconClass}">
      <Icon icon={config.icon} class="h-5 w-5" />
    </div>
  </div>

  <!-- Text Content -->
  <div class="flex-1 min-w-0 flex flex-col justify-center">
    {#if item.title}
      <Typography variant="body-sm" weight="semibold" class="text-slate-900 dark:text-slate-100">
        {item.title}
      </Typography>
    {/if}
    <Typography variant="caption" color="muted" class="mt-0.5 leading-snug">
      {item.message}
    </Typography>
  </div>

  <!-- Dismiss Button -->
  <div class="flex shrink-0 items-start">
    <button
      type="button"
      class="inline-flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      onclick={handleDismiss}
      aria-label="Dismiss notification"
    >
      <Icon icon="lucide:x" class="h-4 w-4" />
    </button>
  </div>
</div>
