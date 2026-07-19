<script lang="ts">
  import { cn } from '$lib/presentation/shared/utils/cn';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<div class={cn('my-1 h-px bg-neutral-border dark:bg-slate-800', className)} role="separator"></div>
