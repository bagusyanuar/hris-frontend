<script lang="ts">
  import { fly } from 'svelte/transition';
  import Icon from '@iconify/svelte';

  interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    unread?: boolean;
  }

  interface Props {
    hasUnread?: boolean;
    notifications?: NotificationItem[];
    onNotificationClick?: (notif: NotificationItem) => void;
    onMarkAllRead?: () => void;
    onViewAll?: () => void;
  }

  let {
    hasUnread = true,
    notifications = [
      {
        id: '1',
        title: 'New Employee Onboarding',
        description: 'Please review onboarding documents for Sarah Lincoln.',
        time: '2 mins ago',
        icon: 'lucide:user-plus',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100 dark:bg-emerald-500/20',
        unread: true
      },
      {
        id: '2',
        title: 'Leave Request Pending',
        description: 'John Doe requested 3 days off for vacation.',
        time: '1 hour ago',
        icon: 'lucide:calendar-clock',
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100 dark:bg-amber-500/20',
        unread: false
      }
    ],
    onNotificationClick,
    onMarkAllRead,
    onViewAll
  }: Props = $props();

  let isOpen = $state(false);
  let containerRef = $state<HTMLElement | null>(null);

  function handleWindowClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (isOpen && containerRef && !containerRef.contains(target)) {
      isOpen = false;
    }
  }
</script>

<svelte:window onclick={handleWindowClick} />

<div class="relative" bind:this={containerRef}>
  <button
    onclick={() => (isOpen = !isOpen)}
    class="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative cursor-pointer"
    aria-label="Notifications"
  >
    <Icon icon="lucide:bell" class="w-5 h-5" />
    {#if hasUnread}
      <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
    {/if}
  </button>

  <!-- Notifications Popover -->
  {#if isOpen}
    <div
      transition:fly={{ y: -12, duration: 200 }}
      class="absolute top-full right-0 mt-2 w-72 bg-neutral-card border border-neutral-border rounded-xl shadow-lg z-50 flex flex-col overflow-hidden text-xs"
    >
      <div
        class="px-3 py-2.5 border-b border-neutral-border flex justify-between items-center bg-slate-50 dark:bg-slate-900/40"
      >
        <span class="font-bold text-slate-800 dark:text-slate-100">Notifications</span>
        <button
          onclick={() => {
            onMarkAllRead?.();
            isOpen = false;
          }}
          class="text-[10px] text-emerald-600 font-semibold hover:underline cursor-pointer"
        >
          Mark all read
        </button>
      </div>

      <div class="flex flex-col max-h-[300px] overflow-y-auto no-scrollbar">
        {#each notifications as notif (notif.id)}
          <button
            onclick={() => {
              onNotificationClick?.(notif);
              isOpen = false;
            }}
            class="w-full text-left px-3 py-3 border-b border-neutral-border hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer flex gap-3
							{notif.unread ? 'bg-emerald-500/5 opacity-100' : 'opacity-75'}"
          >
            <div
              class="w-8 h-8 rounded-full {notif.iconBg} {notif.iconColor} flex items-center justify-center shrink-0 mt-0.5"
            >
              <Icon icon={notif.icon} class="w-4 h-4" />
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs text-slate-800 dark:text-slate-200 font-medium"
                >{notif.title}</span
              >
              <span class="text-[10px] text-slate-500 leading-tight mt-0.5"
                >{notif.description}</span
              >
              <span
                class="text-[9px] mt-1.5 font-medium {notif.unread
                  ? 'text-emerald-600'
                  : 'text-slate-400'}">{notif.time}</span
              >
            </div>
          </button>
        {:else}
          <div class="px-3 py-6 text-center text-slate-400">No notifications</div>
        {/each}
      </div>

      <div
        class="px-3 py-2 border-t border-neutral-border text-center bg-slate-50 dark:bg-slate-900/40"
      >
        <button
          onclick={() => {
            onViewAll?.();
            isOpen = false;
          }}
          class="text-[10px] text-slate-500 hover:text-emerald-600 font-semibold cursor-pointer"
        >
          View all notifications
        </button>
      </div>
    </div>
  {/if}
</div>
