# Sidebar Component Architecture Plan

Dokumen ini merangkum rencana arsitektur untuk memecah UI Sidebar yang ada di halaman Demo menjadi komponen-komponen Svelte 5 yang lebih kecil, modular, dan *reusable*, sesuai dengan prinsip Component-Driven Development dan Clean Architecture.

## Target Direktori
`src/lib/presentation/shared/components/sidebar/`

---

## 1. Komponen Utama (Root)
### `Sidebar.svelte`
- **Fungsi**: Komponen *wrapper* utama pembungkus sidebar.
- **Tanggung Jawab**: Mengatur *global layout*, mengurus transisi responsif lebar (`w-64` ke `w-20`), dan menyimpan Svelte 5 Context State (seperti `isCollapsed` dan `isMobileOpen`) menggunakan rune `$state` yang di-*share* ke semua *child components* di dalamnya.

---

## 2. Bagian Header & Identitas
### `SidebarBrand.svelte` (atau `SidebarHeader.svelte`)
- **Fungsi**: Menampilkan logo perusahaan dan nama aplikasi (TALENTFLOW).
- **Tanggung Jawab**: Menangani logika penyusutan ukuran ikon saat sidebar masuk ke mode mini (*collapsed*).

### `SidebarBranchSwitcher.svelte`
- **Fungsi**: Komponen dropdown khusus untuk memilih cabang.
- **Tanggung Jawab**: Memiliki state internal sendiri untuk daftar cabang, tombol pemicu, dan *flyout pop-up* di sebelah kanan.

---

## 3. Bagian Navigasi (Menu)
### `SidebarNav.svelte`
- **Fungsi**: Wrapper pembungkus area *scrollable* utama untuk menu-menu navigasi.

### `SidebarGroup.svelte`
- **Fungsi**: Label pemisah antar kategori menu (contoh: teks "EMPLOYEES", "FINANCE", "SETTINGS").
- **Tanggung Jawab**: Akan otomatis tersembunyi ketika mode *collapsed*.

### `SidebarItem.svelte`
- **Fungsi**: Komponen standar untuk tombol menu tunggal (seperti Dashboard, Expenses).
- **Tanggung Jawab**: Menerima *props* `icon`, `label`, `isActive`, dan menangani animasi *hover* serta `justify-center` saat mode *collapsed*.

### `SidebarExpandable.svelte`
- **Fungsi**: Komponen untuk menu bercabang (seperti Payroll yang punya sub-menu Run Payroll & Payslips).
- **Tanggung Jawab**: Berisi logika akordeon (`isExpanded`), animasi *slide*, dan secara otomatis berubah menjadi *flyout* saat sidebar dalam mode *collapsed*.

---

## 4. Bagian Footer & User
### `SidebarProfile.svelte`
- **Fungsi**: Membungkus avatar user, nama, role, beserta *pop-up dropdown* (My Profile, Log Out).
- **Tanggung Jawab**: Mengatur event *click-outside* sendiri dan mengatur posisi *flyout* ke kanan sidebar (mengikuti posisi tombol).

### `SidebarVersioning.svelte` (Opsional)
- **Fungsi**: Menampilkan teks versi sistem (contoh: "TalentFlow v1.0.0-Beta") di bagian paling bawah.

---

## Contoh Penggunaan (Draft)

Nantinya, implementasi di halaman `+page.svelte` (atau di dalam Root Layout) akan menjadi sangat rapi dan deklaratif seperti ini:

```svelte
<Sidebar bind:isCollapsed>
    <SidebarBrand />
    <SidebarBranchSwitcher {branches} bind:activeBranch />
    
    <SidebarNav>
        <SidebarGroup title="EMPLOYEES" />
        <SidebarItem icon="lucide:grid" label="Dashboard" isActive={true} />
        <SidebarItem icon="lucide:users" label="Staff Directory" />
        
        <SidebarGroup title="FINANCE" />
        <SidebarExpandable icon="lucide:banknote" label="Payroll">
            <SidebarItem label="Run Payroll" />
            <SidebarItem label="Payslips" />
        </SidebarExpandable>
    </SidebarNav>

    <SidebarProfile user={currentUser} />
</Sidebar>
```
