<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<div
  class="relative w-44 shrink-0 rounded-3xl border-4 border-slate-900 bg-slate-900 p-1 shadow-2xl shadow-emerald-950/40"
>
  <div class="overflow-hidden rounded-2xl bg-slate-50">
    <!-- Dynamic island -->
    <div class="flex items-center justify-center bg-white pt-2 pb-1.5">
      <span class="h-3 w-12 rounded-full bg-slate-900"></span>
    </div>
    <!-- Extra bottom padding keeps content clear of the action pill overlapping this frame. -->
    <div class="px-2 pt-1 pb-9">
      {@render children()}
    </div>
  </div>
</div>
