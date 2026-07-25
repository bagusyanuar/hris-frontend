<script lang="ts">
  import type { BranchModel, CreateBranchInput } from '$lib/core/branch';
  import { Dialog } from '$lib/presentation/shared/components/dialog';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { Switch } from '$lib/presentation/shared/components/switch';
  import { useBranchForm } from '../../branch/runes/branch-form.svelte';

  interface Props {
    open: boolean;
    companyId: string;
    branch?: BranchModel | null;
    isSubmitting?: boolean;
    onsubmit: (input: CreateBranchInput) => void | Promise<void>;
    onclose: () => void;
  }

  let {
    open = $bindable(false),
    companyId,
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
    if (open) {
      load(branch, companyId);
    }
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
      ? 'Ubah detail cabang operasional di bawah ini.'
      : 'Tambahkan cabang / lokasi fisik baru untuk perusahaan ini.'}
  </p>
  <form id="branch-form" method="POST" use:enhance class="flex flex-col gap-4">
    <!-- Hidden input to guarantee companyId is submitted -->
    <input type="hidden" name="companyId" bind:value={$form.companyId} />

    <TextField
      name="code"
      label="Kode Cabang"
      placeholder="Contoh: JKT, SBY, BDG"
      bind:value={$form.code}
      error={$errors.code?.[0]}
      required
    />

    <TextField
      name="name"
      label="Nama Cabang"
      placeholder="Contoh: Kantor Pusat Jakarta, Cabang Surabaya"
      bind:value={$form.name}
      error={$errors.name?.[0]}
      required
    />

    <TextField
      name="city"
      label="Kota"
      placeholder="Contoh: Jakarta, Surabaya, Bandung"
      bind:value={$form.city}
      error={$errors.city?.[0]}
    />

    <div class="flex flex-col gap-3 mt-2 border-t border-slate-100 dark:border-slate-800 pt-4">
      <Switch
        bind:checked={$form.isMain}
        label="Kantor Pusat (Main Office)"
        description="Menandai cabang ini sebagai kantor pusat legal. Maksimal 1 kantor pusat per perusahaan."
      />

      <Switch
        bind:checked={$form.isActive}
        label="Status Aktif"
        description="Cabang nonaktif tidak dapat digunakan untuk penempatan karyawan baru."
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
      form="branch-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Cabang'}
    </Button>
  {/snippet}
</Dialog>
