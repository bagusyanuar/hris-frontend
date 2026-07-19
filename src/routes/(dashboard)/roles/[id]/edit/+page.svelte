<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve */
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import { Button } from '$lib/presentation/shared/components/button';
  import RolesForm from '$lib/presentation/modules/roles/components/RolesForm.svelte';
  import { useRolesQueries } from '$lib/presentation/modules/roles/runes/roles-query.svelte';
  import type { CreateRoleInput } from '$lib/core/roles';

  const roleId = $derived(page.params.id);
  const queries = useRolesQueries();
  const roleQuery = $derived(queries.getRole(() => roleId ?? ''));
  const updateMutation = queries.updateRole;

  async function handleSubmit(input: CreateRoleInput) {
    updateMutation.mutate(
      { ...input, id: roleId ?? '' },
      {
        onSuccess: () => {
          goto('/roles');
        }
      }
    );
  }

  function handleCancel() {
    goto('/roles');
  }
</script>

<div class="flex flex-col gap-4">
  <!-- Header Card -->
  <Card>
    <div class="flex items-center gap-4">
      <button
        onclick={handleCancel}
        class="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <Icon icon="lucide:arrow-left" class="w-5 h-5" />
      </button>
      <div class="flex flex-col gap-1">
        <Typography variant="h4" weight="bold">Ubah Hak Akses</Typography>
        <Typography variant="body-sm" color="secondary">
          Edit detail peranan dan kelola izin modul yang aktif.
        </Typography>
      </div>
    </div>
  </Card>

  <!-- Form Body Card -->
  <Card>
    {#if roleQuery.isPending}
      <div class="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <Icon icon="lucide:loader-2" class="w-8 h-8 animate-spin text-brand-primary" />
        <span class="text-sm font-medium">Memuat data role...</span>
      </div>
    {:else if roleQuery.data}
      <RolesForm
        role={roleQuery.data}
        isSubmitting={updateMutation.isPending}
        onsubmit={handleSubmit}
        oncancel={handleCancel}
      />
    {:else}
      <div class="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
        <Icon icon="lucide:shield-alert" class="w-8 h-8 text-rose-500" />
        <span class="text-sm font-medium text-rose-600">Role tidak ditemukan</span>
        <Button variant="outline" onclick={handleCancel} class="mt-2">Kembali</Button>
      </div>
    {/if}
  </Card>
</div>
