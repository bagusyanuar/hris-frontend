<script lang="ts">
  import type { BranchModel, CreateBranchInput } from '$lib/core/branch';
  import { Dialog } from '$lib/presentation/shared/components/dialog';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { Switch } from '$lib/presentation/shared/components/switch';
  import { useBranchForm } from '../runes/branch-form.svelte';

  interface Props {
    open: boolean;
    branch?: BranchModel | null;
    isSubmitting?: boolean;
    onsubmit: (input: CreateBranchInput) => void | Promise<void>;
    onclose: () => void;
  }

  let {
    open = $bindable(false),
    branch = null,
    isSubmitting = false,
    onsubmit,
    onclose
  }: Props = $props();

  const isEditMode = $derived(branch !== null);

  const { form, errors, enhance, load, submitting } = useBranchForm(async (input) => {
    await onsubmit(input);
  });

  $effect(() => {
    if (open) load(branch);
  });

  function handleDialogClose() {
    load(null);
    onclose();
  }
</script>

<Dialog
  bind:open
  title={isEditMode ? 'Edit Cabang' : 'Tambah Cabang'}
  size="md"
  onclose={handleDialogClose}
>
  <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
    {isEditMode
      ? 'Ubah informasi master data cabang perusahaan di bawah ini.'
      : 'Tambahkan master data cabang perusahaan baru ke dalam sistem.'}
  </p>
  <form id="branch-form" method="POST" use:enhance class="flex flex-col gap-4">
    <TextField
      name="code"
      label="Kode Cabang"
      placeholder="Contoh: HQ, BDG, SUB"
      bind:value={$form.code}
      error={$errors.code?.[0]}
      required
    />

    <TextField
      name="name"
      label="Nama Cabang"
      placeholder="Contoh: PT. Pusat Jakarta, PT. Cabang Bali"
      bind:value={$form.name}
      error={$errors.name?.[0]}
      required
    />

    <TextField
      name="phone"
      label="Nomor Telepon"
      placeholder="Contoh: 021-123456"
      bind:value={$form.phone}
      error={$errors.phone?.[0]}
    />

    <TextField
      name="address"
      label="Alamat"
      placeholder="Jelaskan alamat cabang secara lengkap..."
      bind:value={$form.address}
      error={$errors.address?.[0]}
    />

    <Switch
      bind:checked={
        () => $form.status === 'active', (v) => ($form.status = v ? 'active' : 'inactive')
      }
      label="Aktif"
      description="Cabang nonaktif tidak akan muncul pada daftar pemilih cabang"
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
      form="branch-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Cabang'}
    </Button>
  {/snippet}
</Dialog>
