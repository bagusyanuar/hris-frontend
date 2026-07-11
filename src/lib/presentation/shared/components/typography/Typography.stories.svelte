<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Typography from './Typography.svelte';

	const { Story } = defineMeta({
		title: 'Typography',
		component: Typography,
		tags: ['autodocs'],
		argTypes: {
			variant: {
				control: 'select',
				options: [
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'body-lg',
					'body-md',
					'body-sm',
					'caption',
					'code'
				]
			},
			weight: {
				control: 'select',
				options: ['light', 'normal', 'medium', 'semibold', 'bold']
			},
			color: {
				control: 'select',
				options: ['primary', 'secondary', 'brand', 'muted', 'error', 'success', 'warning', 'info', 'inherit']
			},
			tag: {
				control: 'text'
			}
		}
	});
</script>

<Story name="H1" args={{ variant: 'h1' }}>
	This is an H1 heading
</Story>

<Story name="H2" args={{ variant: 'h2' }}>
	This is an H2 heading
</Story>

<Story name="H3" args={{ variant: 'h3' }}>
	This is an H3 heading
</Story>

<Story name="H4" args={{ variant: 'h4' }}>
	This is an H4 heading
</Story>

<Story name="Body Large" args={{ variant: 'body-lg' }}>
	This is body large text, ideal for introductory paragraphs.
</Story>

<Story name="Body Medium (Default)" args={{ variant: 'body-md' }}>
	This is body medium text, the default for most body text.
</Story>

<Story name="Body Small" args={{ variant: 'body-sm' }}>
	This is body small text, perfect for secondary descriptions or hints.
</Story>

<Story name="Caption" args={{ variant: 'caption' }}>
	This is a caption text style.
</Story>

<Story name="Brand Color" args={{ variant: 'h2', color: 'brand' }}>
	Brand Highlight Heading
</Story>

<Story name="Error Color" args={{ variant: 'body-sm', color: 'error' }}>
	Failed to save changes. Please try again.
</Story>

<Story name="Success Color" args={{ variant: 'body-sm', color: 'success' }}>
	Changes saved successfully!
</Story>

<Story name="Code Style" args={{ variant: 'code' }}>
	const code = 'Svelte 5 Runes';
</Story>
