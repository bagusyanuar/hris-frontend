<script lang="ts">
  import Icon from '@iconify/svelte';

  interface Props {
    isDark: boolean;
    ontoggle?: () => void;
  }

  let { isDark = $bindable(false), ontoggle }: Props = $props();

  function handleClick() {
    isDark = !isDark;
    if (ontoggle) {
      ontoggle();
    } else {
      const html = document.documentElement;
      if (isDark) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
</script>

<button
  onclick={handleClick}
  class="p-2 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
  title="Toggle Theme"
>
  <Icon icon={isDark ? 'lucide:sun' : 'lucide:moon'} class="w-5 h-5" />
</button>
