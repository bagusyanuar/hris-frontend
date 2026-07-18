---
name: query-key-factory
description: Panduan dan otomatisasi pembuatan struktur TanStack Query Key Factories untuk pengelolaan cache yang aman, konsisten, dan mudah di-invalidate (Cache Management).
---

# Query Key Factory (TanStack Query Cache Management)

This skill guides you on how to create and manage structured Query Keys in TanStack Query for the HRIS project.

## Mengapa Query Key Factory?
Di aplikasi HRIS, data sangat terhubung. Jika ada HR yang mengubah status "Department" menjadi tidak aktif, tabel departemen di layar lain harus di-*refresh* otomatis. Tanpa Query Key Factory, melakukan `queryClient.invalidateQueries({ queryKey: ['departments'] })` sangat rawan *typo* dan tidak konsisten.

## Aturan Struktur Factory
1. Setiap domain *feature* (misal: Employee, Department, Attendance) harus memiliki satu *Factory Object* (contoh: `departmentKeys`).
2. Struktur hierarkis wajib mengikuti pola dasar ini:
   - `all`: Basis untuk semua query di fitur tersebut.
   - `lists`: Basis untuk semua daftar/tabel.
   - `list(filters)`: Detail daftar dengan filter spesifik (Search Params).
   - `details`: Basis untuk detail item.
   - `detail(id)`: Detail satu item spesifik.

## ✅ Implementasi Standar (Svelte 5 / TS)

Buat file baru di `/runes/[domain]-query.svelte.ts` atau di file terpisah jika besar.

```typescript
// department-query.svelte.ts

export const departmentKeys = {
  all: ['departments'] as const,
  
  // Lists
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...departmentKeys.lists(), { filters }] as const,
  
  // Details
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};
```

## Cara Penggunaan (Invalidation)
Saat melakukan aksi mutasi (Create/Update/Delete):

```typescript
import { useQueryClient } from '@tanstack/svelte-query';

// Di dalam komponen atau query setup
const queryClient = useQueryClient();

const updateMutation = createMutation({
  mutationFn: (data) => api.update(data),
  onSuccess: (updatedData) => {
    // 1. Invalidate list tabel agar data terbaru di-fetch
    queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    
    // 2. Invalidate spesifik detail cache (kalau sedang buka laci detail)
    queryClient.invalidateQueries({ queryKey: departmentKeys.detail(updatedData.id) });
  }
});
```

Selalu gunakan *Skill* ini dan referensi *Factory* di atas setiap kali Anda menulis kode `createQuery` atau `createMutation` baru di TanStack Query!
