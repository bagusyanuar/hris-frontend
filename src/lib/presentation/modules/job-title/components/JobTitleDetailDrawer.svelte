<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Drawer } from '$lib/presentation/shared/components/drawer';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import type { JobTitleModel } from '$lib/core/job-title';

  interface Props {
    isOpen: boolean;
    jobTitle: JobTitleModel | null;
    onClose: () => void;
  }

  let { isOpen, jobTitle, onClose }: Props = $props();
</script>

<Drawer {isOpen} {onClose} title="Detail Job Title">
  {#if jobTitle}
    <div class="flex flex-col gap-6">
      <!-- Header Profile -->
      <div class="flex items-start gap-4">
        <div
          class="h-16 w-16 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0"
        >
          <Icon icon="lucide:award" class="w-8 h-8" />
        </div>
        <div class="flex flex-col gap-1.5 pt-1">
          <Typography variant="h4" weight="semibold">{jobTitle.name}</Typography>
          <div class="flex items-center gap-2">
            <span
              class="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 font-mono dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs"
            >
              {jobTitle.code}
            </span>
            <Badge variant={jobTitle.status === 'active' ? 'success' : 'default'}>
              <Icon
                icon={jobTitle.status === 'active'
                  ? 'lucide:check-circle-2'
                  : 'lucide:minus-circle'}
                class="w-3.5 h-3.5"
              />
              {jobTitle.status === 'active' ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

      <!-- Info Section -->
      <div class="flex flex-col gap-4">
        <Typography variant="h6" weight="semibold">Informasi Jabatan</Typography>

        <div
          class="grid gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800"
        >
          <div class="flex flex-col gap-1">
            <span class="text-sm text-slate-500">Deskripsi</span>
            <span
              class="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line"
            >
              {jobTitle.description || 'Tidak ada deskripsi'}
            </span>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-sm text-slate-500">Dibuat Pada</span>
            <span class="text-sm font-medium text-slate-900 dark:text-slate-100">
              {jobTitle.createdAt
                ? new Date(jobTitle.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</Drawer>
