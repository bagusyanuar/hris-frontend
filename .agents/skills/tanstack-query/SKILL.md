---
name: tanstack-query-guidelines
description: Guidelines and templates for writing Svelte 5 Custom Runes using TanStack Query v6, integrated with DDD Clean Architecture and AppError.
---

# TanStack Query & Svelte 5 Guidelines

This skill provides the patterns, structures, and guidelines for using **TanStack Query (Svelte Query v6)** inside the HRIS frontend, ensuring strict alignment with Svelte 5 Runes, Clean Architecture (DDD), and our domain-specific `AppError`.

## 0. Setup Prerequisite: `QueryClientProvider`

TanStack Query only works if a `QueryClient` is provided above every component that calls `createQuery`/`createMutation`. This is already wired once, globally — do not re-create it per domain/module.

- **Instance:** `src/lib/infrastructure/query/query-client.ts` exports the singleton `queryClient`.
- **Mount point:** `src/routes/+layout.svelte` (root layout) wraps `{@render children()}` in `<QueryClientProvider client={queryClient}>`.

If you're scaffolding a brand-new project or find this wiring missing, that's the fix — never work around a missing provider by instantiating a local `new QueryClient()` inside a page or rune.

---

## 1. Architectural Rules

- **Infrastructure Layer:** Axios `httpClient` calls the backend APIs. Custom Repository implementations MUST catch errors and map them to domain `AppError` subclasses using `HttpErrorMapper.toDomain(error)` (or throw `AppError` subclasses directly for mock repositories — see `department.repository.impl.ts` for a mock example).
- **Core Layer:** One `[Domain]UseCase` class per domain (per `architecture/ddd.md`), exposing multiple methods (`getAll`, `getById`, `create`, `update`, `delete`, ...) — **not** one UseCase class per CRUD operation. Every method that can fail on bad input or business-rule violations MUST throw an `AppError` subclass (`ValidationError`, `NotFoundError`, ...), never a plain `Error`. This is what makes `TError = AppError` in the generics below true at runtime, not just in the type signature.
- **Infrastructure `[domain].provider.ts`:** Exposes exactly one `provide[Domain]UseCase()` singleton factory (Core + `repository.impl.ts` only — see the Dependency Direction rule in `architecture/ddd.md`, infra must never import Presentation).
- **Presentation Layer (Custom Query Runes):** This is where TanStack Query is used. Encapsulate `createQuery`/`createMutation` in **function-based Custom Runes** located in `src/lib/presentation/modules/[domain]/runes/[domain]-query.svelte.ts`. Each rune function calls `provide[Domain]UseCase()` directly — there is no intermediate class Store for domain/list data anymore.
- **Presentation Layer (UI/Pages):** Svelte page components consume the custom query runes. They MUST NOT import `@tanstack/svelte-query` directly. Pure derived helpers like `buildTree`/`getAssignableParents`/`toInput` are a **Domain Service** in Core (`$lib/core/[domain]`) — call them directly (`DepartmentService.buildTree(...)`), **no** provider needed. Only reach for `provide[Domain]UseCase()` when you need an actual repository-backed operation from the page (rare — usually the query rune already wraps it).

```
[UI Component] ---> [Custom Query Rune] ---> [Use Case] ---> [Repository Impl] ---> [Axios Client]
                      (createQuery/Mutation)                   (error.mapper)
```

### When to use a query rune vs. a class-based Store

- **Query rune (function, this skill) — default for any domain data that is fetched/listed/mutated** (master data, employee lists, attendance, payroll, ...). Gives you caching, dedup, background refetch, and invalidation for free; no hand-rolled `isLoading`/`error` state.
- **Class-based Store (`[Domain]Store.svelte.ts`, see `svelte/conventions.md` rule #9)** — reserve for **pure client-side UI state that never touches the server**: multi-step wizard progress, sidebar collapse state, in-memory filter/selection state, or session state like the current authenticated user. If a Store method ends up calling a UseCase to fetch/persist data, it should almost always be a query rune instead.

---

## 2. Query Key Design & DRY Factory Pattern

To maintain **DRY** (Don't Repeat Yourself) principles and ensure robust cache invalidation, Query Keys must not be inline arrays. Instead, define a **Query Key Factory** in the **Presentation Layer** right next to your runes.

### Directory Placement

```
src/lib/presentation/modules/[domain]/runes/
├── [domain].keys.ts         <-- Query Key Factory
└── [domain]-query.svelte.ts <-- Svelte Query Runes (queries + mutations)
```

### Factory Template (`[domain].keys.ts`)

Use `as const` assertions to ensure TypeScript registers keys as strict read-only tuples.

> [!IMPORTANT]
> **Clean Architecture Boundary Rule:**
> All UI parameters, query filters, and data types used in Key Factories and Query Runes **MUST be imported from the Core Layer** (e.g. `$lib/core/[domain]/*.model.ts`).
> **NEVER import API Schemas (`*.schema.ts`) from the Infrastructure Layer** into the Presentation Layer. This keeps the UI decoupled from backend database casing (e.g. snake_case) and naming conventions.

```typescript
import type { DepartmentParams } from '$lib/core/department'; // ALWAYS import from Core, NEVER from Schema

export const departmentKeys = {
  all: ['department'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params?: DepartmentParams) => [...departmentKeys.lists(), params ?? {}] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const
};
```

### Invalidation Examples:

- **Invalidate all** department data: `queryClient.invalidateQueries({ queryKey: departmentKeys.all })`
- **Invalidate only lists** (keeping details cached): `queryClient.invalidateQueries({ queryKey: departmentKeys.lists() })`
- **Invalidate a specific detail**: `queryClient.invalidateQueries({ queryKey: departmentKeys.detail(departmentId) })`

Default rule of thumb for `create`/`update`/`delete` mutations on a domain: invalidate `[domain]Keys.all` on `onSuccess`. Only narrow to `.lists()`/`.detail(id)` once a page actually needs that precision.

---

## 3. Type-Safe Queries (`createQuery`)

All queries must specify generic parameters to guarantee typesafety.

### Generic Signature

```typescript
createQuery<TQueryFnData, TError, TData, TQueryKey>;
```

1. `TQueryFnData`: The type returned by the Use Case method (e.g., `DepartmentModel[]`, `DepartmentModel`).
2. `TError`: Must always be `AppError` (imported from `$lib/core/errors/app-error`).
3. `TData`: The type after the optional `select` transform (usually same as `TQueryFnData`).
4. `TQueryKey`: Specific tuple type returned by the Key Factory.

### Code Template — list query

Create the custom rune inside `src/lib/presentation/modules/[domain]/runes/[domain]-query.svelte.ts`:

```typescript
import { createQuery } from '@tanstack/svelte-query';
import type { AppError } from '$lib/core/errors/app-error';
import type { DepartmentModel, DepartmentParams } from '$lib/core/department';
import { provideDepartmentUseCase } from '$lib/infrastructure/department';
import { departmentKeys } from './department.keys';

type DepartmentListKey = ReturnType<typeof departmentKeys.list>;

export function useDepartmentsQuery(params?: () => DepartmentParams | undefined) {
  const useCase = provideDepartmentUseCase();

  return createQuery<DepartmentModel[], AppError, DepartmentModel[], DepartmentListKey>(() => ({
    queryKey: departmentKeys.list(params?.()),
    queryFn: () => useCase.getAll(params?.())
  }));
}
```

### Code Template — detail query

```typescript
type DepartmentDetailKey = ReturnType<typeof departmentKeys.detail>;

export function useDepartmentQuery(id: () => string) {
  const useCase = provideDepartmentUseCase();

  return createQuery<DepartmentModel, AppError, DepartmentModel, DepartmentDetailKey>(() => ({
    queryKey: departmentKeys.detail(id()),
    queryFn: () => useCase.getById(id()),
    enabled: !!id() // Prevent calling API with empty parameters
  }));
}
```

Note both runes call `provideDepartmentUseCase()` — the **same** single UseCase class, just different methods. Do not invent a separate `provideGetDepartmentUseCase()` per query.

---

## 4. Type-Safe Mutations (`createMutation`)

Mutations handle writes, updates, and deletes.

### Generic Signature

```typescript
createMutation<TData, TError, TVariables, TContext>;
```

1. `TData`: The response data returned by the Use Case (e.g., `DepartmentModel` or `void`).
2. `TError`: Must always be `AppError`.
3. `TVariables`: The input payload type passed to `.mutate()` / `.mutateAsync()` (e.g., `CreateDepartmentInput`, `UpdateDepartmentInput`). For an update, that variable type is **one flat object** (`id` + the create fields, via `interface UpdateXInput extends CreateXInput { id: string }` in the Core model — see the "Never hand-duplicate a sibling input type" rule in `common/naming.md`), never a two-argument shape or a `{ id, input }` wrapper. This keeps `mutationFn` a single-parameter passthrough and the UseCase/Repository `update()` method a single-argument method, matching `create()`/`delete()`.
4. `TContext`: Used for optimistic updates context (usually `unknown` or a specific rollback type).

### Side-effects belong in the mutation, not the page (CRITICAL)

Toasts and cache invalidation are **mutation** concerns, not page concerns. Put them in `onSuccess`/`onError` **inside the rune**, so every call site behaves identically and the page's `handleSubmit` shrinks to just `mutateAsync` + close-on-success. Do **not** duplicate `toast.success`/`toast.error` in each page `try/catch`.

- **`onError`** — one shared `toastError` helper per rune file. Because every UseCase method throws an `AppError` subclass (see §1), the message is already user-friendly.
- **`onSuccess`** — invalidate `[domain]Keys.all` (see §2) **and** fire the success toast here.
- **Delete needs the record name** for its toast, so its `TVariables` is a small `{ id; name }` object (not a bare `string`). `mutationFn` still passes only `.id` to the UseCase; `onSuccess(_data, { name })` reads the name for the message.

### Code Template

```typescript
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import type { AppError } from '$lib/core/errors/app-error';
import type {
  CreateDepartmentInput,
  DepartmentModel,
  UpdateDepartmentInput
} from '$lib/core/department';
import { provideDepartmentUseCase } from '$lib/infrastructure/department';
import { toast } from '$lib/presentation/shared/components/toast';
import { departmentKeys } from './department.keys';

/** Delete carries the name so onSuccess can name it in the toast. */
type DeleteDepartmentVariables = { id: string; name: string };

// AppError is already user-friendly (mapped in the repository), so message is safe to show.
function toastError(err: AppError) {
  toast.error(err instanceof Error ? err.message : 'Terjadi kesalahan');
}

export function useCreateDepartmentMutation() {
  const useCase = provideDepartmentUseCase();
  const queryClient = useQueryClient();

  return createMutation<DepartmentModel, AppError, CreateDepartmentInput>(() => ({
    mutationFn: (input) => useCase.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('Departemen ditambahkan');
    },
    onError: toastError
  }));
}

export function useUpdateDepartmentMutation() {
  const useCase = provideDepartmentUseCase();
  const queryClient = useQueryClient();

  return createMutation<DepartmentModel, AppError, UpdateDepartmentInput>(() => ({
    mutationFn: (input) => useCase.update(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success('Departemen diperbarui');
    },
    onError: toastError
  }));
}

export function useDeleteDepartmentMutation() {
  const useCase = provideDepartmentUseCase();
  const queryClient = useQueryClient();

  return createMutation<void, AppError, DeleteDepartmentVariables>(() => ({
    mutationFn: ({ id }) => useCase.delete(id),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      toast.success(`"${name}" dihapus`);
    },
    onError: toastError
  }));
}
```

Side-effects already live in the rune (toast + invalidate), so the page only needs to gate **success-path UI** (close dialog / clear state). Do this with `.mutate()` + a **per-call `onSuccess`** — **not** `mutateAsync` + `try/catch`. `.mutate()` is fire-and-forget so there's no rejected promise to handle; the per-call `onSuccess` runs after the rune's `onSuccess`, and the rune's `onError` still fires the toast. This avoids the empty `catch {}` (an ESLint `no-empty` smell) entirely.

```typescript
function handleSubmit(input: CreateDepartmentInput) {
  // Per-call onSuccess closes the dialog only on success; error toast is handled in the rune's onError.
  const onSuccess = () => closeFormDialog();
  if (editingDepartment) {
    updateDepartmentMutation.mutate({ ...input, id: editingDepartment.id }, { onSuccess });
  } else {
    createDepartmentMutation.mutate(input, { onSuccess });
  }
}

function confirmDelete() {
  if (!deleteTarget) return;
  deleteDepartmentMutation.mutate(
    { id: deleteTarget.id, name: deleteTarget.name },
    {
      onSuccess: () => {
        isDeleteOpen = false;
        deleteTarget = null;
      }
    }
  );
}
```

Per-call `onError`/`onSettled` work the same way if a specific call needs extra handling. Reach for `mutateAsync` **only** when you genuinely need to `await` the result inline (e.g. sequencing several mutations, or awaiting inside a larger async flow) — and then handle the rejection properly, never with an empty `catch`.

---

## 5. UI Consumption in Svelte 5

In Svelte 5, TanStack Query states are natively reactive:

```svelte
<script lang="ts">
  import { useDepartmentQuery } from '../runes/department-query.svelte';
  import { ValidationError } from '$lib/core/errors/app-error';

  let { departmentId } = $props<{ departmentId: string }>();

  // Pass departmentId as getter function to preserve Svelte 5 reactivity
  const departmentQuery = useDepartmentQuery(() => departmentId);
</script>

{#if departmentQuery.isPending}
  <p>Loading...</p>
{:else if departmentQuery.isError}
  <!-- Handled using unified AppError -->
  {#if departmentQuery.error instanceof ValidationError}
    <p class="error-msg">Input validation failed: {departmentQuery.error.message}</p>
  {:else}
    <p class="error-msg">{departmentQuery.error.message}</p>
  {/if}
{:else if departmentQuery.data}
  <div>
    <h1>{departmentQuery.data.name}</h1>
  </div>
{/if}
```

### Deriving values from query data

Never re-derive query data through a plain (non-`$derived`) getter or function called from a template loop or an imperative consumer like TanStack Table's `data` option — it rebuilds a **new** array/object graph on every access, and any consumer that compares by reference will treat every read as "changed," causing endless re-render loops. Always wrap it in a component-level `$derived`:

```typescript
import { DepartmentService } from '$lib/core/department';

const departmentsQuery = useDepartmentsQuery();

// ✅ memoized — only recomputes when departmentsQuery.data actually changes.
// Pure transforms are a Domain Service (no repository) — call it directly, no provider.
const tree = $derived(DepartmentService.buildTree(departmentsQuery.data ?? []));
```

---

## 6. `isPending` vs `isFetching` Guidelines

Understanding the difference between `isPending` and `isFetching` is vital to prevent bad UX (like flashing full-screen loaders when refreshing in the background).

| State Indicator  | True When...                                                       | UX Recommended Treatment                                                                    |
| :--------------- | :----------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| **`isPending`**  | Query has **no cached data yet** AND is loading.                   | **Full UI Blocker:** Show skeleton screen, spinner, or grayed-out layout.                   |
| **`isFetching`** | **Any request is in-flight** (initial load OR background refetch). | **Subtle indicator:** Small spinner, progress bar at the top, or simple "Syncing..." badge. |

### Case 1: Initial Page Load (First Visit)

- `isPending` = `true`
- `isFetching` = `true`
- **UX action:** Show Skeleton loader because we have no data to show yet.

### Case 2: Background Sync / Refetch (e.g. Window Refocus, Manual Refresh)

- `isPending` = `false` (we already have cached data in `data`)
- `isFetching` = `true` (downloading newer data in the background)
- **UX action:** **DO NOT show full Skeleton loader** (it causes flickering). Keep showing the cached data, and optionally display a small spinner in the corner or table header to show syncing.

### Case 3: Idle / Fresh State

- `isPending` = `false`
- `isFetching` = `false`
- **UX action:** Show regular UI with no loader indicators.

### Svelte Code Example

```svelte
<script lang="ts">
  const query = useDepartmentQuery(() => id);
</script>

<div>
  <!-- 1. Background Sync Indicator (Subtle) -->
  {#if query.isFetching && !query.isPending}
    <span class="syncing-badge">Updating data...</span>
  {/if}

  <!-- 2. Main content loader -->
  {#if query.isPending}
    <SkeletonLoader />
  {:else if query.data}
    <EmployeeCard data={query.data} />
  {/if}
</div>
```

---

## 7. `onSuccess` Typing

When using `@tanstack/svelte-query`'s `createMutation`, the `data` parameter in `onSuccess` callbacks defaults to `any` unless explicitly typed, triggering ESLint errors. Always explicitly type the `data` parameter.

### ✅ Correct

```ts
const updateMutationFn = createMutation(() => ({
  mutationFn: (input: UpdateInput) => useCase.update(input),
  onSuccess: (data: DomainModel) => {
    // ...
  }
}));
```
