# Frontend Domain-Driven Design (DDD) Architecture

This project strictly follows a Clean/Layered Architecture tailored for Svelte 5.
All domains and business logic must be placed inside `src/lib`, strictly separated into three layers:

### 1. Presentation Layer (`src/routes` & `src/lib/presentation`)

- **`src/routes`**: Exclusively used for routing (SvelteKit controllers). `+page.svelte` files here should be as thin as possible and contain NO business logic. They should only import the actual Page component from the Presentation layer and render it.
- **`src/lib/presentation`**: Contains the actual UI.
  - `/shared`: Dumb components (e.g., `<Button>`, `<Input>`).
  - `/modules/[domain]/pages`: The actual page components (e.g., `EmployeePage.svelte`).
  - `/modules/[domain]/components`: Smart components tied to a domain.
  - `/modules/[domain]/runes`: Svelte 5 Custom Runes for UI/server state. **Default** for any domain with server-fetched data: function-based TanStack Query runes (`[domain].keys.ts` + `[domain]-query.svelte.ts`, see the `tanstack-query` skill). Reserve class-based `[Domain]Store.svelte.ts` for pure client-side UI state that never fetches/persists domain data (e.g. auth session, wizard step).

### 2. Core Layer (`src/lib/core`)

- Contains business logic, use cases, domain services, domain models, and interfaces.
- **Rule**: MUST be pure TypeScript. NEVER import `.svelte` files, UI components, Svelte Runes (`$state`, `$derived`), or any external frameworks/libraries here.
- **Rule**: This layer must be completely agnostic of outside dependencies. State management for the UI should be handled in the Presentation Layer, while the Core Layer focuses exclusively on pure business logic.
- **Use Case (`[domain].usecase.ts`) vs Domain Service (`[domain].service.ts`)** — split by whether the logic touches the repository:
  - **UseCase**: **async orchestration + business rules that need data/side-effects** — repository calls (`getAll`/`create`/`update`/`delete`) and invariants that read other records (e.g. "cannot delete a department with children", "a department cannot be its own parent"). Constructor-injected with `I[Domain]Repository`.
  - **Domain Service**: **pure, stateless, synchronous domain operations** with **no repository/I-O** — projections and graph/tree logic over data passed in as arguments (e.g. `toInput(model)`, `buildTree(list)`, `getAssignableParents(list, excludeId)`). Static methods; no constructor, no DI.
  - **Why split:** keeps the UseCase focused and lets the Presentation layer call pure logic **directly** (`DepartmentService.buildTree(...)`) without going through `provide[Domain]UseCase()` — a Domain Service needs no provider because it has no dependencies to wire. Do not put pure transforms on the UseCase just because it already exists.

### 3. Infrastructure Layer (`src/lib/infrastructure`)

- Contains external integrations, API clients, repository implementations, schemas, mappers, and dependency providers.
- **Components**:
  - **Schemas (`*.schema.ts`)**: Defines request, response, and query payload structures as received from/sent to the backend API (e.g., in `snake_case`).
  - **Mappers (`*.mapper.ts`)**: Pure utility functions to convert data from API Schemas (Infrastructure) to Domain Models (Core) and vice versa. Decouples Core from backend structure.
  - **Dependency Providers (`*.provider.ts`)**: Functions (e.g., `provide[Domain]UseCase()`) that instantiate the concrete Repository + UseCase and expose a singleton. This file MUST only import from Core and its own layer (`repository.impl.ts`) — it must NEVER import a Presentation-layer Store/Rune. Swaps concrete repositories easily without touching UI code.
  - **Repository Implementations (`*.repository.impl.ts`)**: Implements the Core Repository contracts (`I[Domain]Repository`). Calls APIs, receives Schemas, and uses Mappers to return Domain Models.
- **Rule**: Connects the Core Layer to external services. The Presentation Layer should consume Use Cases via Dependency Providers, and not instantiate Infrastructure repositories directly.

## Mocking Strategy (Dependency Injection)

For Frontend-first development before the backend API is ready, we use a manual Mock Repository pattern instead of external tools like MSW. This ensures 100% type safety and zero conflicts with bundlers.

- **`[domain].repository.mock.ts`**: Contains dummy data and a fake delay. Implements `I[Domain]Repository` exactly like the real implementation.
- **`[domain].repository.impl.ts`**: The real Axios-based implementation (throws "Not implemented" until API is ready).
- **`[domain].provider.ts`**: Uses a boolean flag `USE_MOCK = true` to conditionally inject either the Mock or Impl repository into the UseCase.

## Dependency Direction (CRITICAL)

Strict one-way dependency flow: **Core ← Infrastructure ← Presentation**. An arrow means "is depended on by" — Core knows about nothing, Infrastructure only knows about Core, Presentation may know about both.

- **Core**: zero imports from Infrastructure or Presentation. Enforced already by the "pure TypeScript" rule above.
- **Infrastructure**: may only import from Core (and its own files). **MUST NOT** import anything from `src/lib/presentation` — no Svelte components, no `.svelte.ts` rune/store classes. This means `provide[Domain]Store()` does **NOT** belong in `infrastructure/[domain]/[domain].provider.ts` — only `provide[Domain]UseCase()` does.
- **Presentation**: may import from both Core and Infrastructure. The `provide[Domain]Store()` singleton factory belongs in the presentation layer itself — export it from `presentation/modules/[domain]/runes/[Domain]Store.svelte.ts`, where it calls `provide[Domain]UseCase()` imported from Infrastructure.

### ✅ Correct — `infrastructure/department/department.provider.ts`

```ts
import { DepartmentUseCase } from '$lib/core/department';
import { DepartmentRepositoryImpl } from './department.repository.impl';

let departmentUseCaseInstance: DepartmentUseCase | null = null;

export function provideDepartmentUseCase(): DepartmentUseCase {
  if (!departmentUseCaseInstance) {
    departmentUseCaseInstance = new DepartmentUseCase(new DepartmentRepositoryImpl());
  }
  return departmentUseCaseInstance;
}
```

### ✅ Correct — `presentation/modules/department/runes/DepartmentStore.svelte.ts`

```ts
import { provideDepartmentUseCase } from '$lib/infrastructure/department';

export class DepartmentStore {
  /* ... */
}

let departmentStoreInstance: DepartmentStore | null = null;

export function provideDepartmentStore(): DepartmentStore {
  if (!departmentStoreInstance) {
    departmentStoreInstance = new DepartmentStore(provideDepartmentUseCase());
  }
  return departmentStoreInstance;
}
```

### ❌ Incorrect — infra reaching into presentation

```ts
// infrastructure/department/department.provider.ts
import { DepartmentStore } from '$lib/presentation/modules/department/runes/DepartmentStore.svelte'; // WRONG LAYER

export function provideDepartmentStore(): DepartmentStore {
  /* ... */
}
```

## HTTP & API Client Rules

- **Axios HTTP Client**: Use `httpClient` from `$lib/infrastructure/http/client` for all external REST API communications. This client is wrapped to automatically extract the `data` payload from the Axios response, so `httpClient.get<ApiResponse<T>>()` returns the `ApiResponse` object directly without needing to access `res.data.data`.
- **Base URL & Config**: Never hardcode base URLs. Use `RuntimeConfig.apiBaseUrl` which automatically loads configuration dynamically (from `.env` in development, and from `/config.json` in production for Docker environments).
- **Authentication**:
  - `accessToken` must be stored securely in memory using `TokenStorage` (from `$lib/infrastructure/storage/token.storage`).
  - `refreshToken` is handled automatically via HttpOnly cookies by the backend (uses `withCredentials: true` during refresh).
  - 401 Unauthorized handling (token refresh and request queuing) is managed centrally by Axios interceptors. Repositories should not try to handle token refresh manually.
- **Response Format**: All successful responses match the standard `ApiResponse<T>` envelope (or `ApiListResponse<T>` for paginated lists). Generic errors are typed as `ApiErrorResponse` and validation errors as `ValidationError[]`.
- **Pagination**: Standardized globally. Core layer uses `PaginationSortParam` and `PaginatedResult` from `$lib/core/shared`. Infrastructure layer uses `PaginationSortQuery` and `ApiListResponse` from `$lib/infrastructure/http/types`, using `PaginationMapper` (`http/pagination.mapper.ts`) to handle the conversion.
