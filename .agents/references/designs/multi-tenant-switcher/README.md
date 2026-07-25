# Multi-PT & Multi-Cabang Switcher — Design Reference

Draf desain untuk fitur multi-tenant (multi-PT + multi-cabang) switcher di sidebar HRIS.

## Mockup Files

| File | Opsi | Deskripsi |
|---|---|---|
| `option-a-grouped-switcher.png` | **A — Grouped Switcher** ⭐ | 1 card, 1 dropdown grouped by PT. Paling efisien (1-click switch). |
| `option-b-two-step-cascading.png` | **B — Two-Step Cascading** | 2 card terpisah (PT pill + Branch card). Paling mirip desain existing. |
| `option-c-enhanced-single-card.png` | **C — Enhanced Single Card** | 1 card, dropdown dengan tabs PT + search. Paling scalable. |

## Konteks

- **Existing component:** `src/lib/presentation/shared/components/sidebar/SidebarBranchSwitcher.svelte`
- **Kebutuhan:** User bisa switch antar PT (perusahaan) dan Cabang dalam 1 aplikasi
- **Impact:** Semua data module (employee, attendance, payroll, dll) ter-filter berdasarkan PT + Cabang yang aktif

## Status

- [x] Draf mockup dibuat
- [ ] Desain final dipilih
- [ ] Implementation plan dibuat
- [ ] Implementasi
