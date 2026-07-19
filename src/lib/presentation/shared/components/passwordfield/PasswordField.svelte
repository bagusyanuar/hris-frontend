<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import TextField from '../textfield/TextField.svelte';
  import Icon from '@iconify/svelte';

  // Omit type and suffix, as PasswordField handles them internally
  type Props = Omit<ComponentProps<typeof TextField>, 'type' | 'suffix'>;

  let { value = $bindable(), ...restProps }: Props = $props();

  let showPassword = $state(false);

  function togglePassword() {
    showPassword = !showPassword;
  }
</script>

<TextField type={showPassword ? 'text' : 'password'} bind:value {...restProps}>
  {#snippet suffix()}
    <button
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary dark:hover:bg-slate-800 dark:hover:text-slate-300"
      onclick={togglePassword}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      title={showPassword ? 'Hide password' : 'Show password'}
    >
      <Icon icon={showPassword ? 'lucide:eye-off' : 'lucide:eye'} class="h-4 w-4" />
    </button>
  {/snippet}
</TextField>
