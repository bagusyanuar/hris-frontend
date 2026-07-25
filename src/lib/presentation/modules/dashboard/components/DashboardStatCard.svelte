<script lang="ts">
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import Icon from '@iconify/svelte';

  interface Props {
    title: string;
    value: string | number;
    subtext?: string;
    icon: string;
    iconColor?: string;
    trendText?: string;
    trendVariant?: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  }

  let {
    title,
    value,
    subtext,
    icon,
    iconColor = 'text-brand-primary bg-brand-light',
    trendText,
    trendVariant = 'success'
  }: Props = $props();
</script>

<Card variant="glow" hoverable={true} padding="md" class="relative overflow-hidden transition-all duration-200">
  <div class="flex items-center justify-between">
    <Typography variant="caption" color="secondary" weight="medium">{title}</Typography>
    <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 {iconColor}">
      <Icon {icon} class="w-5 h-5" />
    </div>
  </div>

  <div class="mt-3 flex items-baseline gap-2 flex-wrap">
    <Typography variant="h3" weight="bold" class="text-slate-900 dark:text-slate-50">
      {value}
    </Typography>
    {#if trendText}
      <Badge variant={trendVariant} size="sm">
        {trendText}
      </Badge>
    {/if}
  </div>

  {#if subtext}
    <div class="mt-2">
      <Typography variant="caption" color="muted" class="text-[11px]">{subtext}</Typography>
    </div>
  {/if}
</Card>
