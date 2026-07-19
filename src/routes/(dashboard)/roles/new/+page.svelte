<script lang="ts">
  /* eslint-disable svelte/no-navigation-without-resolve */
  import Icon from '@iconify/svelte';
  import { goto } from '$app/navigation';
  import { Card } from '$lib/presentation/shared/components/card';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import RolesForm from '$lib/presentation/modules/roles/components/RolesForm.svelte';
  import { useRolesQueries } from '$lib/presentation/modules/roles/runes/roles-query.svelte';
  import type { CreateRoleInput } from '$lib/core/roles';

  const queries = useRolesQueries();
  const createMutation = queries.createRole;

  async function handleSubmit(input: CreateRoleInput) {
    createMutation.mutate(input, {
      onSuccess: () => {
        goto('/roles');
      }
    });
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
        <Typography variant="h4" weight="bold">Tambah Role</Typography>
        <Typography variant="body-sm" color="secondary">
          Buat peranan hak akses baru dan tentukan izin operasional modul.
        </Typography>
      </div>
    </div>
  </Card>

  <!-- Form Body Card -->
  <Card>
    <RolesForm
      isSubmitting={createMutation.isPending}
      onsubmit={handleSubmit}
      oncancel={handleCancel}
    />
  </Card>
</div>
