<script lang="ts">
  import Icon from '@iconify/svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { avatarVariants, type AvatarVariants } from './avatar.variants';

  interface Props extends AvatarVariants {
    src?: string | null;
    alt?: string;
    name?: string | null;
    initials?: string;
    class?: string;
  }

  let {
    src,
    alt = 'Avatar',
    name,
    initials,
    size = 'md',
    variant = 'default',
    class: className = ''
  }: Props = $props();

  let imgError = $state(false);

  function getInitials(nameStr?: string | null) {
    if (!nameStr) return null;
    const parts = nameStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return null;
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const displayInitials = $derived(initials || (name ? getInitials(name) : null));
</script>

<div class={cn(avatarVariants({ size, variant }), className)}>
  {#if src && !imgError}
    <img
      {src}
      {alt}
      class="h-full w-full object-cover rounded-full"
      onerror={() => (imgError = true)}
    />
  {:else if displayInitials}
    <span class="font-medium tracking-wide">
      {displayInitials}
    </span>
  {:else}
    <Icon icon="lucide:user" class="w-[55%] h-[55%] opacity-40" />
  {/if}
</div>
