<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CurrencyField from './CurrencyField.svelte';

  const { Story } = defineMeta({
    title: 'CurrencyField',
    component: CurrencyField,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['default', 'error', 'success']
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg']
      },
      disabled: {
        control: 'boolean'
      },
      label: {
        control: 'text'
      },
      placeholder: {
        control: 'text'
      },
      helperText: {
        control: 'text'
      },
      error: {
        control: 'text'
      },
      value: {
        control: 'number'
      },
      currencyPrefix: {
        control: 'text'
      }
    },
    args: {
      label: 'Salary',
      placeholder: '0'
    }
  });
</script>

<Story name="Default" />

<Story name="With Initial Value" args={{ value: 15000000 }} />

<Story
  name="Custom Currency (USD)"
  args={{ currencyPrefix: '$', label: 'Budget', value: 500000 }}
/>

<Story name="Error State" args={{ error: 'Amount exceeds maximum limit.', value: 999999999 }} />

<Story name="Disabled" args={{ disabled: true, value: 50000 }} />
