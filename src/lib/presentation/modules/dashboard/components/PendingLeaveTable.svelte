<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import { Button } from '$lib/presentation/shared/components/button';
  import { Avatar } from '$lib/presentation/shared/components/avatar';
  import { toast } from '$lib/presentation/shared/components/toast';
  import type { PendingLeaveRequest } from '../runes/dashboard-query.svelte';

  interface Props {
    requests: PendingLeaveRequest[];
  }

  let { requests }: Props = $props();

  // Declared with `let` so it can be reassigned locally.
  // Stays in sync automatically when `requests` prop changes.
  let requestsList = $derived([...requests]);

  function handleApprove(req: PendingLeaveRequest) {
    // Optimistically update the UI by overriding the derived state
    requestsList = requestsList.filter((r) => r.id !== req.id);
    toast.success(`Pengajuan cuti ${req.name} telah disetujui`);
  }

  function handleReject(req: PendingLeaveRequest) {
    // Optimistically update the UI by overriding the derived state
    requestsList = requestsList.filter((r) => r.id !== req.id);
    toast.info(`Pengajuan cuti ${req.name} ditolak`);
  }

  function getLeaveBadgeVariant(
    type: string
  ): 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' {
    const lower = type.toLowerCase();
    if (lower.includes('sakit')) return 'danger';
    if (lower.includes('melahirkan')) return 'success';
    if (lower.includes('tahunan')) return 'info';
    return 'default';
  }
</script>

<Card variant="accent-warning" padding="md" class="flex flex-col gap-4 h-full">
  <div class="flex items-center justify-between border-b border-neutral-border pb-3">
    <div class="flex items-center gap-2">
      <Typography variant="h6" weight="bold">Pengajuan Cuti Menunggu Persetujuan</Typography>
      <Badge variant="warning" size="sm">{requestsList.length}</Badge>
    </div>
    <Button variant="ghost" size="sm" class="text-xs">Lihat Semua</Button>
  </div>

  {#if requestsList.length === 0}
    <div class="py-8 text-center">
      <Typography variant="body-sm" color="muted">
        Tidak ada pengajuan cuti yang perlu diproses saat ini.
      </Typography>
    </div>
  {:else}
    <div class="overflow-x-auto flex-1">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr
            class="text-slate-400 dark:text-slate-500 font-semibold border-b border-neutral-border pb-2"
          >
            <th class="py-2 font-semibold">Karyawan</th>
            <th class="py-2 font-semibold">Jenis Cuti</th>
            <th class="py-2 font-semibold">Durasi</th>
            <th class="py-2 font-semibold text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-neutral-border">
          {#each requestsList as req (req.id)}
            <tr class="hover:bg-neutral-bg/50 transition-colors">
              <td class="py-3 pr-2">
                <div class="flex items-center gap-3">
                  <Avatar name={req.name} src={req.avatar} size="sm" />
                  <div class="flex flex-col">
                    <Typography
                      variant="body-sm"
                      weight="bold"
                      class="text-slate-800 dark:text-slate-200"
                    >
                      {req.name}
                    </Typography>
                    <Typography variant="caption" color="muted" class="text-[10px]">
                      {req.role}
                    </Typography>
                  </div>
                </div>
              </td>
              <td class="py-3 px-2">
                <Badge variant={getLeaveBadgeVariant(req.type)} size="sm">{req.type}</Badge>
              </td>
              <td class="py-3 px-2">
                <Typography variant="body-sm" color="secondary">
                  {req.duration}
                </Typography>
              </td>
              <td class="py-3 pl-2 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <Button
                    size="sm"
                    variant="primary"
                    class="h-7 px-2.5 text-[11px]"
                    onclick={() => handleApprove(req)}
                  >
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    class="h-7 px-2.5 text-[11px]"
                    onclick={() => handleReject(req)}
                  >
                    Tolak
                  </Button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</Card>
