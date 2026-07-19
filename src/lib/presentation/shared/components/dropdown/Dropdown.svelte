<script lang="ts" module>
  // Click outside Svelte action
  export function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
        callback();
      }
    };
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }

  // Portal Svelte action
  export function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      }
    };
  }
</script>

<script lang="ts">
  import { type Snippet } from 'svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';

  interface Props {
    align?: 'left' | 'right';
    portal?: boolean;
    class?: string;
    trigger: Snippet<[toggle: () => void, isOpen: boolean]>;
    content: Snippet;
  }

  let {
    align = 'left',
    portal: usePortal = true,
    class: className = '',
    trigger,
    content
  }: Props = $props();

  let isOpen = $state(false);
  let triggerEl: HTMLElement | undefined = $state();
  let menuEl: HTMLElement | undefined = $state();
  let coords = $state({ top: 0, left: 0, width: 0 });

  function toggle() {
    isOpen = !isOpen;
  }

  function close() {
    isOpen = false;
  }

  function updatePosition() {
    if (!triggerEl || !menuEl) return;
    const triggerRect = triggerEl.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    let top = triggerRect.bottom + scrollY;
    let left = triggerRect.left + scrollX;
    const menuWidth = menuEl.offsetWidth;

    if (align === 'right') {
      left = triggerRect.right + scrollX - menuWidth;
    }

    coords = { top, left, width: triggerRect.width };
  }

  // Monitor position updates on scroll/resize when open
  $effect(() => {
    if (isOpen) {
      // Small timeout to allow element rendering and sizing measurements
      setTimeout(updatePosition, 0);

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  });

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={triggerEl}
  class={cn('inline-block', className)}
  use:clickOutside={close}
  onkeydown={handleKeyDown}
>
  {@render trigger(toggle, isOpen)}

  {#if usePortal}
    <div
      use:portal
      bind:this={menuEl}
      style:position="absolute"
      style:top="{coords.top}px"
      style:left="{coords.left}px"
      class="dropdown-menu z-50 mt-1.5 min-w-[200px] rounded-lg border border-neutral-border bg-neutral-card p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
      class:show={isOpen}
      role="menu"
      tabindex="-1"
    >
      {@render content()}
    </div>
  {:else}
    <div
      bind:this={menuEl}
      class={cn(
        'dropdown-menu z-50 mt-1.5 min-w-[200px] rounded-lg border border-neutral-border bg-neutral-card p-1 shadow-lg dark:border-slate-800 dark:bg-slate-900',
        align === 'right' ? 'right-0' : 'left-0'
      )}
      class:show={isOpen}
      role="menu"
      tabindex="-1"
    >
      {@render content()}
    </div>
  {/if}
</div>

<style>
  .dropdown-menu {
    transition:
      opacity 200ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 200ms cubic-bezier(0.4, 0, 0.2, 1),
      display 200ms allow-discrete;
    opacity: 0;
    transform: translateY(-8px);
    display: none;
  }

  .dropdown-menu.show {
    display: block;
    opacity: 1;
    transform: translateY(0);
  }

  @starting-style {
    .dropdown-menu.show {
      opacity: 0;
      transform: translateY(-8px);
    }
  }
</style>
