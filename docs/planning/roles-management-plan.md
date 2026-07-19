# Rencana Implementasi Manajemen Role & Hak Akses (RBAC)

Dokumen ini menjelaskan rencana implementasi fitur Role-Based Access Control (RBAC) pada frontend HRIS, khususnya bagian **Role & Permission Management** menggunakan layout **Vertical Tabs**.

---

## 1. Desain UI & Layout Halaman

Form pembuatan/pengeditan role akan diletakkan di dalam halaman `/roles` (atau dalam modal/drawer, opsional) dengan rancangan visual sebagai berikut:

### Struktur Halaman (Split-Pane Layout)

- **Header Halaman:**
  - Nama Form (misal: "Tambah Role Baru" atau "Ubah Role")
  - Tombol aksi: "Batal" dan "Simpan"
- **Section Atas (Metadata):**
  - Input: **Nama Role** (Required, e.g., "HR Manager")
  - Textarea: **Deskripsi Role** (Optional, e.g., "Mengelola data karyawan dan persetujuan cuti")
- **Section Bawah (Pemberian Akses - Split Screen):**
  - **Pane Kiri (Vertical Tabs):**
    - Daftar kategori modul.
    - Setiap tab memiliki label kategori dan badge jumlah permission yang aktif.
    - Contoh:
      - Kepegawaian `(4/8)`
      - Master Data `(0/10)`
      - Keuangan `(0/6)`
      - Sistem `(0/4)`
  - **Pane Kanan (Permission Grid / Panel Aktif):**
    - Menampilkan tabel berisi modul-modul di bawah kategori yang dipilih di pane kiri.
    - Menyediakan opsi _"Pilih Semua"_ khusus untuk kategori aktif tersebut.
    - Struktur tabel memiliki kolom:
      - **Modul / Resource**
      - **Lihat (Read)** -> Checkbox
      - **Tambah (Create)** -> Checkbox
      - **Ubah (Update)** -> Checkbox
      - **Hapus (Delete)** -> Checkbox
      - **Aksi Khusus** (misalnya: Approval, Proses Payroll) -> Checkbox dengan label spesifik jika ada

---

## 2. Struktur Data (Schema & State)

### Data Model untuk Permission

Setiap item permission diatur dengan format objek standar:

```typescript
interface Permission {
  id: string; // e.g., "employee:create"
  action: string; // e.g., "create"
  resource: string; // e.g., "employee"
  label: string; // e.g., "Tambah Karyawan"
}

interface ModulePermissions {
  moduleName: string; // e.g., "Staff Directory"
  resource: string; // e.g., "employee"
  actions: {
    read?: string; // permission ID for read
    create?: string; // permission ID for create
    update?: string; // permission ID for update
    delete?: string; // permission ID for delete
    special?: Array<{ id: string; label: string }>;
  };
}
```

### Kategori & Grouping (Vertical Tabs Mapping)

Mapping permission ke masing-masing tab secara frontend:

```typescript
const tabCategories = [
  {
    id: 'employees',
    label: 'Kepegawaian',
    modules: [
      {
        moduleName: 'Data Karyawan',
        resource: 'employee',
        actions: {
          read: 'employee:read',
          create: 'employee:create',
          update: 'employee:update',
          delete: 'employee:delete'
        }
      },
      {
        moduleName: 'Presensi',
        resource: 'attendance',
        actions: { read: 'attendance:read', update: 'attendance:update' }
      }
    ]
  },
  {
    id: 'master-data',
    label: 'Master Data',
    modules: [
      {
        moduleName: 'Cabang',
        resource: 'branch',
        actions: {
          read: 'branch:read',
          create: 'branch:create',
          update: 'branch:update',
          delete: 'branch:delete'
        }
      },
      {
        moduleName: 'Departemen',
        resource: 'department',
        actions: {
          read: 'department:read',
          create: 'department:create',
          update: 'department:update',
          delete: 'department:delete'
        }
      }
    ]
  }
  // Tambahkan kategori lain...
];
```

---

## 3. Best Practice & UX Micro-interactions

1. **State Management (Svelte 5 Runes):**
   - Menggunakan `$state` array untuk menyimpan list permission ID yang sedang dicentang (misal: `selectedPermissions: string[]`).
   - Menggunakan `$derived` untuk menghitung badge jumlah aktif pada tab secara otomatis (e.g., menghitung berapa banyak ID di dalam kategori tersebut yang ada di dalam `selectedPermissions`).
2. **Bulk Actions:**
   - Tombol _Select All_ per kategori/tab untuk menghemat waktu pengisian.
3. **Impresi Visual:**
   - Efek hover yang halus pada list tab vertikal.
   - Transisi perpindahan panel kanan yang mulus menggunakan Svelte transition ketika tab di sebelah kiri diklik.
   - Tooltip penjelas jika ada hak akses/action khusus yang berdampak besar.
