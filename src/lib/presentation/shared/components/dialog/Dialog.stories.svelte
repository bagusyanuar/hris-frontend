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
			}
		}
	});
</script>

<script lang="ts">
	let isDefaultOpen = $state(false);
	let isLargeOpen = $state(false);
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
