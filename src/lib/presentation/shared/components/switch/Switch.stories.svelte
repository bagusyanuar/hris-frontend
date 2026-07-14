<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Switch from './Switch.svelte';

	const { Story } = defineMeta({
		title: 'Switch',
		component: Switch,
		tags: ['autodocs'],
		argTypes: {
			checked: {
				control: 'boolean'
			},
			variant: {
				control: 'select',
				options: ['primary', 'success', 'danger']
			},
			size: {
				control: 'select',
				options: ['sm', 'md', 'lg']
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

<Story name="Default" args={{ label: 'Enable notifications' }} />

<Story name="With Description" args={{ 
	label: 'Dark Mode', 
	description: 'Switch between light and dark theme preferences.' 
}} />

<Story name="Sizes">
	<div class="flex flex-col gap-4">
		<Switch size="sm" label="Small size switch" />
		<Switch size="md" label="Medium size switch" />
		<Switch size="lg" label="Large size switch" />
	</div>
</Story>

<Story name="Variants">
	<div class="flex flex-col gap-4">
		<Switch variant="primary" checked={true} label="Primary switch" />
		<Switch variant="success" checked={true} label="Success switch" />
		<Switch variant="danger" checked={true} label="Danger switch" />
	</div>
</Story>

<Story name="With Error" args={{ 
	label: 'Accept Terms', 
	error: 'You must enable this setting to proceed.' 
}} />

<Story name="Disabled" args={{ 
	label: 'Disabled setting', 
	disabled: true,
	checked: true
}} />
