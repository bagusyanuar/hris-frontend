<script lang="ts">
  import type { JobPositionModel, CreateJobPositionInput } from '$lib/core/job-position';
  import { Dialog } from '$lib/presentation/shared/components/dialog';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { Switch } from '$lib/presentation/shared/components/switch';
  import { Combobox } from '$lib/presentation/shared/components/combobox';
  import type { Option } from '$lib/presentation/shared/components/combobox';
  import { useJobPositionForm } from '../runes/job-position-form.svelte';

  interface Props {
    isOpen: boolean;
    position?: JobPositionModel | null;
    parentOptions: Option[];
    departmentOptions: Option[];
    jobTitleOptions: Option[];
    isSubmitting?: boolean;
    onSubmit: (input: CreateJobPositionInput) => void | Promise<void>;
    onClose: () => void;
  }

  let {
    isOpen = $bindable(false),
    position = null,
    parentOptions = [],
    departmentOptions = [],
    jobTitleOptions = [],
    isSubmitting = false,
    onSubmit,
    onClose
  }: Props = $props();

  const isEditMode = $derived(position !== null);

  const { form, errors, enhance, load, submitting } = useJobPositionForm(async (input) => {
    await onSubmit({
      ...input,
      description: input.description ?? undefined
    });
  });

  $effect(() => {
    if (isOpen) {
      load(position);
    }
  });

  function handleDialogClose() {
    load(null);
    onClose();
  }

  let parentOption = $state<Option | undefined>();
  let departmentOption = $state<Option | undefined>();
  let jobTitleOption = $state<Option | undefined>();

  $effect(() => {
    if ($form.parentId) {
      const found = parentOptions.find((o) => String(o.value) === String($form.parentId));
      if (found && parentOption?.value !== found.value) {
        parentOption = found;
      }
    } else {
      parentOption = undefined;
    }
  });

  $effect(() => {
    if ($form.departmentId) {
      const found = departmentOptions.find((o) => String(o.value) === String($form.departmentId));
      if (found && departmentOption?.value !== found.value) {
        departmentOption = found;
      }
    } else {
      departmentOption = undefined;
    }
  });

  $effect(() => {
    if ($form.jobTitleId) {
      const found = jobTitleOptions.find((o) => String(o.value) === String($form.jobTitleId));
      if (found && jobTitleOption?.value !== found.value) {
        jobTitleOption = found;
      }
    } else {
      jobTitleOption = undefined;
    }
  });

  $effect(() => {
    if (parentOption && !Array.isArray(parentOption)) {
      $form.parentId = String(parentOption.value);
    } else {
      $form.parentId = null;
    }
  });

  $effect(() => {
    if (departmentOption && !Array.isArray(departmentOption)) {
      $form.departmentId = String(departmentOption.value);
    } else {
      $form.departmentId = '';
    }
  });

  $effect(() => {
    if (jobTitleOption && !Array.isArray(jobTitleOption)) {
      $form.jobTitleId = String(jobTitleOption.value);
    } else {
      $form.jobTitleId = '';
    }
  });
</script>

<Dialog
  bind:open={isOpen}
  title={isEditMode ? 'Edit Posisi' : 'Tambah Posisi'}
  size="xl"
  onclose={handleDialogClose}
>
  <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
    {isEditMode
      ? 'Ubah informasi master data posisi di bawah ini.'
      : 'Tambahkan master data posisi baru ke dalam sistem.'}
  </p>
  <form id="jobposition-form" method="POST" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField
      name="name"
      label="Nama Posisi"
      placeholder="Contoh: Frontend Developer, HR Manager"
      bind:value={$form.name}
      error={$errors.name?.[0]}
      required
    />

    <div class="flex flex-col gap-1.5">
      <Combobox
        label="Departemen"
        placeholder="Pilih departemen..."
        options={departmentOptions}
        bind:value={departmentOption}
        error={$errors.departmentId?.[0]}
      />
      <input type="hidden" name="departmentId" value={$form.departmentId || ''} />
    </div>

    <div class="flex flex-col gap-1.5">
      <Combobox
        label="Jabatan"
        placeholder="Pilih jabatan..."
        options={jobTitleOptions}
        bind:value={jobTitleOption}
        error={$errors.jobTitleId?.[0]}
      />
      <input type="hidden" name="jobTitleId" value={$form.jobTitleId || ''} />
    </div>

    <div class="flex flex-col gap-1.5">
      <Combobox
        label="Parent Position"
        placeholder="Pilih parent position (opsional)"
        options={parentOptions}
        bind:value={parentOption}
        error={$errors.parentId?.[0]}
      />
      <input type="hidden" name="parentId" value={$form.parentId || ''} />
    </div>

    <TextField
      name="headcountQuota"
      label="Headcount Quota"
      type="number"
      placeholder="Contoh: 1, 5, 10"
      bind:value={$form.headcountQuota}
      error={$errors.headcountQuota?.[0]}
      required
    />

    <TextField
      name="description"
      label="Deskripsi"
      placeholder="Jelaskan peran dan tanggung jawab posisi ini..."
      bind:value={
        () => $form.description ?? undefined,
        (v) => ($form.description = v ? String(v) : null)
      }
      error={$errors.description?.[0]}
    />

    <div class="md:col-span-2">
      <Switch
        bind:checked={
          () => $form.status === 'active', (v) => ($form.status = v ? 'active' : 'inactive')
        }
        label="Aktif"
        description="Posisi nonaktif tidak akan bisa di-assign ke pegawai."
      />
    </div>
  </form>

  {#snippet footer()}
    <Button
      variant="outline"
      onclick={handleDialogClose}
      disabled={$submitting || isSubmitting}
      type="button"
    >
      Batal
    </Button>
    <Button
      variant="primary"
      type="submit"
      form="jobposition-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Posisi'}
    </Button>
  {/snippet}
</Dialog>
