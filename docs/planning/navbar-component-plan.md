# Navbar Component Architecture Plan

Dokumen ini merangkum rencana arsitektur untuk memecah UI Navbar (Header) berdasarkan apa yang sudah kita buat di halaman Demo (`+page.svelte`) menjadi komponen-komponen Svelte 5 yang modular dan *reusable*.

## Target Direktori
`src/lib/presentation/shared/components/navbar/`

---

## 1. Komponen Utama (Root)
### `Navbar.svelte`
- **Fungsi**: *Wrapper* utama `<header>` yang menampung seluruh elemen navigasi atas.
- **Tanggung Jawab**: Mengatur layout flexbox utama, memberikan efek *glassmorphism* (jika ada), jarak (padding), dan menjadi wadah bagi snippet/slot komponen anak.

---

## 2. Bagian Kiri (Navigasi & Konteks)
### `NavbarMobileToggle.svelte`
- **Fungsi**: Tombol hamburger yang hanya muncul di layar kecil (*mobile*).
- **Tanggung Jawab**: Memicu/mengubah state `isMobileOpen = true` untuk membuka *Drawer Mobile Sidebar*.

### `NavbarSidebarToggle.svelte`
- **Fungsi**: Tombol ikon sidebar khusus untuk desktop.
- **Tanggung Jawab**: Memicu/mengubah state `isCollapsed = !isCollapsed` untuk menyusutkan atau memperlebar *Desktop Sidebar*.

### `NavbarBreadcrumbs.svelte`
- **Fungsi**: Penunjuk posisi halaman saat ini (contoh: `Pages > Dashboard`).
- **Tanggung Jawab**: Mengambil state nama menu yang sedang aktif (`activeMenu`) dan menampilkannya secara dinamis.

---

## 3. Bagian Tengah/Pencarian
### `NavbarSearch.svelte`
- **Fungsi**: Input bar pencarian global lengkap dengan *Command Palette shortcut* (⌘K).
- **Tanggung Jawab**: 
  - Mengelola *state input text* (`searchQuery`).
  - Mengelola *state focus* (`isSearchFocused`).
  - Menampilkan *Dropdown Popover* hasil pencarian/pencarian terakhir (Recent Searches) dengan animasi Svelte (transition).

---

## 4. Bagian Kanan (Utilitas & Profil)
### `NavbarThemeToggle.svelte`
- **Fungsi**: Tombol *switch* terang / gelap.
- **Tanggung Jawab**: Berinteraksi dengan fungsi `toggleTheme()` dan mengubah *icon* berdasarkan status `isDark`.

### `NavbarNotifications.svelte`
- **Fungsi**: Ikon lonceng notifikasi lengkap dengan lencana (titik merah).
- **Tanggung Jawab**: (Di masa depan) menampilkan *dropdown* pemberitahuan masuk.

---

## Contoh Penggunaan (Draft)

Implementasi yang sangat bersih di halaman atau `+layout.svelte`:

```svelte
<Navbar>
    <!-- Grup Kiri -->
    <div class="flex items-center gap-3">
        <NavbarMobileToggle bind:isOpen={isMobileOpen} />
        <NavbarSidebarToggle bind:isCollapsed={isCollapsed} />
        <NavbarBreadcrumbs {activeMenu} />
    </div>

    <!-- Tengah (Search) -->
    <NavbarSearch bind:searchQuery bind:activeMenu />

    <!-- Grup Kanan -->
    <div class="flex items-center gap-3">
        <NavbarThemeToggle {isDark} toggleFn={toggleTheme} />
        <NavbarNotifications hasUnread={true} />
    </div>
</Navbar>
```
