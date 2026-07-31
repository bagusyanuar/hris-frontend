<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import type { JobPositionModel } from '$lib/core/job-position/job-position.model';

  let { isOpen = $bindable(), onClose } = $props<{
    isOpen: boolean;
    position: JobPositionModel | null;
    onClose: () => void;
  }>();
</script>

{#if isOpen}
  <div
    class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
  >
    <div class="p-6 border-b border-slate-100 dark:border-slate-800">
      <Typography variant="h4">Detail Posisi</Typography>
    </div>
    <div class="flex-1 p-6 overflow-y-auto">
      <Typography variant="body-sm" color="secondary">Placeholder for details drawer.</Typography>
    </div>
    <div class="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
      <button
        class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
        onclick={onClose}
      >
        Tutup
      </button>
    </div>
  </div>
{/if}
