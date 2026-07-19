<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import { fn } from 'storybook/test';
  import Icon from '@iconify/svelte';

  const { Story } = defineMeta({
    title: 'Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
      variant: {
        control: 'select',
        options: ['primary', 'secondary', 'outline', 'ghost', 'danger']
      },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg', 'icon']
      },
      disabled: {
        control: 'boolean'
      },
      isLoading: {
        control: 'boolean'
      },
      loadingText: {
        control: 'text'
      }
    },
    args: {
      onclick: fn()
    }
  });
</script>

<Story name="Primary" args={{ variant: 'primary' }}>Primary Button</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>Secondary Button</Story>

<Story name="Outline" args={{ variant: 'outline' }}>Outline Button</Story>

<Story name="Ghost" args={{ variant: 'ghost' }}>Ghost Button</Story>

<Story name="Danger" args={{ variant: 'danger' }}>Danger Button</Story>

<Story name="Small" args={{ variant: 'primary', size: 'sm' }}>Small Button</Story>

<Story name="Large" args={{ variant: 'primary', size: 'lg' }}>Large Button</Story>

<Story name="Disabled" args={{ variant: 'primary', disabled: true }}>Disabled Button</Story>

<Story name="With Icon Prefix" args={{ variant: 'primary' }}>
  <Icon icon="lucide:mail" class="w-5 h-5" />
  Email Us
</Story>

<Story name="With Icon Suffix" args={{ variant: 'secondary' }}>
  Continue
  <Icon icon="lucide:arrow-right" class="w-5 h-5" />
</Story>

<Story name="Icon Only" args={{ variant: 'outline', size: 'icon' }}>
  <Icon icon="lucide:settings" class="w-5 h-5" />
</Story>

<Story name="Loading State" args={{ variant: 'primary', isLoading: true }}>Submit</Story>

<Story
  name="Loading with Text"
  args={{ variant: 'secondary', isLoading: true, loadingText: 'Saving...' }}
>
  Save Changes
</Story>

<Story name="Loading Icon Only" args={{ variant: 'danger', size: 'icon', isLoading: true }}>
  <Icon icon="lucide:trash" class="w-5 h-5" />
</Story>
