<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import Icon from '@iconify/svelte';

  let { icon, title, value, colorClass }: { icon: string; title: string; value: number | string; colorClass: string } = $props();
</script>

<Card variant="default" padding="md">
  <div class="flex items-center gap-2 {colorClass}">
    <Icon {icon} class="w-5 h-5" />
    <Typography variant="caption" weight="bold">{title}</Typography>
  </div>
  <Typography variant="h3" class="mt-2">{value}</Typography>
</Card>
