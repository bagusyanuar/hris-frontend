<script lang="ts">
  import Icon from '@iconify/svelte';
  import { Drawer } from '$lib/presentation/shared/components/drawer';
  import { Typography } from '$lib/presentation/shared/components/typography';
  import type { RoleModel } from '$lib/core/roles';

  interface Props {
    isOpen: boolean;
    role: RoleModel | null;
    onClose: () => void;
  }

  let { isOpen, role, onClose }: Props = $props();

  const permissionTabs = [
    {
      id: 'employees',
      label: 'Kepegawaian',
      icon: 'lucide:users',
      permissions: [
        { id: 'employee:read', label: 'Melihat Data Karyawan' },
        { id: 'employee:create', label: 'Tambah Karyawan' },
        { id: 'employee:update', label: 'Ubah Karyawan' },
        { id: 'employee:delete', label: 'Hapus Karyawan' },
        { id: 'attendance:read', label: 'Melihat Presensi' },
        { id: 'attendance:update', label: 'Kelola Presensi' }
      ]
    },
    {
      id: 'master',
      label: 'Master Data',
      icon: 'lucide:database',
      permissions: [
        { id: 'branch:read', label: 'Melihat Cabang' },
        { id: 'branch:create', label: 'Tambah Cabang' },
        { id: 'branch:update', label: 'Ubah Cabang' },
        { id: 'branch:delete', label: 'Hapus Cabang' },
        { id: 'department:read', label: 'Melihat Departemen' },
        { id: 'department:create', label: 'Tambah Departemen' },
        { id: 'department:update', label: 'Ubah Departemen' },
        { id: 'department:delete', label: 'Hapus Departemen' }
      ]
    },
    {
      id: 'finance',
      label: 'Keuangan',
      icon: 'lucide:banknote',
      permissions: [
        { id: 'payroll:read', label: 'Melihat Payroll' },
        { id: 'payroll:create', label: 'Buat Payroll Draft' },
        { id: 'payroll:update', label: 'Ubah Payroll' },
        { id: 'payroll:delete', label: 'Hapus Payroll' },
        { id: 'payroll:run', label: 'Proses/Jalankan Payroll' },
        { id: 'payslip:read', label: 'Melihat Slip Gaji' }
      ]
    },
    {
      id: 'system',
      label: 'Sistem',
      icon: 'lucide:settings',
      permissions: [
        { id: 'user:read', label: 'Melihat Pengguna' },
        { id: 'user:create', label: 'Tambah Pengguna' },
        { id: 'user:update', label: 'Ubah Pengguna' },
        { id: 'user:delete', label: 'Hapus Pengguna' },
        { id: 'role:read', label: 'Melihat Role' },
        { id: 'role:create', label: 'Tambah Role' },
        { id: 'role:update', label: 'Ubah Role' },
        { id: 'role:delete', label: 'Hapus Role' }
      ]
    }
  ];

  function getActivePermissions(rolePermissions: string[]) {
    return permissionTabs
      .map((category) => {
        const activeInCat = category.permissions.filter((p) => rolePermissions.includes(p.id));
        return {
          ...category,
          activePermissions: activeInCat
        };
      })
      .filter((cat) => cat.activePermissions.length > 0);
  }

  const activeGroups = $derived(role ? getActivePermissions(role.permissions ?? []) : []);
</script>

<Drawer {isOpen} {onClose} title="Detail Role & Akses" class="md:w-[500px]">
  {#if role}
    <div class="flex flex-col gap-6">
      <!-- Profile Header -->
      <div class="flex items-start gap-4">
        <div
          class="h-14 w-14 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/10"
        >
          <Icon icon="lucide:shield" class="w-7 h-7" />
        </div>
        <div class="flex flex-col gap-1 pt-0.5">
          <Typography variant="h4" weight="semibold">{role.name}</Typography>
          <span class="text-xs text-slate-500 font-mono">ID: {role.id}</span>
        </div>
      </div>

      <div class="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

      <!-- Info Fields -->
      <div class="flex flex-col gap-1.5">
        <Typography variant="h6" weight="semibold">Deskripsi</Typography>
        <span
          class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-850"
        >
          {role.description || 'Tidak ada deskripsi.'}
        </span>
      </div>

      <!-- Active Permissions Listing -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <Typography variant="h6" weight="semibold">Hak Akses Aktif</Typography>
          <span
            class="text-xs font-semibold bg-brand-primary/10 text-brand-primary px-2.5 py-0.5 rounded-full border border-brand-primary/20"
          >
            {role.permissions?.length ?? 0} Izin
          </span>
        </div>

        {#if activeGroups.length === 0}
          <div
            class="text-center py-6 border border-dashed border-slate-350 dark:border-slate-850 rounded-xl"
          >
            <Icon icon="lucide:shield-alert" class="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <span class="text-sm text-slate-500">Tidak ada hak akses aktif untuk role ini.</span>
          </div>
        {:else}
          <div class="flex flex-col gap-4">
            {#each activeGroups as group (group.id)}
              <div
                class="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-200/55 dark:border-slate-850"
              >
                <div
                  class="flex items-center gap-2 text-slate-850 dark:text-slate-200 border-b border-slate-200/50 dark:border-slate-800/80 pb-2 mb-1.5"
                >
                  <Icon icon={group.icon} class="w-4 h-4 text-brand-primary" />
                  <span class="text-xs font-bold uppercase tracking-wider">{group.label}</span>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  {#each group.activePermissions as perm (perm.id)}
                    <span
                      class="inline-flex items-center gap-1 text-xs bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-md shadow-xs"
                    >
                      <Icon
                        icon="lucide:check-circle-2"
                        class="w-3 h-3 text-emerald-500 shrink-0"
                      />
                      {perm.label}
                    </span>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Drawer>
