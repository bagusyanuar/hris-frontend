<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    class?: string;
  }

  let { children, class: className = '' }: Props = $props();
</script>

<header
  class="h-16 shrink-0 bg-neutral-card border border-neutral-border rounded-xl flex items-center justify-between px-6 z-30 transition-colors duration-200 {className}"
>
  {@render children?.()}
</header>
