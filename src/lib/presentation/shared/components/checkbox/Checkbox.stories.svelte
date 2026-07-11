<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Checkbox from './Checkbox.svelte';

	const { Story } = defineMeta({
		title: 'Checkbox',
		component: Checkbox,
		tags: ['autodocs'],
		argTypes: {
			checked: {
				control: 'boolean'
			},
			label: {
				control: 'text'
			},
			description: {
				control: 'text'
			},
			error: {
				control: 'text'
			},
			disabled: {
				control: 'boolean'
			}
		}
	});
</script>

<Story name="Default" args={{ label: 'Subscribe to newsletter' }} />

<Story name="With Description" args={{ 
	label: 'Terms and Conditions', 
	description: 'I agree to the terms of service and privacy policy.' 
}} />

<Story name="With Error" args={{ 
	label: 'Accept Policy', 
	error: 'You must accept the privacy policy to continue.' 
}} />

<Story name="Disabled" args={{ 
	label: 'Disabled option', 
	disabled: true,
	checked: true
}} />
