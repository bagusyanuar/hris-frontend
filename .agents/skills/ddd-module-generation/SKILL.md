---
name: ddd-module-generation
description: Guides and automates the creation of a new Domain-Driven Design (DDD) module inside src/lib/ following the hris-frontend architecture.
---

# DDD Module Generation Skill

Use this skill when the user wants to add a new domain, module, or feature (e.g., "create employee management module"). This guides the agent to generate files strictly adhering to the project's Clean Architecture conventions.

## Folder Structure Template

For a new domain `[domain-name]` (use English `kebab-case`), you must generate the following structure:

```
src/lib/
├── core/
│   └── [domain-name]/
│       ├── [domain-name].model.ts
│       ├── [domain-name].repository.ts
│       ├── [domain-name].usecase.ts
│       ├── [domain-name].service.ts   <-- Domain Service: pure/stateless transforms (only if any)
│       └── index.ts
├── infrastructure/
│   └── [domain-name]/
│       ├── [domain-name].mapper.ts
│       ├── [domain-name].provider.ts
│       ├── [domain-name].repository.impl.ts
│       ├── [domain-name].repository.mock.ts
│       ├── [domain-name].schema.ts
│       ├── [domain-name].validator.ts
│       └── index.ts
└── presentation/
    └── modules/
        └── [domain-name]/
            ├── components/
            │   └── (dumb/smart components for this domain)
            ├── pages/
            │   └── (page components, e.g., EmployeePage.svelte)
            └── runes/
                ├── [domain-name].keys.ts          <-- TanStack Query key factory
                ├── [domain-name]-query.svelte.ts  <-- TanStack Query runes (queries + mutations)
                └── [domain-name]-form.svelte.ts   <-- superForm (zod4 adapter) init, if module has a form
```

> [!NOTE]
> The `runes/` output above is the **default** for any domain with server-fetched/list data — see step 3 below and the `tanstack-query` skill for the full pattern. Only fall back to a hand-rolled `[Domain]Store.svelte.ts` class for pure client-side UI state that never calls a UseCase to fetch/persist data (see the "When to use a query rune vs. a class-based Store" section of that skill).

## Generation Guidelines

### 1. Core Layer (Pure TypeScript)

- **`[domain-name].model.ts`**: Declare models with suffix `Model` (e.g., `UserModel`), inputs with `Input` (e.g., `CreateUserInput`), and params with `Params`. For paginated lists, `[Domain]Params` MUST extend `PaginationSortParam` from `$lib/core/shared`, and functions should return `PaginatedResult<[Domain]Model>`.
- **`[domain-name].repository.ts`**: Define repository interface starting with `I` (e.g., `IUserRepository`).
- **`[domain-name].usecase.ts`**: Class for **async orchestration + business rules that touch the repository** (`getAll`/`getById`/`create`/`update`/`delete`, plus invariants that read other records). Constructor-injected with `I[Domain]Repository`. Pure TS, no Svelte runes, no external libraries.
<CRITICAL_RULES>
- **`[domain-name].service.ts`** (Domain Service — only when the domain has pure logic): Static class of **pure, stateless, synchronous** domain operations with **no repository/I-O** — projections (`toInput(model)`) and tree/graph logic (`buildTree`, `getAssignableParents`). No constructor, no DI, **no provider** — Presentation calls it directly (`DepartmentService.buildTree(...)`). See the UseCase-vs-Service split in `architecture/ddd.md` §2. Do NOT pile pure transforms onto the UseCase.
</CRITICAL_RULES>
- **`index.ts`**: Barrel export all of the above.

### 2. Infrastructure Layer

- **`[domain-name].schema.ts`**: Declare API request/response structures with suffixes `Request`, `Response`, or `Query`. For paginated lists, `[Domain]Query` should extend `PaginationSortQuery` and the API will return `ApiListResponse<[Domain]Response>`.
- **`[domain-name].validator.ts`**: Define Zod validation schemas (e.g. `Create[Domain]Schema`, and derive `Update[Domain]Schema = Create[Domain]Schema.and(z.object({ id: z.string().min(1) }))`) representing the input structures. Used by Superforms for client-side form validation. For `T | null` domain fields use `.nullable().default(null)`, **not** `.optional()` (optional injects `undefined` and breaks assignability to `CreateXInput`). See `architecture/error-handling.md` §3.1.
- **`[domain-name].mapper.ts`**: Static class mapping schema types (in snake_case) to core models (camelCase) and vice versa. Use the declarative object spread pattern (e.g., `...(params.search && { search: params.search })`) for `toQuery` mappings. Use `PaginationMapper.toQuery(params)` and `PaginationMapper.toResult(...)` to handle pagination conversions.
- **`[domain-name].repository.mock.ts`**: Manual mock repository implementing `I[Domain]Repository` with dummy data and fake delay.
- **`[domain-name].repository.impl.ts`**: Implements `I[Domain]Repository`, calls actual API using `httpClient` (which automatically unpacks `ApiResponse`), and uses the mapper to return domain models. Use a dummy base path (e.g., `/v1/[domain]`) if the actual endpoint is unknown. **CRITICAL**: Every API call must be wrapped inside `handleAppError(async () => { ... })` from `http/error.mapper.ts`. Do NOT use `.data.data` as `httpClient.get<ApiResponse<T>>()` directly returns the payload.
<CRITICAL_RULES>
- **`[domain-name].provider.ts`**: Exposes **only** `provide[Domain]UseCase()` (instantiates Repository + UseCase as a singleton). Must use a `USE_MOCK = true` flag to conditionally inject the Mock or Impl repository. This file must import from Core only — **never** from `$lib/presentation` (see Dependency Direction rule in `architecture/ddd.md`). Do NOT put `provide[Domain]Store()` here.
</CRITICAL_RULES>
- **`index.ts`**: Barrel export the mapper, provider, mock, implementation, and schema.

### 3. Presentation Layer

- **`runes/[domain-name].keys.ts` + `runes/[domain-name]-query.svelte.ts`** (**default**): Function-based Custom Query Runes using `createQuery`/`createMutation` from `@tanstack/svelte-query`, each calling `provide[Domain]UseCase()` (imported from Infrastructure) directly. No intermediate Store class. Follow the full pattern — query key factory, generics, invalidation, mutation variable shapes, `isPending` vs `isFetching` — in the **`tanstack-query` skill**; do not improvise it here.
- **`runes/[Domain]Store.svelte.ts`** (fallback only): A class managing reactive UI state (e.g., `$state(isLoading)`, `$state(error)`) is for **pure client-side UI state that never fetches/persists domain data** — e.g. auth session, wizard step, sidebar/filter-only state. It also exports the `provide[Domain]Store()` singleton factory from this same file, calling `provide[Domain]UseCase()` (imported from Infrastructure) if it needs one. This keeps the dependency arrow one-way: Core ← Infrastructure ← Presentation.
  - If a `$derived` field's expression reads `this.useCase` (the constructor-injected UseCase), assign it inside the constructor body (`this.tree = $derived(...)`), not as a top-level field initializer — see rule #9 in `svelte/conventions.md`. Never replace it with a plain getter; that breaks memoization and can cause render loops in consumers like DataTable.
- **`runes/[domain-name]-form.svelte.ts`** (when the module has a create/update form): A `use[Domain]Form(onValid)` factory that initializes superForm in SPA mode with the **`zod4`** adapter (Zod v4 — the old `zod` adapter throws `SchemaError: No shape could be created for schema`). Keeps adapter + validators + `onUpdate` out of the `.svelte` component. Must be called synchronously at the component's top-level script. Returns a `load(model | null)` helper (`reset({ data })` for edit, `reset()` for create — clears errors/tainted too), which calls `[Domain]Service.toInput(model)`. **Model → Input mapping lives in the Core Domain Service** (alongside `buildTree`/`getAssignableParents`), **not** in the rune, **not** on the UseCase, and **not** in `infrastructure/*.mapper.ts` (that mapper is Schema↔Model only). Full pattern in `architecture/error-handling.md` §3.2–3.4.
- **`pages/` & `components/`**: Component views utilizing the query runes (or Store, for the pure-UI-state fallback case). Form components consume `use[Domain]Form((input) => onsubmit(input))` (closure avoids initial-value prop capture), populate via a single `$effect(() => { if (open) load(record); })`, and bind non-text widgets (Combobox/Switch/…) with **function bindings** (get/set) straight to `$form` — **no** shadow `$state`, **no** per-widget sync `$effect`. See `architecture/error-handling.md` §3.4.
- **`src/routes/` page controller**: thinning route file simply rendering the page component (e.g., `<EmployeePage />`) without manual instantiation or props passing.
- **Typography Component**: All text elements (headings, titles, descriptions, labels, spans, paragraphs, etc.) must be rendered using the central `<Typography>` component rather than raw HTML typography tags to ensure design and styling consistency.
