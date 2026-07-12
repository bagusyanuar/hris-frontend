<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Combobox from './Combobox.svelte';

	const { Story } = defineMeta({
		title: 'Combobox',
		tags: ['autodocs']
	});

	const frameworks = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'angular', label: 'Angular' },
		{ value: 'solid', label: 'Solid' },
		{ value: 'nextjs', label: 'Next.js' },
		{ value: 'nuxt', label: 'Nuxt' },
		{ value: 'qwik', label: 'Qwik' }
	];
</script>

<script lang="ts">
	import type { Option } from './Combobox.svelte';

	let selectedFramework = $state<Option>({ value: 'svelte', label: 'Svelte' });
	let selectedFrameworks = $state<Option[]>([{ value: 'svelte', label: 'Svelte' }]);
	let errorFramework = $state<Option | undefined>(undefined);
	let sizeFramework = $state<Option | undefined>(undefined);
</script>

<Story name="Default">
	<div class="max-w-sm space-y-4">
		<Combobox
			options={frameworks}
			bind:value={selectedFramework}
			label="Choose a Framework"
			placeholder="Search framework..."
			helperText="Choose the frontend framework you are developing with."
		/>
		<p class="text-sm text-slate-500">Selected: <strong class="text-slate-900">{selectedFramework ? JSON.stringify(selectedFramework) : 'None'}</strong></p>
	</div>
</Story>

<Story name="Multiple">
	<div class="max-w-sm space-y-4">
		<Combobox
			options={frameworks}
			bind:value={selectedFrameworks}
			multiple
			label="Choose Frameworks (Multiple)"
			placeholder="Search framework..."
			helperText="Choose the frontend frameworks you are developing with."
		/>
		<p class="text-sm text-slate-500">Selected: <strong class="text-slate-900">{selectedFrameworks ? JSON.stringify(selectedFrameworks) : 'None'}</strong></p>
	</div>
</Story>

<Story name="With Validation Error">
	<div class="max-w-sm">
		<Combobox
			options={frameworks}
			bind:value={errorFramework}
			label="Framework with Error"
			error="You must select a framework to continue."
		/>
	</div>
</Story>

<Story name="Sizes">
	<div class="max-w-sm space-y-6">
		<Combobox
			options={frameworks}
			bind:value={sizeFramework}
			label="Small Size (sm)"
			size="sm"
			placeholder="Small combobox..."
		/>
		<Combobox
			options={frameworks}
			bind:value={sizeFramework}
			label="Medium Size (md)"
			size="md"
			placeholder="Medium combobox..."
		/>
		<Combobox
			options={frameworks}
			bind:value={sizeFramework}
			label="Large Size (lg)"
			size="lg"
			placeholder="Large combobox..."
		/>
	</div>
</Story>

<Story name="Disabled">
	<div class="max-w-sm">
		<Combobox
			options={frameworks}
			value={{ value: 'svelte', label: 'Svelte' }}
			disabled
			label="Disabled Framework Selector"
		/>
	</div>
</Story>

<Story name="With Prefix Icon">
	<div class="max-w-sm">
		<Combobox
			options={frameworks}
			prefix="lucide:search"
			label="Framework with Prefix Icon"
			placeholder="Search..."
		/>
	</div>
</Story>

<Story name="Non-Clearable">
	<div class="max-w-sm">
		<Combobox
			options={frameworks}
			value={{ value: 'react', label: 'React' }}
			clearable={false}
			label="Non-Clearable Selector"
		/>
	</div>
</Story>
