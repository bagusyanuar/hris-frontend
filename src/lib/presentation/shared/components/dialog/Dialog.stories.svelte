<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dialog from './Dialog.svelte';
  import Button from '../button/Button.svelte';

  const { Story } = defineMeta({
    title: 'Dialog',
    tags: ['autodocs'],
    argTypes: {
      open: { control: 'boolean' },
      title: { control: 'text' },
      size: {
        control: 'select',
        options: ['sm', 'md', 'lg', 'xl']
      },
      position: {
        control: 'select',
        options: ['center', 'top', 'right']
      },
      closable: { control: 'boolean' }
    }
  });
</script>

<script lang="ts">
  let isDefaultOpen = $state(false);
  let isLargeOpen = $state(false);
  let isTopOpen = $state(false);
  let isRightOpen = $state(false);
  let isNonClosableOpen = $state(false);
</script>

<Story name="Interactive Demo">
  <div class="p-6 space-y-4">
    <Button onclick={() => (isDefaultOpen = true)}>Open Default Dialog (Medium)</Button>

    <Dialog bind:open={isDefaultOpen} title="Default Dialog Title" size="md">
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This is a standard dialog body content. It uses the default medium width configuration and
        supports focus trapping, backdrop closing, and ESC-key closures out-of-the-box.
      </p>
      {#snippet footer()}
        <Button variant="outline" onclick={() => (isDefaultOpen = false)}>Cancel</Button>
        <Button onclick={() => (isDefaultOpen = false)}>Confirm Action</Button>
      {/snippet}
    </Dialog>
  </div>
</Story>

<Story name="Large Size Dialog">
  <div class="p-6">
    <Button onclick={() => (isLargeOpen = true)} variant="secondary">Open Large Dialog</Button>

    <Dialog bind:open={isLargeOpen} title="Large Configuration" size="lg">
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This dialog represents the large size variant (`lg`). It is suitable for displaying data
        tables, larger forms, or detail panels.
      </p>
      {#snippet footer()}
        <Button variant="ghost" onclick={() => (isLargeOpen = false)}>Close</Button>
      {/snippet}
    </Dialog>
  </div>
</Story>

<Story name="Top Positioned Dialog">
  <div class="p-6">
    <Button onclick={() => (isTopOpen = true)} variant="outline">Open Top Dialog</Button>

    <Dialog bind:open={isTopOpen} title="Search / Command Palette" size="md" position="top">
      <p class="text-sm text-slate-600 dark:text-slate-400">
        This dialog is positioned at the top of the screen (`position="top"`). It is ideal for
        search bars, quick action command palettes, or minimal notifications.
      </p>
      {#snippet footer()}
        <Button variant="outline" onclick={() => (isTopOpen = false)}>Cancel</Button>
      {/snippet}
    </Dialog>
  </div>
</Story>

<Story name="Right Drawer Dialog">
  <div class="p-6">
    <Button onclick={() => (isRightOpen = true)}>Open Right Drawer</Button>

    <Dialog bind:open={isRightOpen} title="Employee Details" size="sm" position="right">
      <div class="space-y-4">
        <p class="text-sm text-slate-600 dark:text-slate-400">
          This dialog acts as a slide-out drawer (`position="right"`). It takes full screen height
          and slides smoothly from the right side.
        </p>
        <div class="border border-neutral-border rounded-lg p-3 bg-neutral-bg">
          <p class="text-xs text-slate-500">Karyawan Info</p>
          <p class="text-sm font-semibold">Bagus Yanuar</p>
        </div>
      </div>
      {#snippet footer()}
        <Button variant="outline" class="w-full" onclick={() => (isRightOpen = false)}
          >Close Drawer</Button
        >
      {/snippet}
    </Dialog>
  </div>
</Story>

<Story name="Non-Closable Dialog">
  <div class="p-6">
    <Button onclick={() => (isNonClosableOpen = true)} variant="danger">
      Open Non-Closable Dialog
    </Button>

    <Dialog
      bind:open={isNonClosableOpen}
      title="Important Action Required"
      size="sm"
      closable={false}
    >
      <p class="text-sm text-slate-600 dark:text-slate-400 mb-4">
        This dialog cannot be closed by pressing ESC or clicking on the backdrop (`closable={'{false}'}`).
        You must explicitly interact with the action buttons below to proceed.
      </p>
      {#snippet footer()}
        <Button variant="ghost" onclick={() => (isNonClosableOpen = false)}>Cancel</Button>
        <Button variant="danger" onclick={() => (isNonClosableOpen = false)}>
          Confirm Acknowledge
        </Button>
      {/snippet}
    </Dialog>
  </div>
</Story>
