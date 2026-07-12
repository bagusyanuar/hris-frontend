---
name: tanstack-query-guidelines
description: Guidelines and templates for writing Svelte 5 Custom Runes using TanStack Query v6, integrated with DDD Clean Architecture and AppError.
---

# TanStack Query & Svelte 5 Guidelines

This skill provides the patterns, structures, and guidelines for using **TanStack Query (Svelte Query v6)** inside the HRIS frontend, ensuring strict alignment with Svelte 5 Runes, Clean Architecture (DDD), and our domain-specific `AppError`.

## 1. Architectural Rules
- **Infrastructure Layer:** Axios `httpClient` calls the backend APIs. Custom Repository implementations MUST catch errors and map them to domain `AppError` subclasses using `HttpErrorMapper.toDomain(error)`.
- **Core Layer:** Use Cases return clean domain objects and throw `AppError` subclasses. They are completely unaware of TanStack Query.
- **Presentation Layer (Custom Runes):** This is where TanStack Query is used. We encapsulate `createQuery` and `createMutation` in **Custom Query Runes** (functions) located in `src/lib/presentation/modules/[domain]/runes/`.
- **Presentation Layer (UI/Pages):** Svelte page components consume the custom query runes. They MUST NOT import `@tanstack/svelte-query` directly.

```
[UI Component] ---> [Custom Query Rune] ---> [Use Case] ---> [Repository Impl] ---> [Axios Client]
                      (createQuery/Mutation)                   (error.mapper)
```

---

## 2. Query Key Design & DRY Factory Pattern

To maintain **DRY** (Don't Repeat Yourself) principles and ensure robust cache invalidation, Query Keys must not be inline arrays. Instead, define a **Query Key Factory** in the **Presentation Layer** right next to your runes.

### Directory Placement
```
src/lib/presentation/modules/[domain]/runes/
├── [domain].keys.ts       <-- Query Key Factory
└── [domain]-query.svelte.ts <-- Svelte Query Runes
```

### Factory Template (`[domain].keys.ts`)
Use `as const` assertions to ensure TypeScript registers keys as strict read-only tuples. 

> [!IMPORTANT]
> **Clean Architecture Boundary Rule:**
> All UI parameters, query filters, and data types used in Key Factories and Query Runes **MUST be imported from the Core Layer** (e.g. `$lib/core/[domain]/*.model.ts` or `*.types.ts`). 
> **NEVER import API Schemas (`*.schema.ts`) from the Infrastructure Layer** into the Presentation Layer. This keeps the UI decoupled from backend database casing (e.g. snake_case) and naming conventions.

```typescript
import type { EmployeeFilters } from '$lib/core/employee/employee.model'; // ALWAYS import from Core, NEVER from Schema

export const employeeKeys = {
	all: ['employee'] as const,
	lists: () => [...employeeKeys.all, 'list'] as const,
	list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
	details: () => [...employeeKeys.all, 'detail'] as const,
	detail: (id: string) => [...employeeKeys.details(), id] as const,
};
```

### Invalidation Examples:
- **Invalidate all** employee data:
  `queryClient.invalidateQueries({ queryKey: employeeKeys.all })`
- **Invalidate only lists** (keeping details cached):
  `queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })`
- **Invalidate a specific detail**:
  `queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) })`

---

## 3. Type-Safe Queries (`createQuery`)

All queries must specify generic parameters to guarantee typesafety.

### Generic Signature
```typescript
createQuery<TQueryFnData, TError, TData, TQueryKey>
```
1. `TQueryFnData`: The type returned by the Use Case (e.g., `Employee`, `Attendance[]`).
2. `TError`: Must always be `AppError` (imported from `$lib/core/errors/app-error`).
3. `TData`: The type after the optional `select` transform (usually same as `TQueryFnData`).
4. `TQueryKey`: Specific tuple type returned by the Key Factory.

### Code Template
Create the custom rune inside `src/lib/presentation/modules/[domain]/runes/[name]-query.svelte.ts`:

```typescript
import { createQuery } from '@tanstack/svelte-query';
import { provideGetEmployeeUseCase } from '$lib/infrastructure/providers/employee.provider';
import { employeeKeys } from './employee.keys';
import type { Employee } from '$lib/core/models/employee.model';
import type { AppError } from '$lib/core/errors/app-error';

type EmployeeDetailKey = ReturnType<typeof employeeKeys.detail>;

export function useEmployeeQuery(id: () => string) {
	const getEmployeeUseCase = provideGetEmployeeUseCase();

	return createQuery<Employee, AppError, Employee, EmployeeDetailKey>(() => ({
		queryKey: employeeKeys.detail(id()),
		queryFn: () => getEmployeeUseCase.execute(id()),
		enabled: !!id(), // Prevent calling API with empty parameters
	}));
}
```

---

## 3. Type-Safe Mutations (`createMutation`)

Mutations handle writes, updates, and deletes.

### Generic Signature
```typescript
createMutation<TData, TError, TVariables, TContext>
```
1. `TData`: The response data returned by the Use Case (e.g., `Employee` or `void`).
2. `TError`: Must always be `AppError`.
3. `TVariables`: The input payload type passed when calling `.mutate()` (e.g., `CreateEmployeeInput`).
4. `TContext`: Used for optimistic updates context (usually `unknown` or a specific rollback type).

### Code Template
```typescript
import { createMutation, useQueryClient } from '@tanstack/svelte-query';
import { provideCreateEmployeeUseCase } from '$lib/infrastructure/providers/employee.provider';
import type { Employee } from '$lib/core/models/employee.model';
import type { AppError } from '$lib/core/errors/app-error';

export interface CreateEmployeeInput {
	name: string;
	email: string;
	position: string;
}

export function useCreateEmployeeMutation() {
	const createEmployeeUseCase = provideCreateEmployeeUseCase();
	const queryClient = useQueryClient();

	return createMutation<Employee, AppError, CreateEmployeeInput, unknown>(() => ({
		mutationFn: (input: CreateEmployeeInput) => createEmployeeUseCase.execute(input),
		onSuccess: (newEmployee) => {
			// Invalidate cache to force list refresh
			queryClient.invalidateQueries({ queryKey: ['employee', 'list'] });
		}
	}));
}
```

---

## 4. UI Consumption in Svelte 5

In Svelte 5, TanStack Query states are natively reactive:

```svelte
<script lang="ts">
	import { useEmployeeQuery } from '../runes/employee-query.svelte';
	import { ValidationError } from '$lib/core/errors/app-error';

	let { employeeId } = $props<{ employeeId: string }>();
	
	// Pass employeeId as getter function to preserve Svelte 5 reactivity
	const employeeQuery = useEmployeeQuery(() => employeeId);
</script>

{#if employeeQuery.isPending}
	<p>Loading...</p>
{:else if employeeQuery.isError}
	<!-- Handled using unified AppError -->
	{#if employeeQuery.error instanceof ValidationError}
		<p class="error-msg">Input validation failed: {employeeQuery.error.message}</p>
	{:else}
		<p class="error-msg">{employeeQuery.error.message}</p>
	{/if}
{:else if employeeQuery.data}
	<div>
		<h1>{employeeQuery.data.name}</h1>
	</div>
{/if}
```

---

## 5. `isPending` vs `isFetching` Guidelines

Understanding the difference between `isPending` and `isFetching` is vital to prevent bad UX (like flashing full-screen loaders when refreshing in the background).

| State Indicator | True When... | UX Recommended Treatment |
| :--- | :--- | :--- |
| **`isPending`** | Query has **no cached data yet** AND is loading. | **Full UI Blocker:** Show skeleton screen, spinner, or grayed-out layout. |
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
	const query = useEmployeeQuery(() => id);
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

