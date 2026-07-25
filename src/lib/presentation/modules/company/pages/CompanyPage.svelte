<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Button } from '$lib/presentation/shared/components/button';
  import { AlertDialog } from '$lib/presentation/shared/components/dialog';
  import { Badge } from '$lib/presentation/shared/components/badge';
  import TextField from '$lib/presentation/shared/components/textfield/TextField.svelte';
  import { Dropdown, DropdownItem } from '$lib/presentation/shared/components/dropdown';

  import CompanyFormDialog from '../components/CompanyFormDialog.svelte';
  import BranchFormDialog from '../components/BranchFormDialog.svelte';
  import BranchBentoCard from '../components/BranchBentoCard.svelte';
  import { useCompanyDirectory } from '../runes/company-directory.svelte';

  const dir = useCompanyDirectory();

  // Active Company ID for the split detail panel. Defaults to the first company when loaded.
  let activeCompanyId = $state<string | null>(null);

  const activeCompany = $derived(
    dir.table.getRowModel().rows.map(r => r.original).find((c) => c.id === activeCompanyId) ?? 
    dir.table.getRowModel().rows[0]?.original ?? 
    null
  );

  // Sync activeCompanyId with first loaded company if none is active yet
  $effect(() => {
    if (!activeCompanyId && dir.table.getRowModel().rows.length > 0) {
      activeCompanyId = dir.table.getRowModel().rows[0].original.id;
    }
  });
</script>

<!-- Bento Grid Split-Workspace Layout -->
<div class="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full items-start">
  
  <!-- LEFT COLUMN: Companies List (4 cols on lg) -->
  <div class="lg:col-span-4 xl:col-span-3 flex flex-col gap-3 h-full">
    <!-- Header Block -->
    <Card class="p-4 pb-3.5">
      <div class="flex items-center justify-between gap-2 mb-3">
        <div class="flex items-start gap-2.5">
          <div class="h-8 w-8 rounded-lg bg-brand-light text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <Icon icon="lucide:building-2" class="w-4 h-4" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <Typography variant="body-sm" weight="bold">Perusahaan</Typography>
              <span class="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-px rounded-full leading-none">
                {dir.table.getRowModel().rows.length}
              </span>
            </div>
            <span class="text-[11px] text-slate-400 dark:text-slate-500">Kelola badan hukum</span>
          </div>
        </div>
        <Button variant="primary" size="icon" onclick={dir.openCreateCompany} class="h-7 w-7 p-0 rounded-md">
          <Icon icon="lucide:plus" class="w-3.5 h-3.5" />
        </Button>
      </div>

      <!-- Quick Search inside list -->
      <TextField
        placeholder="Cari perusahaan..."
        size="sm"
        bind:value={() => dir.searchQuery, (v) => (dir.searchQuery = v)}
      >
        {#snippet prefix()}
          <Icon icon="lucide:search" class="w-3.5 h-3.5 text-slate-400" />
        {/snippet}
      </TextField>
    </Card>

    <!-- Scrollable Companies Stack -->
    <div class="flex flex-col gap-1.5 max-h-[calc(100vh-240px)] overflow-y-auto pr-0.5">
      {#if dir.isLoading}
        <div class="flex items-center justify-center py-12 bg-neutral-card rounded-xl border border-neutral-border">
          <Icon icon="lucide:loader-2" class="w-5 h-5 animate-spin text-brand-primary" />
        </div>
      {:else}
        {#each dir.table.getRowModel().rows.map(r => r.original) as company (company.id)}
          {@const isActive = activeCompany?.id === company.id}
          <button
            onclick={() => activeCompanyId = company.id}
            class="group relative flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 cursor-pointer w-full
              {isActive 
                ? 'bg-brand-light/40 dark:bg-brand-primary/10' 
                : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/40'}"
          >
            <!-- Active indicator bar -->
            {#if isActive}
              <div class="absolute left-0 top-2.5 bottom-2.5 w-[3px] bg-brand-primary rounded-r-full"></div>
            {/if}

            <!-- Company icon -->
            <div class="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
              {isActive 
                ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/25' 
                : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-400 group-hover:text-brand-primary/60 group-hover:bg-brand-light/50'}">
              <Icon icon="lucide:building-2" class="w-4 h-4" />
            </div>

            <!-- Company info -->
            <div class="flex flex-col gap-0.5 min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-[13px] font-semibold truncate
                  {isActive ? 'text-brand-primary dark:text-brand-primary' : 'text-slate-800 dark:text-slate-200'}">
                  {company.legalName}
                </span>
              </div>
              <div class="flex items-center gap-2 text-[11px] text-slate-400">
                <span class="font-mono font-medium text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-px rounded">
                  {company.code}
                </span>
                <span class="flex items-center gap-0.5">
                  <Icon icon="lucide:git-branch" class="w-3 h-3" />
                  {company.branches?.length ?? 0}
                </span>
                {#if company.isActive}
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {:else}
                  <span class="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                {/if}
              </div>
            </div>

            <!-- Context menu -->
            <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity" onclick={(e) => e.stopPropagation()}>
              <Dropdown align="right">
                {#snippet trigger(toggle)}
                  <Button variant="ghost" size="icon" onclick={toggle} class="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <Icon icon="lucide:ellipsis" class="w-4 h-4" />
                  </Button>
                {/snippet}
                {#snippet content()}
                  <DropdownItem class="text-xs gap-2" onclick={() => dir.openEditCompany(company)}>
                    <Icon icon="lucide:pencil" class="w-3.5 h-3.5 text-slate-400" />
                    Edit Perusahaan
                  </DropdownItem>
                  <div class="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                  <DropdownItem class="text-xs gap-2" variant="danger" onclick={() => dir.requestDeleteCompany(company)}>
                    <Icon icon="lucide:trash-2" class="w-3.5 h-3.5" />
                    Hapus Perusahaan
                  </DropdownItem>
                {/snippet}
              </Dropdown>
            </div>
          </button>
        {/each}
      {/if}
    </div>
  </div>

  <!-- RIGHT COLUMN: Active Company Workspace (8 cols on lg) -->
  <div class="lg:col-span-8 xl:col-span-9 flex flex-col gap-3 h-full">
    {#if !activeCompany}
      <!-- Empty State Workspace -->
      <Card class="flex flex-col items-center justify-center text-center py-24 min-h-[400px]">
        <div class="relative mb-6">
          <div class="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center">
            <Icon icon="lucide:building-2" class="w-9 h-9 text-slate-300" />
          </div>
          <div class="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-brand-light border-2 border-white dark:border-slate-950 flex items-center justify-center">
            <Icon icon="lucide:mouse-pointer-click" class="w-3 h-3 text-brand-primary" />
          </div>
        </div>
        <Typography variant="h5" weight="bold" class="mb-1.5">Pilih Perusahaan</Typography>
        <Typography variant="body-sm" color="secondary" class="max-w-xs leading-relaxed">
          Pilih perusahaan dari daftar di samping kiri untuk mengelola profil dan cabangnya.
        </Typography>
      </Card>
    {:else}
      <!-- Company Profile Card -->
      <div class="relative bg-neutral-card border border-neutral-border rounded-2xl overflow-hidden">
        <!-- Decorative gradient background -->
        <div class="absolute top-0 left-0 right-0 h-28 bg-gradient-to-br from-brand-primary/[0.06] via-emerald-500/[0.03] to-transparent dark:from-brand-primary/[0.08] dark:via-transparent"></div>

        <div class="relative z-10 p-6">
          <!-- Top row: avatar + name + actions -->
          <div class="flex items-start justify-between gap-4 mb-5">
            <div class="flex items-start gap-4">
              <!-- Company avatar -->
              <div class="relative shrink-0">
                <div class="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-primary to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-brand-primary/15">
                  <Icon icon="lucide:building" class="w-7 h-7" />
                </div>
                <!-- Status dot overlaid -->
                {#if activeCompany.isActive}
                  <div class="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 border-[2.5px] border-white dark:border-slate-900"></div>
                {/if}
              </div>

              <!-- Name and code -->
              <div class="flex flex-col gap-1 pt-0.5">
                <div class="flex items-center gap-2.5 flex-wrap">
                  <Typography variant="h4" weight="bold" class="text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                    {activeCompany.legalName}
                  </Typography>
                  <span class="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200/60 dark:border-slate-700/60">
                    {activeCompany.code}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  {#if activeCompany.isActive}
                    <Badge variant="success" class="text-[10px] py-0 px-2 font-medium gap-1">
                      <Icon icon="lucide:check-circle-2" class="w-3 h-3" />
                      Aktif
                    </Badge>
                  {:else}
                    <Badge variant="default" class="text-[10px] py-0 px-2 font-medium gap-1">
                      <Icon icon="lucide:minus-circle" class="w-3 h-3" />
                      Nonaktif
                    </Badge>
                  {/if}
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onclick={() => dir.openEditCompany(activeCompany)} class="h-9 gap-2 text-xs">
                <Icon icon="lucide:pencil-line" class="w-3.5 h-3.5" />
                Edit
              </Button>
              <Dropdown align="right">
                {#snippet trigger(toggle)}
                  <Button variant="outline" size="icon" onclick={toggle} class="h-9 w-9">
                    <Icon icon="lucide:ellipsis-vertical" class="w-4 h-4" />
                  </Button>
                {/snippet}
                {#snippet content()}
                  <DropdownItem class="text-xs gap-2" variant="danger" onclick={() => dir.requestDeleteCompany(activeCompany)}>
                    <Icon icon="lucide:trash-2" class="w-3.5 h-3.5" />
                    Hapus Perusahaan
                  </DropdownItem>
                {/snippet}
              </Dropdown>
            </div>
          </div>

          <!-- Legal info grid -->
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center gap-3 p-4 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div class="h-9 w-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                <Icon icon="lucide:file-text" class="w-4 h-4 text-brand-primary/70" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">NPWP</span>
                <span class="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {activeCompany.npwp || '—'}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-3 p-4 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
              <div class="h-9 w-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm">
                <Icon icon="lucide:shield-check" class="w-4 h-4 text-brand-primary/70" />
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">BPJS</span>
                <span class="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                  {activeCompany.bpjsNo || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Branches Section Card -->
      <div class="bg-neutral-card border border-neutral-border rounded-2xl overflow-hidden">
        <!-- Section header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/60">
          <div class="flex items-center gap-2.5">
            <div class="h-7 w-7 rounded-lg bg-brand-light dark:bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <Icon icon="lucide:git-branch" class="w-4 h-4" />
            </div>
            <div class="flex items-center gap-2">
              <Typography variant="body-sm" weight="bold">Cabang</Typography>
              <span class="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                {activeCompany.branches?.length ?? 0}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onclick={() => dir.openCreateBranch(activeCompany)} class="h-8 gap-1.5 text-xs hover:bg-brand-light hover:border-brand-primary/30 hover:text-brand-primary">
            <Icon icon="lucide:plus" class="w-3.5 h-3.5" />
            Tambah
          </Button>
        </div>

        <!-- Branch cards grid -->
        <div class="p-5">
          {#if (activeCompany.branches?.length ?? 0) === 0}
            <!-- Empty branch state -->
            <button
              onclick={() => dir.openCreateBranch(activeCompany)}
              class="w-full flex flex-col items-center justify-center py-12 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary/40 bg-slate-50/30 dark:bg-slate-900/20 hover:bg-brand-light/20 cursor-pointer transition-all duration-300 group"
            >
              <div class="h-12 w-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:text-brand-primary group-hover:border-brand-primary/30 group-hover:scale-105 transition-all duration-300 mb-3">
                <Icon icon="lucide:plus" class="w-5 h-5" />
              </div>
              <Typography variant="body-sm" weight="bold" class="text-slate-500 group-hover:text-brand-primary transition-colors">
                Tambah Cabang Pertama
              </Typography>
              <Typography variant="body-xs" color="secondary" class="mt-1">
                Buat lokasi penempatan karyawan
              </Typography>
            </button>
          {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {#each activeCompany.branches ?? [] as branch (branch.id)}
                <BranchBentoCard
                  {branch}
                  onEdit={() => dir.openEditBranch(activeCompany, branch)}
                  onDelete={() => dir.requestDeleteBranch(branch)}
                />
              {/each}

              <!-- Add branch mini card -->
              <button
                onclick={() => dir.openCreateBranch(activeCompany)}
                class="flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-brand-primary/40 bg-transparent hover:bg-brand-light/20 cursor-pointer transition-all duration-200 group min-h-[120px]"
              >
                <div class="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-brand-primary group-hover:bg-brand-light transition-all shrink-0">
                  <Icon icon="lucide:plus" class="w-4 h-4" />
                </div>
                <div class="text-left">
                  <Typography variant="body-xs" weight="bold" class="text-slate-500 group-hover:text-brand-primary transition-colors">
                    Tambah Cabang
                  </Typography>
                  <Typography variant="body-xs" color="secondary">Lokasi baru</Typography>
                </div>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Forms & Dialogs -->
<CompanyFormDialog
  bind:open={() => dir.isCompanyFormOpen, (v) => (dir.isCompanyFormOpen = v)}
  company={dir.editingCompany}
  isSubmitting={dir.isSubmitting}
  onsubmit={dir.submitCompany}
  onclose={dir.closeCompanyForm}
/>

{#if dir.isBranchFormOpen && dir.activeCompanyForBranch}
  <BranchFormDialog
    bind:open={() => dir.isBranchFormOpen, (v) => (dir.isBranchFormOpen = v)}
    companyId={dir.activeCompanyForBranch.id}
    branch={dir.editingBranch}
    isSubmitting={dir.isSubmitting}
    onsubmit={dir.submitBranch}
    onclose={dir.closeBranchForm}
  />
{/if}

<!-- Alert Dialogs -->
<AlertDialog
  bind:open={() => dir.isCompanyDeleteOpen, (v) => (dir.isCompanyDeleteOpen = v)}
  title="Hapus Perusahaan?"
  description={`Ini akan menghapus "${dir.deleteCompanyTarget?.legalName}" secara soft-delete. Lanjutkan?`}
  variant="danger"
  confirmText="Hapus"
  isLoading={dir.isDeleting}
  onconfirm={dir.confirmDeleteCompany}
  oncancel={() => (dir.isCompanyDeleteOpen = false)}
/>

<AlertDialog
  bind:open={() => dir.isBranchDeleteOpen, (v) => (dir.isBranchDeleteOpen = v)}
  title="Hapus Cabang?"
  description="Ini akan menghapus cabang ini secara soft-delete. Lanjutkan?"
  variant="danger"
  confirmText="Hapus"
  isLoading={dir.isDeleting}
  onconfirm={dir.confirmDeleteBranch}
  oncancel={() => (dir.isBranchDeleteOpen = false)}
/>
