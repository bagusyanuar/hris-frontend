<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className = '', ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class="animate-pulse rounded-md bg-slate-200 dark:bg-slate-800 {className}" {...rest}></div>
