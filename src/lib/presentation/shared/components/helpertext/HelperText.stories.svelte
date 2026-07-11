<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import HelperText from './HelperText.svelte';

	const { Story } = defineMeta({
		title: 'HelperText',
		component: HelperText,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: ['default', 'error']
			}
		}
	});
</script>

<Story name="Default" args={{ variant: 'default' }}>
	We'll never share your email with anyone else.
</Story>

<Story name="Error" args={{ variant: 'error' }}>
	Please enter a valid email address.
</Story>
