# Error Handling & Validation Rules

Mencegah aplikasi *crash* (White Screen of Death) dan memberikan *feedback* error yang jelas kepada user adalah kunci dari aplikasi *SaaS/Enterprise* seperti HRIS.

## 1. Mencegah Crash pada Komponen UI

- **Rule:** Komponen Presentasi (Svelte) **TIDAK BOLEH** menebak struktur object error dari backend secara langsung (misal: `catch (e) { toast.error(e.response.data.message) }`).
- **Solusi (AppError Pattern):**
  Semua error dari HTTP client (seperti Axios atau Fetch) harus ditangkap di *Infrastructure Layer* (Repository) dan di-mapping menjadi instance `AppError` standar sebelum dikembalikan ke *Use Case* dan UI.

### ✅ Correct (UI Layer)
```svelte
try {
	await submitMutation.mutateAsync(data);
} catch (err) {
	// err sudah dijamin merupakan instance dari Error / AppError oleh Infrastructure Layer
	toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
}
```

## 2. API Response Wrapper

Semua API call di *Infrastructure layer* harus menggunakan pembungkus `handleAppError` (dari `$lib/infrastructure/http/error.mapper`) untuk otomatis menerjemahkan raw Axios/HTTP errors menjadi instance `AppError` yang ramah (User Friendly).

### ✅ Correct (Infrastructure Layer - Repository Impl)
```typescript
import { handleAppError } from '$lib/infrastructure/http/error.mapper';

async getAll(): Promise<Model[]> {
	return handleAppError(async () => {
		const response = await httpClient.get('/v1/data');
		return Mapper.toDomainList(response.data.data);
	});
}
```

- `400 Bad Request` -> Tampilkan pesan error validasi (form).
- `401 Unauthorized` -> Redirect ke login (dilakukan via interceptor global).
- `403 Forbidden` -> "Anda tidak memiliki akses ke fitur ini".
- `404 Not Found` -> "Data tidak ditemukan".
- `500 Internal Error` -> "Terjadi kesalahan pada server. Silakan coba beberapa saat lagi."

## 3. Zod untuk Validasi Skema (Form & Payload)

Gunakan **Zod** (`z`) untuk memvalidasi *input* form di layer presentasi dan *payload* API di layer infrastruktur. 
- Pesan *error* dari Zod harus di-mapping dan dilempar ke prop `error={...}` pada komponen form (seperti `TextField` atau `Combobox`).

### 3.1 Lokasi & Penamaan Schema
- Skema validasi Zod tinggal di **Infrastructure layer**: `src/lib/infrastructure/[domain]/[domain].validator.ts`.
- Ekspor per operasi: `Create[Domain]Schema`, dan turunkan update-nya dari create (jangan tulis ulang field): `export const UpdateDepartmentSchema = CreateDepartmentSchema.and(z.object({ id: z.string().min(1) }));`.
- **Nullable vs optional (CRITICAL):** kalau domain model memakai `T | null` (mis. `parentId: string | null`), pakai `z.string().nullable().default(null)` — **bukan** `.optional()`. `.optional()` menyisipkan `undefined` ke tipe hasil-infer schema, sehingga tidak assignable ke `CreateXInput` yang mengharuskan `string | null` (error TS2345 "Type 'undefined' is not assignable to type 'string | null'").

### 3.2 Zod v4 + superForm Adapter (CRITICAL)
Project ini pakai **Zod v4**. Adapter superForm harus `zod4`, **bukan** `zod`:

```ts
// ✅ Zod v4
import { zod4 } from 'sveltekit-superforms/adapters';
```

Memakai adapter `zod` yang lama pada schema Zod v4 melempar runtime error:
> `SchemaError: No shape could be created for schema. If using Zod v4, import { zod4 } from "sveltekit-superforms/adapters" instead of { zod }.`

Dengan `zod4`, tipe sudah cocok — **jangan** tambahkan cast `as unknown as ...` pada schema.

### 3.3 superForm SPA di-init di Rune, bukan di Komponen
Inisialisasi superForm (adapter + validators + `onUpdate`) tinggal di **rune factory** presentation layer, bukan inline di `.svelte`. Rune juga mengekspos helper `load()` untuk populate/reset (lihat §3.4). Komponen hanya menyimpan binding template (`$form`, `$errors`, `enhance`) — **tanpa** shadow state atau `$effect` sinkronisasi per-widget.

Mapping **Model → Input** hidup di **Core**, bukan di rune atau di infra `*.mapper.ts`. Ini transform Core-type → Core-type (tak menyentuh Schema snake_case), jadi masuk **Domain Service** `[Domain]Service` (lihat `architecture/ddd.md` — Domain Service = operasi domain murni/stateless), bareng transform murni lain (`buildTree`, `getAssignableParents`):

```ts
// core/[domain]/[domain].service.ts — pure & stateless, tanpa repository
export class DepartmentService {
	/** Projects a department into the create/update form input shape (Model -> Input). */
	static toInput(department: DepartmentModel): CreateDepartmentInput {
		return { code: department.code, name: department.name, description: department.description ?? '', parentId: department.parentId, status: department.status };
	}
	// static buildTree(...) { }  static getAssignableParents(...) { }
}
```

> **Jangan** taruh `toInput` di `infrastructure/[domain]/[domain].mapper.ts` (itu batas API — **Schema ↔ Model**), **jangan** di `[Domain]UseCase` (itu untuk orkestrasi async + aturan bisnis: `create`/`update`/`delete` + repository). `toInput` murni & sinkron → **Domain Service**.

```ts
// presentation/modules/[domain]/runes/[domain]-form.svelte.ts
import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { DepartmentService, type CreateDepartmentInput, type DepartmentModel } from '$lib/core/department';
import { CreateDepartmentSchema } from '$lib/infrastructure/department/department.validator';

// Harus dipanggil sinkron di top-level <script> komponen — superForm memakai onDestroy.
export function useDepartmentForm(onValid: (input: CreateDepartmentInput) => void | Promise<void>) {
	const sf = superForm<CreateDepartmentInput>(defaults(zod4(CreateDepartmentSchema)), {
		SPA: true,
		validators: zod4(CreateDepartmentSchema),
		async onUpdate({ form }) {
			if (form.valid) await onValid(form.data);
		}
	});

	return {
		...sf,
		// Populate dari record (edit) atau reset ke default Zod (create). Mapping di Core Service.
		load: (d: DepartmentModel | null) => sf.reset(d ? { data: DepartmentService.toInput(d) } : undefined)
	};
}
```

> Domain Service dipanggil langsung dari Presentation (`DepartmentService.toInput(...)`, `DepartmentService.buildTree(...)`) — **tanpa** `provide[Domain]UseCase()`. Pakai provider/UseCase hanya untuk operasi yang menyentuh repository (fetch/persist).

```svelte
<!-- Komponen: bungkus callback prop dalam closure agar membaca nilai prop terkini -->
<!-- (hindari warning Svelte state_referenced_locally / initial-value capture). -->
const { form, errors, enhance, load, submitting } = useDepartmentForm((input) => onsubmit(input));
```

**Kenapa closure?** Meneruskan prop `onsubmit` langsung (`useDepartmentForm(onsubmit)`) hanya menangkap nilai awalnya; membungkusnya `(input) => onsubmit(input)` memastikan submit memanggil `onsubmit` versi terbaru.

**Alur submit end-to-end:** komponen `onValid` → panggil prop `onsubmit` (data sudah tervalidasi & type-safe) → page `handleSubmit` → `mutateAsync` (toast & invalidate ditangani di `onError`/`onSuccess` mutation, lihat skill `tanstack-query`).

### 3.4 Reset/Populate Form: `reset({ data })` + Function Binding (CRITICAL)
Untuk populate (edit) & reset (create), **jangan** assign `$form = {...}` manual dan **jangan** buat shadow `$state` + `$effect` sinkronisasi per widget. Dua anti-pattern ini yang bikin file membengkak saat field bertambah, plus 2 bug halus.

**a. Pakai `reset({ data })`, bukan `$form = {...}`.** `$form = {...}` hanya menimpa data — **errors** dan **tainted** dari sesi sebelumnya tertinggal (form dibuka ulang masih merah). `reset()` membersihkan data + errors + tainted sekaligus. Populate/reset dijalankan lewat satu `$effect` tipis yang hanya bergantung pada `open`:

```svelte
// Populate saat edit, reset ke default saat create. Nol enumerasi field di komponen.
$effect(() => {
	if (open) load(department);
});
```

> **Jangan** masukkan `parentOptions` (atau data async lain) sebagai dependency effect populate. Kalau options datang belakangan, effect re-run dan **menimpa** editan user. Combobox cukup men-*derive* label dari `$form.parentId` (lihat b).

**b. Widget non-teks pakai function binding (get/set) langsung ke `$form`** — hapus shadow `$state` + `$effect` sinkronisasi. Butuh Svelte ≥ 5.9.

```svelte
<!-- Switch: boolean <-> enum status -->
<Switch bind:checked={
	() => $form.status === 'active',
	(v) => ($form.status = v ? 'active' : 'inactive')
} />

<!-- Combobox: Option {value,label} <-> id primitif di $form.parentId -->
<Combobox
	options={parentOptions}
	bind:value={
		() => parentOptions.find((o) => String(o.value) === $form.parentId),
		(opt) => ($form.parentId = opt ? String(opt.value) : null)
	}
/>
```

**Hasil scaling:** tambah field baru = sentuh **2 tempat** saja — `toInput` di rune + input-nya di markup. Tidak ada `$state` baru, `$effect` baru, atau blok populate yang memanjang. TextField yang bind langsung ke `$form` bahkan nol usaha.

> Svelte < 5.9 (tanpa function binding): fallback pakai `$derived` untuk getter Combobox, bukan menghidupkan lagi shadow `$state` + `$effect`.
