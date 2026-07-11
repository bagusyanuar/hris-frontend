# Naming Conventions

This project enforces strict naming conventions to keep the codebase clean, readable, and predictable.

## 1. Domain Folders
- **Rule**: All domain and module folder names must be in English and use `kebab-case`.
- *Example*: `src/lib/core/employee-management/`, `src/lib/presentation/modules/auth/`.

## 2. File Suffixes (Non-Svelte Component Files)
- **Rule**: Non-component TypeScript files must use lowercase with dots to denote their architectural context/role.
- **Rules by architectural type**:
  - **Models/Entities**: `[domain].model.ts` (e.g., `auth.model.ts`)
  - **Use Cases**: `[domain].usecase.ts` (e.g., `auth.usecase.ts`)
  - **Repositories (Core Contract)**: `[domain].repository.ts` (e.g., `auth.repository.ts`)
  - **Repositories (Infrastructure Implementation)**: `[domain].repository.impl.ts` (e.g., `auth.repository.impl.ts`)
  - **API Schemas (Infrastructure DTO/Payload)**: `[domain].schema.ts` (e.g., `auth.schema.ts`)
    - **Rule**: Types/Interfaces inside schema files must use `Response`, `Request`, or `Query` suffix (e.g. `LoginResponse`, `LoginRequest`, `UserQuery`). Do not use `Schema` suffix.
  - **Mappers (Data Converters)**: `[domain].mapper.ts` (e.g., `auth.mapper.ts`)
  - **Dependency Providers**: `[domain].provider.ts` (e.g., `auth.provider.ts`)
  - **Services**: `[domain].service.ts`

## 3. Svelte Components & Svelte 5 Modules
- **Rule**: Svelte components (`.svelte`) and Svelte 5 module files (`.svelte.ts` used for custom runes or reactive controllers) must use `PascalCase`.
- *Example*: `LoginPage.svelte`, `FormLogin.svelte`, `AuthStore.svelte.ts` (or `AuthRune.svelte.ts`).

## 4. Interfaces & Types (Core Layer)
- **Rule**: All Interfaces in the Core layer must start with a capital `I` prefix (e.g. `IAuthRepository`).
- **Rule**: Types/Interfaces inside the Core Layer must use specific suffixes based on their purpose:
  - **Display / Domain Model**: Must end with `Model` suffix (e.g., `UserModel`, `AuthUserModel`).
  - **Input / Payload Data**: Must end with `Input` suffix (e.g., `LoginInput`, `RegisterInput`).
  - **Parameters (e.g., query/route params)**: Must end with `Params` suffix (e.g., `UserParams`, `FilterParams`).

## 5. Barrel Exports (index.ts)
- **Rule**: Each domain's subfolders in the `core` and `infrastructure` layers must expose a barrel export `index.ts` file.
- **Rule**: The `index.ts` file should only export public APIs (types, classes, interfaces) meant for outside use. Do not leak internal implementation details if possible.

## 6. General Rules
- **Variables & Functions**: `camelCase`
- **Classes**: `PascalCase`
- **CSS classes / Routing paths**: `kebab-case`
