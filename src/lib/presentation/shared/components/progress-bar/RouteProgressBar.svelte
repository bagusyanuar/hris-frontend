<script lang="ts">
  import { beforeNavigate, afterNavigate } from '$app/navigation';
  import { onDestroy } from 'svelte';

  let progress = $state(0);
  let visible = $state(false);
  let interval: ReturnType<typeof setInterval> | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  beforeNavigate(() => {
    if (timeout) clearTimeout(timeout);
    visible = true;
    progress = 20;

    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (progress < 90) {
        progress += (90 - progress) * 0.15;
      }
    }, 80);
  });

  afterNavigate(() => {
    if (interval) clearInterval(interval);
    if (visible) {
      progress = 100;
      timeout = setTimeout(() => {
        visible = false;
        progress = 0;
      }, 300);
    }
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
    if (timeout) clearTimeout(timeout);
  });
</script>

{#if visible}
  <div
    class="pointer-events-none fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent"
    aria-hidden="true"
  >
    <div
      class="h-full bg-brand-primary shadow-[0_0_10px_rgba(79,70,229,0.5)] transition-all duration-300 ease-out"
      style="width: {progress}%; opacity: {progress === 100 ? 0 : 1};"
    ></div>
  </div>
{/if}
