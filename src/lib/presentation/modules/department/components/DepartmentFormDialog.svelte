<script lang="ts">
  import type { CreateDepartmentInput, DepartmentModel } from '$lib/core/department';
  import { Dialog } from '$lib/presentation/shared/components/dialog';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { Combobox, type Option } from '$lib/presentation/shared/components/combobox';
  import { Switch } from '$lib/presentation/shared/components/switch';
  import { useDepartmentForm } from '../runes/department-form.svelte';

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

  const isEditMode = $derived(department !== null);

  // superForm SPA di-init di rune; panggil onsubmit parent dengan data tervalidasi Zod.
  const { form, errors, enhance, load, submitting } = useDepartmentForm((input) => onsubmit(input));

  // Populate saat edit, reset ke default saat create. Tidak enumerasi field di sini —
  // semua mapping ada di rune (toInput). Widget non-teks pakai function binding ke $form,
  // jadi tidak perlu shadow state + effect sinkronisasi.
  $effect(() => {
    if (open) load(department);
  });

  function handleDialogClose() {
    load(null);
    onclose();
  }
</script>

<Dialog
  bind:open
  title={isEditMode ? 'Edit Departemen' : 'Tambah Departemen'}
  size="md"
  onclose={handleDialogClose}
>
  <!-- Gunakan form dengan method POST dan use:enhance dari superforms -->
  <form id="dept-form" method="POST" use:enhance class="flex flex-col gap-4">
    <TextField
      name="code"
      bind:value={$form.code}
      label="Kode Departemen"
      placeholder="mis. ENG-FE"
      error={$errors.code?.[0]}
      required
    />
    <TextField
      name="name"
      bind:value={$form.name}
      label="Nama Departemen"
      placeholder="mis. Frontend"
      error={$errors.name?.[0]}
      required
    />
    <Combobox
      options={parentOptions}
      bind:value={
        () => parentOptions.find((opt) => String(opt.value) === $form.parentId),
        (opt) => ($form.parentId = opt ? String(opt.value) : null)
      }
      label="Departemen Induk"
      placeholder="Tanpa induk (departemen utama)"
      error={$errors.parentId?.[0]}
    />
    <TextField
      name="description"
      bind:value={$form.description}
      label="Deskripsi"
      placeholder="Deskripsi singkat opsional"
      error={$errors.description?.[0]}
    />
    <Switch
      bind:checked={
        () => $form.status === 'active', (v) => ($form.status = v ? 'active' : 'inactive')
      }
      label="Aktif"
      description="Departemen nonaktif disembunyikan dari pilihan"
    />
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
      form="dept-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Departemen'}
    </Button>
  {/snippet}
</Dialog>
