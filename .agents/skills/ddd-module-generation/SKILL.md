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
│       └── index.ts
├── infrastructure/
│   └── [domain-name]/
│       ├── [domain-name].mapper.ts
│       ├── [domain-name].provider.ts
│       ├── [domain-name].repository.impl.ts
│       ├── [domain-name].schema.ts
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
                └── [domain-name]-query.svelte.ts  <-- TanStack Query runes (queries + mutations)
```

> [!NOTE]
> The `runes/` output above is the **default** for any domain with server-fetched/list data — see step 3 below and the `tanstack-query` skill for the full pattern. Only fall back to a hand-rolled `[Domain]Store.svelte.ts` class for pure client-side UI state that never calls a UseCase to fetch/persist data (see the "When to use a query rune vs. a class-based Store" section of that skill).

## Generation Guidelines

### 1. Core Layer (Pure TypeScript)
- **`[domain-name].model.ts`**: Declare models with suffix `Model` (e.g., `UserModel`), inputs with `Input` (e.g., `CreateUserInput`), and params with `Params`.
- **`[domain-name].repository.ts`**: Define repository interface starting with `I` (e.g., `IUserRepository`).
- **`[domain-name].usecase.ts`**: Class encapsulating domain business logic. Pure TS, no Svelte runes, no external libraries.
- **`index.ts`**: Barrel export all of the above.

### 2. Infrastructure Layer
- **`[domain-name].schema.ts`**: Declare API request/response structures with suffixes `Request`, `Response`, or `Query`.
- **`[domain-name].mapper.ts`**: Static class mapping schema types (in snake_case) to core models (camelCase) and vice versa.
- **`[domain-name].repository.impl.ts`**: Implements `I[Domain]Repository`, calls API, and uses the mapper to return domain models.
- **`[domain-name].provider.ts`**: Exposes **only** `provide[Domain]UseCase()` (instantiates Repository + UseCase as a singleton). This file must import from Core only — **never** from `$lib/presentation` (see Dependency Direction rule in `architecture/ddd.md`). Do NOT put `provide[Domain]Store()` here.
- **`index.ts`**: Barrel export the mapper, provider, implementation, and schema.

### 3. Presentation Layer
- **`runes/[domain-name].keys.ts` + `runes/[domain-name]-query.svelte.ts`** (**default**): Function-based Custom Query Runes using `createQuery`/`createMutation` from `@tanstack/svelte-query`, each calling `provide[Domain]UseCase()` (imported from Infrastructure) directly. No intermediate Store class. Follow the full pattern — query key factory, generics, invalidation, mutation variable shapes, `isPending` vs `isFetching` — in the **`tanstack-query` skill**; do not improvise it here.
- **`runes/[Domain]Store.svelte.ts`** (fallback only): A class managing reactive UI state (e.g., `$state(isLoading)`, `$state(error)`) is for **pure client-side UI state that never fetches/persists domain data** — e.g. auth session, wizard step, sidebar/filter-only state. It also exports the `provide[Domain]Store()` singleton factory from this same file, calling `provide[Domain]UseCase()` (imported from Infrastructure) if it needs one. This keeps the dependency arrow one-way: Core ← Infrastructure ← Presentation.
  - If a `$derived` field's expression reads `this.useCase` (the constructor-injected UseCase), assign it inside the constructor body (`this.tree = $derived(...)`), not as a top-level field initializer — see rule #9 in `svelte/conventions.md`. Never replace it with a plain getter; that breaks memoization and can cause render loops in consumers like DataTable.
- **`pages/` & `components/`**: Component views utilizing the query runes (or Store, for the pure-UI-state fallback case).
- **`src/routes/` page controller**: thinning route file simply rendering the page component (e.g., `<EmployeePage />`) without manual instantiation or props passing.
- **Typography Component**: All text elements (headings, titles, descriptions, labels, spans, paragraphs, etc.) must be rendered using the central `<Typography>` component rather than raw HTML typography tags to ensure design and styling consistency.
