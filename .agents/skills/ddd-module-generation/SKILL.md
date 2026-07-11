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
                └── (svelte 5 reactive custom runes, e.g., EmployeeStore.svelte.ts)
```

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
- **`[domain-name].provider.ts`**: Instantiates and exposes the UseCase and Store using provider functions (e.g., `provide[Domain]UseCase()`, `provide[Domain]Store()`).
- **`index.ts`**: Barrel export the mapper, provider, implementation, and schema.

### 3. Presentation Layer
- **`runes/[Domain]Store.svelte.ts`**: Class managing reactive UI states (e.g., `$state(isLoading)`, `$state(error)`) wrapping the Core UseCase.
- **`pages/` & `components/`**: Component views utilizing the reactive runes, instantiating them via `provide[Domain]Store()`.
- **`src/routes/` page controller**: thinning route file simply rendering the page component (e.g., `<EmployeePage />`) without manual instantiation or props passing.
- **Typography Component**: All text elements (headings, titles, descriptions, labels, spans, paragraphs, etc.) must be rendered using the central `<Typography>` component rather than raw HTML typography tags to ensure design and styling consistency.
