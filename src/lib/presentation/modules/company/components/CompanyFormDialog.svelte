<script lang="ts">
  import type { CompanyModel, CreateCompanyInput } from '$lib/core/company';
  import { Dialog } from '$lib/presentation/shared/components/dialog';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { Switch } from '$lib/presentation/shared/components/switch';
  import { useCompanyForm } from '../runes/company-form.svelte';

  interface Props {
    open: boolean;
    company?: CompanyModel | null;
    isSubmitting?: boolean;
    onsubmit: (input: CreateCompanyInput) => void | Promise<void>;
    onclose: () => void;
  }

  let {
    open = $bindable(false),
    company = null,
    isSubmitting = false,
    onsubmit,
    onclose
  }: Props = $props();

  const isEditMode = $derived(company !== null);

  const { form, errors, enhance, load, submitting } = useCompanyForm(async (input) => {
    await onsubmit(input);
  });

  $effect(() => {
    if (open) load(company);
  });

  function handleDialogClose() {
    load(null);
    onclose();
  }
</script>

<Dialog
  bind:open
  title={isEditMode ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
  size="md"
  onclose={handleDialogClose}
>
  <p class="text-sm text-slate-500 dark:text-slate-400 mb-5">
    {isEditMode
      ? 'Ubah informasi legalitas dan identitas perusahaan di bawah ini.'
      : 'Tambahkan data badan hukum / entitas perusahaan baru ke dalam sistem.'}
  </p>
  <form id="company-form" method="POST" use:enhance class="flex flex-col gap-4">
    <TextField
      name="code"
      label="Kode Perusahaan (PT)"
      placeholder="Contoh: PTA, PTB"
      bind:value={$form.code}
      error={$errors.code?.[0]}
      required
    />

    <TextField
      name="legalName"
      label="Nama Legal / Badan Hukum"
      placeholder="Contoh: PT. Alpha Nusantara, PT. Beta Sejahtera"
      bind:value={$form.legalName}
      error={$errors.legalName?.[0]}
      required
    />

    <TextField
      name="npwp"
      label="NPWP Perusahaan"
      placeholder="Format: 01.234.567.8-901.000"
      bind:value={$form.npwp}
      error={$errors.npwp?.[0]}
    />

    <TextField
      name="bpjsNo"
      label="Nomor Pendaftaran BPJS"
      placeholder="Contoh: JKN-0001"
      bind:value={$form.bpjsNo}
      error={$errors.bpjsNo?.[0]}
    />

    <Switch
      bind:checked={$form.isActive}
      label="Aktif"
      description="Perusahaan nonaktif akan menyembunyikan semua cabang dan karyawan terkait dari modul aktif"
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
      form="company-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Perusahaan'}
    </Button>
  {/snippet}
</Dialog>
