<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import TextField from './TextField.svelte';
  import Icon from '@iconify/svelte';

  const { Story } = defineMeta({
    title: 'TextField',
    component: TextField,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['default', 'error', 'success'],
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg'],
      },
      disabled: {
        control: 'boolean',
      },
      label: {
        control: 'text',
      },
      placeholder: {
        control: 'text',
      },
      helperText: {
        control: 'text',
      },
      error: {
        control: 'text',
      },
    },
    args: {
      placeholder: 'Enter your text...',
    }
  });
</script>

<Story name="Default" args={{ label: 'Username' }} />

<Story name="With Helper Text" args={{ label: 'Email', helperText: 'We will never share your email with anyone else.', type: 'email' }} />

<Story name="Error State" args={{ label: 'Password', error: 'Password must be at least 8 characters.', type: 'password' }} />

<Story name="Success State" args={{ label: 'Username', variant: 'success', helperText: 'Username is available!' }} />

<Story name="Disabled" args={{ label: 'Employee ID', disabled: true, value: 'EMP-2026-001' }} />

{#snippet prefixSearch()}
  <Icon icon="lucide:search" class="w-5 h-5" />
{/snippet}

{#snippet suffixAmount()}
  <span class="text-sm font-medium">USD</span>
{/snippet}

{#snippet prefixLock()}
  <Icon icon="lucide:lock" class="w-5 h-5" />
{/snippet}

{#snippet suffixCopy()}
  <button class="hover:text-slate-700 transition-colors cursor-pointer" onclick={() => alert('Copied!')}>
    <Icon icon="lucide:copy" class="w-5 h-5" />
  </button>
{/snippet}

<Story name="With Icon Prefix" args={{ label: 'Search', placeholder: 'Search...', prefix: prefixSearch }} />

<Story name="With Icon Suffix" args={{ label: 'Amount', placeholder: '0.00', suffix: suffixAmount }} />

<Story name="Both Icons" args={{ label: 'Secure Link', value: 'https://example.com', readonly: true, prefix: prefixLock, suffix: suffixCopy }} />
