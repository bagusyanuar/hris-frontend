<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Toast',
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  import Toast from './Toast.svelte';
  import Toaster from './Toaster.svelte';
  import { toast } from './ToastStore.svelte.ts';
  import Button from '../button/Button.svelte';
</script>

<Story name="Success">
  <div class="max-w-sm">
    <Toast
      item={{
        id: '1',
        type: 'success',
        title: 'Success Notification',
        message: 'Your changes have been saved successfully.'
      }}
    />
  </div>
</Story>

<Story name="Error">
  <div class="max-w-sm">
    <Toast
      item={{
        id: '2',
        type: 'error',
        title: 'Error Occurred',
        message: 'Failed to update user profile. Please try again.'
      }}
    />
  </div>
</Story>

<Story name="Warning">
  <div class="max-w-sm">
    <Toast
      item={{
        id: '3',
        type: 'warning',
        title: 'Warning',
        message: 'Your session will expire in 5 minutes.'
      }}
    />
  </div>
</Story>

<Story name="Info">
  <div class="max-w-sm">
    <Toast
      item={{
        id: '4',
        type: 'info',
        title: 'New Update',
        message: 'A new software version is available.'
      }}
    />
  </div>
</Story>

<Story name="Message Only">
  <div class="max-w-sm">
    <Toast
      item={{
        id: '5',
        type: 'info',
        message: 'This is a simple message notification without a title.'
      }}
    />
  </div>
</Story>

<Story name="Interactive Demo">
  <div
    class="relative w-full h-[300px] border border-dashed border-neutral-border rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-4 overflow-hidden"
  >
    <div class="flex flex-wrap gap-2 justify-center z-10">
      <Button
        variant="primary"
        onclick={() => toast.success('Data saved successfully!', 'Success')}
      >
        Trigger Success
      </Button>
      <Button variant="danger" onclick={() => toast.error('Something went wrong.', 'Error')}>
        Trigger Error
      </Button>
      <Button
        variant="outline"
        class="border-amber-500 text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20"
        onclick={() => toast.warning('Storage is almost full.', 'Warning')}
      >
        Trigger Warning
      </Button>
      <Button variant="secondary" onclick={() => toast.info('System update at 12:00 PM.', 'Info')}>
        Trigger Info
      </Button>
    </div>

    <Toaster position="bottom-right" />
  </div>
</Story>
