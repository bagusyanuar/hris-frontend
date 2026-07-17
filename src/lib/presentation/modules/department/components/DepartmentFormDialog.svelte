<script lang="ts">
	import type { CreateDepartmentInput, DepartmentModel } from '$lib/core/department';
	import { Dialog } from '$lib/presentation/shared/components/dialog';
	import { Button } from '$lib/presentation/shared/components/button';
	import { TextField } from '$lib/presentation/shared/components/textfield';
	import { Combobox, type Option } from '$lib/presentation/shared/components/combobox';
	import { Switch } from '$lib/presentation/shared/components/switch';

	interface Props {
		open: boolean;
		department?: DepartmentModel | null;
		parentOptions: Option[];
		isSubmitting?: boolean;
		onsubmit: (input: CreateDepartmentInput) => void | Promise<void>;
		onclose: () => void;
	}

	let {
		open = $bindable(),
		department = null,
		parentOptions,
		isSubmitting = false,
		onsubmit,
		onclose
	}: Props = $props();

	let code = $state('');
	let name = $state('');
	let description = $state('');
	let isActive = $state(true);
	let selectedParent = $state<Option | undefined>(undefined);
	let codeError = $state('');
	let nameError = $state('');

	const isEditMode = $derived(department !== null);

	$effect(() => {
		if (!open) return;

		code = department?.code ?? '';
		name = department?.name ?? '';
		description = department?.description ?? '';
		isActive = department ? department.status === 'active' : true;
		selectedParent = department?.parentId
			? parentOptions.find((option) => option.value === department?.parentId)
			: undefined;
		codeError = '';
		nameError = '';
	});

	function handleSubmit() {
		codeError = code.trim() ? '' : 'Department code is required';
		nameError = name.trim() ? '' : 'Department name is required';
		if (codeError || nameError) return;

		onsubmit({
			code: code.trim(),
			name: name.trim(),
			parentId: (selectedParent?.value as string) ?? null,
			description: description.trim() || undefined,
			status: isActive ? 'active' : 'inactive'
		});
	}
</script>

<Dialog bind:open title={isEditMode ? 'Edit Department' : 'Add Department'} size="md" {onclose}>
	<div class="flex flex-col gap-4">
		<TextField bind:value={code} label="Department Code" placeholder="e.g. ENG-FE" error={codeError} required />
		<TextField bind:value={name} label="Department Name" placeholder="e.g. Frontend" error={nameError} required />
		<Combobox
			options={parentOptions}
			bind:value={selectedParent}
			label="Parent Department"
			placeholder="No parent (top-level department)"
		/>
		<TextField bind:value={description} label="Description" placeholder="Optional short description" />
		<Switch bind:checked={isActive} label="Active" description="Inactive departments are hidden from assignment pickers" />
	</div>

	{#snippet footer()}
		<Button variant="outline" onclick={onclose} disabled={isSubmitting}>Cancel</Button>
		<Button variant="primary" onclick={handleSubmit} isLoading={isSubmitting} loadingText="Saving...">
			{isEditMode ? 'Save Changes' : 'Add Department'}
		</Button>
	{/snippet}
</Dialog>
