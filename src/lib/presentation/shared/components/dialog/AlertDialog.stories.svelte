<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AlertDialog from './AlertDialog.svelte';
	import Button from '../button/Button.svelte';

	const { Story } = defineMeta({
		title: 'AlertDialog',
		tags: ['autodocs'],
		argTypes: {
			open: { control: 'boolean' },
			title: { control: 'text' },
			description: { control: 'text' },
			variant: {
				control: 'select',
				options: ['info', 'warning', 'danger', 'success']
			},
			closable: { control: 'boolean' },
			confirmText: { control: 'text' },
			cancelText: { control: 'text' },
			isLoading: { control: 'boolean' }
		}
	});
</script>

<script lang="ts">
	let isDefaultOpen = $state(false);
	let isInfoOpen = $state(false);
	let isDangerOpen = $state(false);
	let isSuccessOpen = $state(false);
	let isCustomActionsOpen = $state(false);
	let isLoadingStateOpen = $state(false);

	let isDeleting = $state(false);

	function handleConfirm() {
		alert('Confirmed!');
		isDefaultOpen = false;
	}

	async function handleAsyncDelete() {
		isDeleting = true;
		await new Promise((resolve) => setTimeout(resolve, 1500));
		isDeleting = false;
		isDangerOpen = false;
		alert('Deleted successfully!');
	}
</script>

<Story name="Interactive Demo">
	<div class="p-6 space-y-4">
		<Button onclick={() => (isDefaultOpen = true)} variant="secondary">
			Open Warning Alert (Default)
		</Button>

		<AlertDialog
			bind:open={isDefaultOpen}
			title="Unsaved Changes"
			description="You have unsaved changes in this form. Leaving this page will discard all modifications."
			variant="warning"
			confirmText="Discard Changes"
			cancelText="Keep Editing"
			onconfirm={handleConfirm}
		/>
	</div>
</Story>

<Story name="Danger / Destructive (Async)">
	<div class="p-6">
		<Button onclick={() => (isDangerOpen = true)} variant="danger">
			Open Danger Alert
		</Button>

		<AlertDialog
			bind:open={isDangerOpen}
			title="Delete Employee Record?"
			description="Are you sure you want to delete this employee? This action is permanent and cannot be undone."
			variant="danger"
			confirmText="Delete Record"
			cancelText="Cancel"
			isLoading={isDeleting}
			onconfirm={handleAsyncDelete}
		/>
	</div>
</Story>

<Story name="Loading State Preview">
	<div class="p-6">
		<Button onclick={() => (isLoadingStateOpen = true)} variant="outline">
			Open Alert (Static Loading)
		</Button>

		<AlertDialog
			bind:open={isLoadingStateOpen}
			title="Saving Department Configuration"
			description="Please wait while the new department settings are being propagated to all subsidiary organizations."
			variant="info"
			confirmText="Saving..."
			cancelText="Cancel"
			isLoading={true}
		/>
	</div>
</Story>

<Story name="Info Alert">
	<div class="p-6">
		<Button onclick={() => (isInfoOpen = true)} variant="outline">
			Open Info Alert
		</Button>

		<AlertDialog
			bind:open={isInfoOpen}
			title="System Maintenance"
			description="The HR portal will undergo scheduled maintenance tonight from 22:00 to 24:00 UTC. Some actions may be temporarily unavailable."
			variant="info"
			confirmText="Understood"
			cancelText="Close"
			onconfirm={() => { isInfoOpen = false; }}
		/>
	</div>
</Story>

<Story name="Success Alert">
	<div class="p-6">
		<Button onclick={() => (isSuccessOpen = true)}>
			Open Success Alert
		</Button>

		<AlertDialog
			bind:open={isSuccessOpen}
			title="Task Completed"
			description="The payroll batch processing has completed successfully. Pay slips have been sent to all registered employees."
			variant="success"
			confirmText="Done"
			cancelText="Back to Dashboard"
			onconfirm={() => { isSuccessOpen = false; }}
		/>
	</div>
</Story>

<Story name="Custom Actions (3 Buttons)">
	<div class="p-6">
		<Button onclick={() => (isCustomActionsOpen = true)} variant="secondary">
			Open Custom Actions Alert
		</Button>

		<AlertDialog
			bind:open={isCustomActionsOpen}
			title="Save Changes to Report?"
			variant="warning"
		>
			<p>You are closing the monthly performance report. What would you like to do with your draft?</p>

			{#snippet actions()}
				<div class="flex justify-between w-full items-center gap-3">
					<Button variant="ghost" onclick={() => (isCustomActionsOpen = false)}>
						Cancel
					</Button>
					<div class="flex gap-2">
						<Button variant="outline" onclick={() => (isCustomActionsOpen = false)}>
							Discard
						</Button>
						<Button variant="primary" onclick={() => (isCustomActionsOpen = false)}>
							Save Draft
						</Button>
					</div>
				</div>
			{/snippet}
		</AlertDialog>
	</div>
</Story>

