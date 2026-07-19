<script lang="ts">
	import type { JobTitleModel, CreateJobTitleInput } from '$lib/core/job-title';
	import { Dialog } from '$lib/presentation/shared/components/dialog';
	import { Button } from '$lib/presentation/shared/components/button';
	import { TextField } from '$lib/presentation/shared/components/textfield';
	import { Switch } from '$lib/presentation/shared/components/switch';
	import { useJobTitleForm } from '../runes/job-title-form.svelte';

	interface Props {
		open: boolean;
		jobTitle?: JobTitleModel | null;
		isSubmitting?: boolean;
		onsubmit: (input: CreateJobTitleInput) => void | Promise<void>;
		onclose: () => void;
	}

	let {
		open = $bindable(false),
		jobTitle = null,
		isSubmitting = false,
		onsubmit,
		onclose
	}: Props = $props();

	const isEditMode = $derived(jobTitle !== null);

	const { form, errors, enhance, load, submitting } = useJobTitleForm(async (input) => {
		await onsubmit(input);
	});

	$effect(() => {
		if (open) load(jobTitle);
	});

	function handleDialogClose() {
		load(null);
		onclose();
	}
</script>

<Dialog
	bind:open
	title={isEditMode ? 'Edit Jabatan' : 'Tambah Jabatan'}
	size="md"
	onclose={handleDialogClose}
>
	<p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
		{isEditMode
			? 'Ubah informasi master data jabatan di bawah ini.'
			: 'Tambahkan master data jabatan baru ke dalam sistem.'}
	</p>
	<form id="jobtitle-form" method="POST" use:enhance class="flex flex-col gap-4">
		<TextField
			name="code"
			label="Kode Jabatan"
			placeholder="Contoh: DIR, MGR, SPV"
			bind:value={$form.code}
			error={$errors.code?.[0]}
			required
		/>

		<TextField
			name="name"
			label="Nama Jabatan"
			placeholder="Contoh: Director, Manager, Supervisor"
			bind:value={$form.name}
			error={$errors.name?.[0]}
			required
		/>

		<TextField
			name="description"
			label="Deskripsi"
			placeholder="Jelaskan peran dan tanggung jawab jabatan ini secara umum..."
			bind:value={$form.description}
			error={$errors.description?.[0]}
		/>

		<Switch
			bind:checked={
				() => $form.status === 'active',
				(v) => ($form.status = v ? 'active' : 'inactive')
			}
			label="Aktif"
			description="Jabatan nonaktif tidak akan muncul di form pembuatan Job Position"
		/>
	</form>

	{#snippet footer()}
		<Button variant="outline" onclick={handleDialogClose} disabled={$submitting || isSubmitting} type="button">
			Batal
		</Button>
		<Button variant="primary" type="submit" form="jobtitle-form" isLoading={$submitting || isSubmitting} loadingText="Menyimpan...">
			{isEditMode ? 'Simpan Perubahan' : 'Tambah Jabatan'}
		</Button>
	{/snippet}
</Dialog>
