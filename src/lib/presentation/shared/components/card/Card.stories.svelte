<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Card from './Card.svelte';

	const { Story } = defineMeta({
		title: 'Shared/Card',
		component: Card
	});
</script>

<script lang="ts">
	import Button from '../button/Button.svelte';
	import Typography from '../typography/Typography.svelte';
</script>

<Story name="Default">
	<Card title="Card Title" description="This is a simple card description.">
		<Typography variant="body-sm">
			This is the body content of the card. You can put anything here.
		</Typography>
	</Card>
</Story>

<Story name="Interactive / Hoverable">
	<Card title="Interactive Card" description="Hover over me to see effect" hoverable={true}>
		<Typography variant="body-sm">
			This card has custom hover states, animations, and shadows.
		</Typography>
	</Card>
</Story>

<Story name="With Footer & Header snippet">
	<Card>
		{#snippet header()}
			<div class="flex items-center justify-between w-full">
				<Typography variant="h6" weight="bold">Custom Header</Typography>
				<span class="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-text">Active</span>
			</div>
		{/snippet}

		<Typography variant="body-sm">
			Inside content of the card goes here.
		</Typography>

		{#snippet footer()}
			<div class="flex justify-end gap-2 w-full">
				<Button variant="ghost" size="sm">Cancel</Button>
				<Button variant="primary" size="sm">Confirm</Button>
			</div>
		{/snippet}
	</Card>
</Story>
