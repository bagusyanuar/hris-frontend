<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dropdown from './Dropdown.svelte';

  const { Story } = defineMeta({
    title: 'Dropdown',
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  import DropdownItem from './DropdownItem.svelte';
  import DropdownDivider from './DropdownDivider.svelte';
  import Button from '$lib/presentation/shared/components/button/Button.svelte';
  import Icon from '@iconify/svelte';

  function handleAction(name: string) {
    alert(`Clicked: ${name}`);
  }
</script>

<Story name="Default">
  <div class="h-64 flex items-start justify-start p-4">
    <Dropdown>
      {#snippet trigger(toggle)}
        <Button onclick={toggle} variant="primary" size="md">
          Options
          <Icon icon="lucide:chevron-down" class="ml-2 h-4 w-4" />
        </Button>
      {/snippet}

      {#snippet content()}
        <DropdownItem onclick={() => handleAction('Profile')}>
          <Icon icon="lucide:user" class="h-4 w-4 text-slate-400" />
          <span>View Profile</span>
        </DropdownItem>
        <DropdownItem onclick={() => handleAction('Settings')}>
          <Icon icon="lucide:settings" class="h-4 w-4 text-slate-400" />
          <span>Account Settings</span>
        </DropdownItem>
        <DropdownDivider />
        <DropdownItem onclick={() => handleAction('Delete')} variant="danger">
          <Icon icon="lucide:trash" class="h-4 w-4 text-rose-500" />
          <span>Delete Account</span>
        </DropdownItem>
      {/snippet}
    </Dropdown>
  </div>
</Story>

<Story name="Alignments">
  <div class="h-64 flex items-start justify-between p-4 max-w-xl">
    <div>
      <p class="text-xs text-slate-500 mb-2">Align Left (Default)</p>
      <Dropdown align="left">
        {#snippet trigger(toggle)}
          <Button onclick={toggle} variant="outline" size="md">Left Align</Button>
        {/snippet}
        {#snippet content()}
          <DropdownItem onclick={() => {}}>Item One</DropdownItem>
          <DropdownItem onclick={() => {}}>Item Two</DropdownItem>
        {/snippet}
      </Dropdown>
    </div>

    <div>
      <p class="text-xs text-slate-500 mb-2 text-right">Align Right</p>
      <Dropdown align="right">
        {#snippet trigger(toggle)}
          <Button onclick={toggle} variant="outline" size="md">Right Align</Button>
        {/snippet}
        {#snippet content()}
          <DropdownItem onclick={() => {}}>Item One</DropdownItem>
          <DropdownItem onclick={() => {}}>Item Two</DropdownItem>
        {/snippet}
      </Dropdown>
    </div>
  </div>
</Story>

<Story name="In Scrollable Table (Overflow Safe)">
  <div class="space-y-4">
    <p class="text-sm text-slate-500 max-w-lg">
      This table has <code>overflow-x-auto</code>. A standard absolute dropdown would be cut off by
      the table container, but because our dropdown is portaled to the document body, it floats
      correctly over the boundary.
    </p>

    <div class="w-full overflow-x-auto border border-neutral-border rounded-xl bg-neutral-card">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr class="border-b border-neutral-border bg-slate-50 dark:bg-slate-900/30">
            <th class="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >Employee</th
            >
            <th class="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
            <th class="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th
            >
            <th class="p-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right"
              >Actions</th
            >
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-neutral-border last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10"
          >
            <td class="p-3 text-sm font-medium text-slate-900 dark:text-slate-100">Bagus Yanuar</td>
            <td class="p-3 text-sm text-slate-500">Software Engineer</td>
            <td class="p-3 text-sm">
              <span
                class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >Active</span
              >
            </td>
            <td class="p-3 text-right">
              <Dropdown align="right" portal={true}>
                {#snippet trigger(toggle)}
                  <button
                    onclick={toggle}
                    class="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer"
                    aria-label="Actions"
                  >
                    <Icon icon="lucide:more-vertical" class="h-5 w-5" />
                  </button>
                {/snippet}
                {#snippet content()}
                  <DropdownItem onclick={() => handleAction('Edit Bagus')}>
                    <Icon icon="lucide:edit-2" class="h-4 w-4 text-slate-400" />
                    <span>Edit Profile</span>
                  </DropdownItem>
                  <DropdownItem onclick={() => handleAction('Change Role Bagus')}>
                    <Icon icon="lucide:shield" class="h-4 w-4 text-slate-400" />
                    <span>Permissions</span>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onclick={() => handleAction('Deactivate Bagus')} variant="danger">
                    <Icon icon="lucide:user-minus" class="h-4 w-4 text-rose-500" />
                    <span>Deactivate Karyawan</span>
                  </DropdownItem>
                {/snippet}
              </Dropdown>
            </td>
          </tr>
          <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
            <td class="p-3 text-sm font-medium text-slate-900 dark:text-slate-100">Jane Doe</td>
            <td class="p-3 text-sm text-slate-500">Product Manager</td>
            <td class="p-3 text-sm">
              <span
                class="inline-flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                >Active</span
              >
            </td>
            <td class="p-3 text-right">
              <Dropdown align="right" portal={true}>
                {#snippet trigger(toggle)}
                  <button
                    onclick={toggle}
                    class="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 cursor-pointer"
                    aria-label="Actions"
                  >
                    <Icon icon="lucide:more-vertical" class="h-5 w-5" />
                  </button>
                {/snippet}
                {#snippet content()}
                  <DropdownItem onclick={() => handleAction('Edit Jane')}>
                    <Icon icon="lucide:edit-2" class="h-4 w-4 text-slate-400" />
                    <span>Edit Profile</span>
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem onclick={() => handleAction('Deactivate Jane')} variant="danger">
                    <Icon icon="lucide:user-minus" class="h-4 w-4 text-rose-500" />
                    <span>Deactivate Karyawan</span>
                  </DropdownItem>
                {/snippet}
              </Dropdown>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</Story>
