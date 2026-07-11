<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PasswordField from './PasswordField.svelte';
  import Icon from '@iconify/svelte';

  const { Story } = defineMeta({
    title: 'PasswordField',
    component: PasswordField,
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
      label: 'Password',
      placeholder: 'Enter your password',
    }
  });
</script>

<Story name="Default" />

<Story name="With Helper Text" args={{ helperText: 'Must be at least 8 characters long.' }} />

<Story name="Error State" args={{ error: 'Password is too weak.', value: '123' }} />

<Story name="Disabled" args={{ disabled: true, value: 'secret123' }} />

{#snippet prefixLock()}
  <Icon icon="lucide:lock" class="w-5 h-5" />
{/snippet}

<Story name="With Icon Prefix" args={{ prefix: prefixLock }} />
