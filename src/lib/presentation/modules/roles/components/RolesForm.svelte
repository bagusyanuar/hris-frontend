<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { RoleModel, CreateRoleInput } from '$lib/core/roles';
  import { Button } from '$lib/presentation/shared/components/button';
  import { TextField } from '$lib/presentation/shared/components/textfield';
  import { useRolesForm } from '../runes/roles-form.svelte';

  interface Props {
    role?: RoleModel | null;
    isSubmitting?: boolean;
    onsubmit: (input: CreateRoleInput) => void | Promise<void>;
    oncancel: () => void;
  }

  let { role = null, isSubmitting = false, onsubmit, oncancel }: Props = $props();

  const isEditMode = $derived(role !== null);

  const { form, errors, enhance, load, submitting } = useRolesForm(async (input) => {
    await onsubmit(input);
  });

  $effect(() => {
    load(role);
  });

  // Vertical Tabs permissions data mapping with feature grouping
  const permissionTabs = [
    {
      id: 'employees',
      label: 'Kepegawaian',
      icon: 'lucide:users',
      features: [
        {
          name: 'Data Karyawan',
          permissions: [
            {
              id: 'employee:read',
              label: 'Melihat Data Karyawan',
              desc: 'Melihat direktori karyawan dan profile detail'
            },
            {
              id: 'employee:create',
              label: 'Tambah Karyawan',
              desc: 'Menambahkan data karyawan baru'
            },
            {
              id: 'employee:update',
              label: 'Ubah Karyawan',
              desc: 'Mengedit data profil karyawan'
            },
            { id: 'employee:delete', label: 'Hapus Karyawan', desc: 'Menghapus data karyawan' }
          ]
        },
        {
          name: 'Presensi / Kehadiran',
          permissions: [
            {
              id: 'attendance:read',
              label: 'Melihat Presensi',
              desc: 'Melihat log kehadiran dan absensi'
            },
            {
              id: 'attendance:update',
              label: 'Kelola Presensi',
              desc: 'Mengubah atau mengoreksi data presensi'
            }
          ]
        }
      ]
    },
    {
      id: 'master',
      label: 'Master Data',
      icon: 'lucide:database',
      features: [
        {
          name: 'Cabang',
          permissions: [
            {
              id: 'branch:read',
              label: 'Melihat Cabang',
              desc: 'Melihat daftar cabang perusahaan'
            },
            { id: 'branch:create', label: 'Tambah Cabang', desc: 'Menambahkan cabang baru' },
            { id: 'branch:update', label: 'Ubah Cabang', desc: 'Mengubah data cabang' },
            { id: 'branch:delete', label: 'Hapus Cabang', desc: 'Menghapus cabang' }
          ]
        },
        {
          name: 'Departemen',
          permissions: [
            {
              id: 'department:read',
              label: 'Melihat Departemen',
              desc: 'Melihat daftar departemen'
            },
            {
              id: 'department:create',
              label: 'Tambah Departemen',
              desc: 'Membuat departemen baru'
            },
            {
              id: 'department:update',
              label: 'Ubah Departemen',
              desc: 'Mengubah nama/detail departemen'
            },
            { id: 'department:delete', label: 'Hapus Departemen', desc: 'Menghapus departemen' }
          ]
        }
      ]
    },
    {
      id: 'finance',
      label: 'Keuangan',
      icon: 'lucide:banknote',
      features: [
        {
          name: 'Payroll (Gaji Karyawan)',
          permissions: [
            {
              id: 'payroll:read',
              label: 'Melihat Payroll',
              desc: 'Melihat daftar dan status payroll'
            },
            {
              id: 'payroll:create',
              label: 'Buat Payroll Draft',
              desc: 'Menyiapkan draft payroll bulanan'
            },
            { id: 'payroll:update', label: 'Ubah Payroll', desc: 'Mengedit komponen payroll' },
            { id: 'payroll:delete', label: 'Hapus Payroll', desc: 'Menghapus draft payroll' },
            {
              id: 'payroll:run',
              label: 'Proses/Jalankan Payroll',
              desc: 'Menyetujui dan memproses payroll menjadi payslip'
            }
          ]
        },
        {
          name: 'Slip Gaji (Payslip)',
          permissions: [
            {
              id: 'payslip:read',
              label: 'Melihat Slip Gaji',
              desc: 'Mengakses dan mengunduh payslip karyawan'
            }
          ]
        }
      ]
    },
    {
      id: 'system',
      label: 'Sistem',
      icon: 'lucide:settings',
      features: [
        {
          name: 'Manajemen User',
          permissions: [
            {
              id: 'user:read',
              label: 'Melihat Pengguna',
              desc: 'Melihat daftar akun pengguna sistem'
            },
            { id: 'user:create', label: 'Tambah Pengguna', desc: 'Membuat akun pengguna baru' },
            { id: 'user:update', label: 'Ubah Pengguna', desc: 'Mengubah role dan status akun' },
            { id: 'user:delete', label: 'Hapus Pengguna', desc: 'Menghapus akun pengguna' }
          ]
        },
        {
          name: 'Role & Hak Akses',
          permissions: [
            { id: 'role:read', label: 'Melihat Role', desc: 'Melihat daftar role & hak akses' },
            { id: 'role:create', label: 'Tambah Role', desc: 'Membuat role hak akses baru' },
            { id: 'role:update', label: 'Ubah Role', desc: 'Mengubah detail & izin role' },
            { id: 'role:delete', label: 'Hapus Role', desc: 'Menghapus role hak akses' }
          ]
        }
      ]
    }
  ];

  let activeTab = $state('employees');

  const activeTabFeatures = $derived(
    permissionTabs.find((t) => t.id === activeTab)?.features ?? []
  );

  const isAllActiveTabChecked = $derived.by(() => {
    if (activeTabFeatures.length === 0) return false;
    return activeTabFeatures.every((f) =>
      f.permissions.every((p) => $form.permissions.includes(p.id))
    );
  });

  function getActiveCount(tabId: string) {
    const tab = permissionTabs.find((t) => t.id === tabId);
    if (!tab) return 0;
    let count = 0;
    for (const f of tab.features) {
      count += f.permissions.filter((p) => $form.permissions.includes(p.id)).length;
    }
    return count;
  }

  function getTabTotal(tabId: string) {
    const tab = permissionTabs.find((t) => t.id === tabId);
    if (!tab) return 0;
    return tab.features.reduce((acc, f) => acc + f.permissions.length, 0);
  }

  function toggleAllInActiveTab() {
    const allIds = activeTabFeatures.flatMap((f) => f.permissions.map((p) => p.id));
    if (isAllActiveTabChecked) {
      $form.permissions = $form.permissions.filter((id) => !allIds.includes(id));
    } else {
      const combined = new Set([...$form.permissions, ...allIds]);
      $form.permissions = Array.from(combined);
    }
  }

  function handlePermissionToggle(id: string) {
    if ($form.permissions.includes(id)) {
      $form.permissions = $form.permissions.filter((pId) => pId !== id);
    } else {
      $form.permissions = [...$form.permissions, id];
    }
  }

  function isFeatureAllChecked(feature: (typeof permissionTabs)[0]['features'][0]) {
    return feature.permissions.every((p) => $form.permissions.includes(p.id));
  }

  function toggleFeature(feature: (typeof permissionTabs)[0]['features'][0]) {
    const ids = feature.permissions.map((p) => p.id);
    if (isFeatureAllChecked(feature)) {
      $form.permissions = $form.permissions.filter((id) => !ids.includes(id));
    } else {
      const combined = new Set([...$form.permissions, ...ids]);
      $form.permissions = Array.from(combined);
    }
  }
</script>

<form id="roles-form" method="POST" use:enhance class="flex flex-col gap-6">
  <!-- Meta Fields -->
  <div
    class="flex flex-col gap-5 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800"
  >
    <div class="flex flex-col gap-1 border-b border-slate-250 dark:border-slate-800/80 pb-3">
      <span class="text-sm font-semibold text-slate-900 dark:text-white">Informasi Role</span>
      <span class="text-xs text-slate-500"
        >Definisikan nama dan deskripsi peranan hak akses ini.</span
      >
    </div>

    <div class="flex flex-col gap-4">
      <TextField
        name="name"
        label="Nama Role"
        placeholder="Contoh: HR Supervisor, Finance Admin"
        bind:value={$form.name}
        error={$errors.name?.[0]}
        required
      />

      <div class="flex flex-col gap-1.5">
        <label for="description" class="text-sm font-medium text-slate-700 dark:text-slate-300">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows="2"
          placeholder="Jelaskan deskripsi tanggung jawab role ini..."
          bind:value={$form.description}
          class="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        ></textarea>
        {#if $errors.description?.[0]}
          <span class="text-xs text-red-500">{$errors.description[0]}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Permissions Workspace -->
  <div
    class="bg-white dark:bg-slate-900/10 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col gap-6"
  >
    <div
      class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4"
    >
      <div class="flex flex-col gap-1">
        <span class="text-sm font-semibold text-slate-900 dark:text-white"
          >Pengaturan Hak Akses</span
        >
        <span class="text-xs text-slate-500">Pilih akses modul yang diizinkan untuk role ini.</span>
      </div>
      <span
        class="inline-flex items-center rounded-md bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-primary border border-brand-primary/10 shadow-2xs font-mono"
      >
        Total {$form.permissions.length} Akses Terpilih
      </span>
    </div>

    <!-- Split Pane Workspace -->
    <div class="flex flex-col md:flex-row gap-6 min-h-[400px]">
      <!-- Left Vertical Tabs -->
      <div
        class="w-full md:w-56 shrink-0 flex flex-col gap-1 md:border-r md:border-slate-200 md:dark:border-slate-800 md:pr-4"
      >
        {#each permissionTabs as tab (tab.id)}
          {@const count = getActiveCount(tab.id)}
          {@const total = getTabTotal(tab.id)}
          <button
            type="button"
            class="flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-200 group border {activeTab ===
            tab.id
              ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary font-semibold shadow-xs'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'}"
            onclick={() => (activeTab = tab.id)}
          >
            <div class="flex items-center gap-2.5">
              <Icon
                icon={tab.icon}
                class="w-4 h-4 transition-transform duration-200 group-hover:scale-105"
              />
              <span class="text-xs">{tab.label}</span>
            </div>
            <span
              class="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold font-mono border transition-all duration-200 {count >
              0
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}"
            >
              {count}/{total}
            </span>
          </button>
        {/each}
      </div>

      <!-- Right Permissions Grid -->
      <div class="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
        <div
          class="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/55 dark:border-slate-800/80"
        >
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider"
            >Izin Akses</span
          >
          <button
            type="button"
            class="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1.5"
            onclick={toggleAllInActiveTab}
          >
            <Icon
              icon={isAllActiveTabChecked ? 'lucide:check-square' : 'lucide:square'}
              class="w-4 h-4"
            />
            {isAllActiveTabChecked ? 'Hapus Semua Centang' : 'Pilih Semua'}
          </button>
        </div>

        <div class="flex flex-col gap-5">
          {#each activeTabFeatures as feature (feature.name)}
            {@const isFeatChecked = isFeatureAllChecked(feature)}
            <div
              class="flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/80"
            >
              <div
                class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2 mb-1"
              >
                <span
                  class="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wider"
                  >{feature.name}</span
                >
                <button
                  type="button"
                  class="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1.5 cursor-pointer"
                  onclick={() => toggleFeature(feature)}
                >
                  <Icon
                    icon={isFeatChecked ? 'lucide:check-square' : 'lucide:square'}
                    class="w-3.5 h-3.5"
                  />
                  Pilih Semua
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {#each feature.permissions as perm (perm.id)}
                  {@const isChecked = $form.permissions.includes(perm.id)}
                  <button
                    type="button"
                    class="flex items-start gap-3 p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer {isChecked
                      ? 'bg-white dark:bg-slate-950 border-brand-primary/30 shadow-2xs'
                      : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-750'}"
                    onclick={() => handlePermissionToggle(perm.id)}
                  >
                    <div class="pt-0.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        class="h-4.5 w-4.5 rounded-md border-slate-300 dark:border-slate-700 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        readonly
                      />
                    </div>
                    <div class="flex flex-col gap-0.5">
                      <span class="text-sm font-semibold text-slate-850 dark:text-slate-200"
                        >{perm.label}</span
                      >
                      <span class="text-xs text-slate-500 dark:text-slate-400 leading-normal"
                        >{perm.desc}</span
                      >
                    </div>
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Form Actions -->
  <div
    class="flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800 pt-6"
  >
    <Button
      variant="outline"
      onclick={oncancel}
      disabled={$submitting || isSubmitting}
      type="button"
    >
      Batal
    </Button>
    <Button
      variant="primary"
      type="submit"
      form="roles-form"
      isLoading={$submitting || isSubmitting}
      loadingText="Menyimpan..."
    >
      {isEditMode ? 'Simpan Perubahan' : 'Tambah Role'}
    </Button>
  </div>
</form>
