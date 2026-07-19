# Rencana Implementasi DataTable Component (Headless + TanStack Table)

Rencana ini memaparkan desain arsitektur, spesifikasi API, dan strategi styling untuk pembuatan component DataTable headless di project `hris-frontend` dengan menggunakan Svelte 5 Runes dan TanStack Table v8.

---

## 🎯 1. Deskripsi & Tujuan

Membuat component DataTable yang fleksibel, modular, dan memiliki DX (Developer Experience) yang luar biasa dengan memisahkan logika table dari presentasi visualnya.

**Mengapa ini penting:**

- **Konsistensi UI:** Memastikan semua table data di aplikasi HRIS (karyawan, payroll, cuti, dll.) memiliki visual, interaksi, dan aksesibilitas yang seragam.
- **Separation of Concerns:** TanStack Table mengurus _state_ (sorting, pagination, filtering, column visibility, row selection), sedangkan Svelte component kita fokus pada render elemen HTML & style (Tailwind v4).
- **Performa Tinggi:** Memanfaatkan Svelte 5 Runes (`$state`, `$derived`) agar reactive update hanya terjadi pada komponen yang mengalami perubahan data.

---

## 🛠️ 2. Dependensi yang Dibutuhkan

Sebelum memulai implementasi, kita perlu menginstall library berikut:

- **`@tanstack/svelte-table`** (versi 8 yang kompatibel dengan Svelte 5)

---

## 🏗️ 3. Arsitektur Folder & File

Component akan ditempatkan di bawah folder shared components:
`src/lib/presentation/shared/components/table/`

```
src/lib/presentation/shared/components/table/
├── index.ts                  # Barrel exports
├── TableRoot.svelte          # Wrapper utama (<Table.Root>)
├── TableHeader.svelte        # Wrapper header (<Table.Header>)
├── TableHead.svelte          # Elemen <th> (<Table.Head>)
├── TableBody.svelte          # Wrapper body (<Table.Body>)
├── TableRow.svelte           # Elemen <tr> (<Table.Row>)
├── TableCell.svelte          # Elemen <td> (<Table.Cell>)
├── TablePagination.svelte    # Panel navigasi halaman (<Table.Pagination>)
├── table.variants.ts         # Variant styling menggunakan CVA
└── helpers.svelte.ts         # Custom rune helper untuk mempermudah inisialisasi table
```

---

## 🎨 4. Spesifikasi Visual & Styling (Tailwind v4 & CVA)

Desain visual akan mengikuti pedoman **Modern SaaS UI**:

- **Header Style:** Soft background (`bg-muted/40`), typography medium, warna muted (`text-muted-foreground`), dengan border tipis di bagian bawah.
- **Row Hover & Active States:** Efek transisi halus (`transition-colors duration-200 hover:bg-muted/30`). Jika row terpilih (selected), background berubah menjadi emerald soft atau brand color soft.
- **Responsive Scroll:** Wrapper container menggunakan overflow-x-auto dengan style scrollbar yang minimalist.
- **Density Variants (via CVA):**
  - `default`: Padding longgar untuk kenyamanan membaca.
  - `compact`: Padding rapat untuk data yang sangat padat.

---

## ⚡ 5. Fitur Utama & Desain API (Brainstorming Results)

### A. Dukungan Server-side Fetch (Manual Operations)

Table ini mendukung fetching data dari backend secara dinamis. State sorting, pagination, dan filtering dikelola secara manual (`manualPagination: true`, `manualSorting: true`, dsb.) dan disinkronkan dengan reactive state Svelte 5.

Contoh integrasi state di Page Component:

```typescript
let pagination = $state({ pageIndex: 0, pageSize: 10 });
let sorting = $state<{ id: string; desc: boolean }[]>([]);

// Terintegrasi otomatis dengan TanStack Query (refetch saat state berubah)
const query = createQuery(() => ({
  queryKey: ['employees', pagination.pageIndex, pagination.pageSize, sorting],
  queryFn: () =>
    fetchEmployees({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sortBy: sorting[0]?.id,
      order: sorting[0]?.desc ? 'desc' : 'asc'
    })
}));
```

### B. Custom Class di Level Column (`meta` definition)

Kita dapat menentukan kustom style untuk masing-masing kolom (misal: alignment text, lebar kolom) lewat konfigurasi `meta` di Column Definition TanStack Table.

```typescript
const columns = [
  {
    accessorKey: 'salary',
    header: 'Basic Salary',
    meta: {
      className: 'text-right font-mono w-[150px]',
      headerClassName: 'text-right'
    }
  }
];
```

### C. Clickable Row & Expandable Row (Sub-row) — ✅ SELESAI

- **Clickable Row:** Komponen `<Table.Row>` dapat menerima event handler `onclick` untuk aksi navigasi atau pemilihan.
- **Expandable Row:** Kita dapat menyisipkan baris detail tambahan di bawah row utama jika status row tersebut dalam keadaan _expanded_.
- **Status implementasi:** `createTableState` mengelola state `expanded` (tipe `ExpandedState`); table mendukung `getExpandedRowModel` + `onExpandedChange` + `getRowCanExpand`. `<Table.Cell>` menerima `colspan` untuk baris detail. Demo: Storybook story **"Expandable Row"** (klik row untuk `row.toggleExpanded()`).
- **⚠️ Catatan adapter (PENTING):** Versi adapter `@tanstack/svelte-table@0.1.2` berbasis Svelte store lama (bukan runes). Di `createSvelteTable`, state di-_snapshot_ saat `setOptions` dan store hanya re-emit ketika `onStateChange` internal-nya terpicu (mode **uncontrolled**). Kalau kita override `onExpandedChange` (mode **controlled** via external `$state`), `onStateChange` tidak terpanggil → store tidak re-emit → `getIsExpanded()` membaca snapshot lama → detail tidak pernah muncul. **Solusi:** untuk expand, pakai uncontrolled (tanpa `state.expanded`/`onExpandedChange`), biarkan table-core mengelola internal. Lihat story **"Expandable Row"**.
- **⚠️ Implikasi lebih luas:** Pola controlled yang sama dipakai untuk `sorting`/`pagination` (external `$state` + `onSortingChange`/`onPaginationChange`), sehingga interaksi klik sort/ganti halaman kemungkinan juga tidak reactive dengan adapter ini. Perlu diperbaiki di level helper (bridge reactive options / upgrade adapter) atau alihkan ke uncontrolled + baca state dari `table.getState()`.

```svelte
{#each table.getRowModel().rows as row}
  <Table.Row onclick={() => row.toggleExpanded()} class="cursor-pointer">
    {#each row.getVisibleCells() as cell}
      <Table.Cell {cell}>
        {cell.getValue()}
      </Table.Cell>
    {/each}
  </Table.Row>

  {#if row.getIsExpanded()}
    <Table.Row class="bg-muted/10 border-l-4 border-brand">
      <Table.Cell colspan={row.getVisibleCells().length}>
        <div class="p-4">
          <!-- Expanded detail content -->
        </div>
      </Table.Cell>
    </Table.Row>
  {/if}
{/each}
```

### D. Custom & Dinamis Cell Styling

Cell component (`<Table.Cell>`) menerima property `class` kustom untuk penulisan style conditional dinamis (misalnya warna teks berdasarkan status data).

```svelte
<Table.Cell
  class={cell.getValue() === 'Active' ? 'text-emerald-600 font-semibold' : 'text-slate-500'}
>
  {cell.getValue()}
</Table.Cell>
```

### E. Handling Loading State & Empty State (Svelte 5 Snippets)

Untuk memberikan feedback yang interaktif, `<Table.Root>` atau `<Table.Body>` akan mendukung:

1.  **`isLoading` Props:** Flag boolean untuk memicu loading state.
2.  **Kustom Loading Component/Snippet:** Menampilkan loader spinner kustom atau custom skeleton rows.
3.  **Kustom Empty State Snippet:** Menampilkan pesan khusus atau ilustrasi menarik saat data kosong (`rowCount === 0`).

```svelte
<Table.Root isLoading={query.isLoading}>
  <!-- Custom Loading State (jika di-pass, akan meng-override spinner default) -->
  {#snippet loading()}
    <Table.Row>
      <Table.Cell colspan={columns.length} class="text-center py-10">
        <MyCustomSpinner class="text-brand" />
        <span class="ml-2">Memuat data karyawan...</span>
      </Table.Cell>
    </Table.Row>
  {/snippet}

  <!-- Custom Empty State (jika di-pass, akan meng-override template default) -->
  {#snippet empty()}
    <div class="flex flex-col items-center justify-center p-8 text-center">
      <Icon name="lucide:inbox" class="w-12 h-12 text-muted-foreground mb-2" />
      <p class="font-medium text-foreground">Tidak ada data karyawan ditemukan</p>
      <p class="text-sm text-muted-foreground">Coba ubah filter pencarian Anda</p>
    </div>
  {/snippet}
</Table.Root>
```

### F. Freeze Column (Sticky Column) — ✅ SELESAI

Mendukung pembekuan kolom di bagian kiri (`pinned: 'left'`) or kanan (`pinned: 'right'`) untuk meningkatkan kegunaan saat melakukan scroll horizontal pada layar desktop atau mobile.

- Penerapan menggunakan CSS `position: sticky` dengan background yang solid agar konten di bawahnya tidak bocor secara visual.
- Z-index terpisah untuk header sticky (`z-20`) dan cell sticky (`z-10`).
- **Multi-pinned cumulative offset:** helper `getPinnedOffset()` menjumlah lebar (`column.getSize()`) kolom pinned sebelum/sesudahnya, di-apply via inline `style` (`left`/`right` + `width`) di `TableHead`/`TableCell`, sehingga 2+ kolom pin di sisi sama tersusun rapi (tidak overlap). Kolom pinned wajib set `size` di column def agar offset pixel-akurat.
- Bg pinned pakai `bg-inherit` (mengikuti warna row: hover/selected/striped).
- Demo: Storybook story **"Freeze Column"**.

```typescript
const columns = [
  {
    accessorKey: 'name',
    header: 'Nama',
    meta: {
      pinned: 'left',
      pinnedOffset: 'left-0'
    }
  }
];
```

### G. Auto Row Index (`showRowIndex`) — ✅ SELESAI

Merender kolom nomor urut otomatis di awal baris.

- Implementasi berbasis kolom (bukan prop): helper `createRowNumberColumn(header?)` mengembalikan `ColumnDef` siap prepend — `columns: [createRowNumberColumn(), ...cols]` — jadi tidak perlu deklarasi manual tiap config.
- `<Table.Cell>` otomatis merender nomornya (deteksi via `ROW_NUMBER_COLUMN_ID`), tanpa boilerplate di loop consumer.
- Kalkulasi selaras pagination aktif: `rowNumber = pageIndex * pageSize + posisiDiPage + 1` (helper `getRowNumber()`), memakai posisi row di page model sehingga **tetap benar setelah sorting** dan berlaku untuk pagination client maupun server.
- Demo: Storybook story **"Row Index"**.

### H. Dynamic Ellipsis Pagination (Sliding Range)

Mendukung pagination dengan range halaman yang dinamis menggunakan tanda ellipsis (`...`) untuk menyembunyikan halaman tengah yang jauh dari halaman aktif.

- Contoh output range: `< 1 ... 5 6 7 8 ... 25 >` atau `< 1 2 3 ... 25 >`.
- Mencegah melimpahnya tombol halaman ketika memiliki total data/halaman yang sangat banyak.

---

## 🧪 6. Rencana Verifikasi & Testing

1. **Storybook Integration:** Bikin Storybook stories untuk DataTable guna menguji berbagai state (Empty State, Loading/Skeleton State, Pagination, Sorting, Row Selection).
2. **Accessibility (a11y) Check:** Memastikan markup table mematuhi standar WAI-ARIA (`role="table"`, `aria-sort`, focus states pada tombol pagination).
3. **Responsive Check:** Memastikan table dapat di-scroll secara horizontal tanpa merusak layout sidebar dan navbar pada resolusi mobile/tablet.
