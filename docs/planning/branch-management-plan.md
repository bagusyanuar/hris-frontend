# Branch & Multi-Tenancy Management Plan

## 1. Latar Belakang

Owner memiliki kebutuhan agar sistem HRIS dapat mengakomodasi pengelolaan beberapa anak perusahaan atau cabang (Multi-Tenancy) di dalam satu aplikasi yang sama.

Dokumen ini merinci pendekatan arsitektur dan teknis yang akan diimplementasikan untuk mengakomodasi kebutuhan tersebut, memastikan pemisahan data yang aman tanpa harus melakukan _hardcode_ pada setiap endpoint API.

## 2. Konsep Arsitektur

Sistem akan mengadopsi pola **Row-level Multi-Tenancy (Shared Database)**. Artinya, semua data cabang disimpan dalam database yang sama, namun dipisahkan oleh identifikasi cabang (`branch_id` atau `tenant_id`).

Komunikasi konteks cabang antara Frontend dan Backend **TIDAK** menggunakan _Query Parameter_ atau _Request Body_, melainkan **HTTP Header**.

Pendekatan HTTP Header dipilih karena:

- **DRY (Don't Repeat Yourself)**: Cukup disetting satu kali di HTTP Interceptor Frontend, otomatis teraplikasi di seluruh request.
- **Decoupled**: Use Case dan Repository layer di Frontend tidak perlu selalu melempar variabel `branchId`.
- **Clean & Secure**: URL API tetap bersih dan standar REST, menyulitkan manipulasi URL kasat mata.

## 3. Implementasi Frontend (Svelte 5)

### a. Global State Management (Runes)

Membuat file state global menggunakan Svelte 5 runes (contoh: `src/lib/core/state/tenant.svelte.ts`) untuk melacak cabang yang sedang aktif dipilih oleh user.

```typescript
// Konsep Kasar State Tenant
export function useTenant() {
  let activeBranchId = $state<string | null>(null);
  let availableBranches = $state<Branch[]>([]);

  // ... fungsi setBranch(id), initFromStorage(), dll
}
```

### b. Persistensi State

Cabang yang dipilih akan disimpan ke dalam `localStorage` (misal: `hris_active_branch`), sehingga saat halaman di-refresh (F5), aplikasi masih mengingat cabang terakhir yang dibuka user.

### c. UI/UX: Branch Switcher Component

- Menambahkan komponen dropdown (Branch Switcher) di bagian **Header/Topbar** atau **Sidebar**.
- Switcher ini hanya akan **ditampilkan/diaktifkan** jika user yang login memiliki akses ke **lebih dari satu** cabang (contoh: Owner / Super Admin).
- Jika user hanya admin cabang tertentu, Switcher disembunyikan dan sistem otomatis mengunci konteks ke cabang miliknya.

### d. Modifikasi HTTP Interceptor (AppClient)

Memodifikasi `AppClient` atau _Fetch Wrapper_ yang ada di `src/lib/core/network/` untuk menyisipkan header secara otomatis.

```typescript
// Contoh penyisipan interceptor
const activeBranchId = localStorage.getItem('hris_active_branch');
if (activeBranchId) {
  headers['X-Branch-ID'] = activeBranchId;
}
```

## 4. Panduan & Kebutuhan Implementasi Backend

Agar skenario ini berjalan lancar, tim Backend perlu menyesuaikan beberapa hal berikut:

1. **Struktur Database (Row-level Tenant)**
   Menambahkan kolom `branch_id` (foreign key) ke dalam tabel-tabel utama (seperti `departments`, `job_positions`, `employees`).

2. **Middleware / Interceptor di Backend**
   Membuat middleware global yang berjalan sebelum request masuk ke Controller. Middleware ini bertugas:
   - Membaca HTTP Header `X-Branch-ID`.
   - Memvalidasi apakah User yang sedang login (berdasarkan Token JWT) _memang memiliki hak akses_ ke `X-Branch-ID` yang direquest.
   - Mengatur _context_ database connection agar query secara otomatis di-filter dengan `WHERE branch_id = ?`.

3. **Response Login (Auth)**
   Saat user berhasil login, selain mengembalikan Token, API login juga harus mengembalikan array data cabang yang diizinkan untuk user tersebut, contoh:
   ```json
   {
     "token": "ey...",
     "user": {
       "id": 1,
       "name": "Owner",
       "allowedBranches": [
         { "id": "B01", "name": "PT. Pusat" },
         { "id": "B02", "name": "PT. Cabang Bali" }
       ]
     }
   }
   ```
   Data `allowedBranches` ini yang akan digunakan oleh Frontend untuk mengisi daftar pada dropdown Branch Switcher.

## 5. Kesimpulan

Pendekatan ini menjamin fleksibilitas yang sangat tinggi, menjaga kode Frontend tetap bersih (clean architecture), dan memungkinkan sistem HRIS untuk segera scale up menjadi sistem multi-perusahaan/B2B SaaS di masa depan tanpa perombakan drastis.
