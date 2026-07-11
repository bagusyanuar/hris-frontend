<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Label from './Label.svelte';

	const { Story } = defineMeta({
		title: 'Label',
		component: Label,
		tags: ['autodocs'],
		argTypes: {
			required: {
				control: 'boolean'
			}
		}
	});
</script>

<Story name="Default" args={{ required: false }}>
	Email Address
</Story>

<Story name="Required" args={{ required: true }}>
	Password
</Story>
