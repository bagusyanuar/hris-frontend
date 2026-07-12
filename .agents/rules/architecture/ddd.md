# Frontend Domain-Driven Design (DDD) Architecture

This project strictly follows a Clean/Layered Architecture tailored for Svelte 5.
All domains and business logic must be placed inside `src/lib`, strictly separated into three layers:

### 1. Presentation Layer (`src/routes` & `src/lib/presentation`)
- **`src/routes`**: Exclusively used for routing (SvelteKit controllers). `+page.svelte` files here should be as thin as possible and contain NO business logic. They should only import the actual Page component from the Presentation layer and render it.
- **`src/lib/presentation`**: Contains the actual UI. 
  - `/shared`: Dumb components (e.g., `<Button>`, `<Input>`).
  - `/modules/[domain]/pages`: The actual page components (e.g., `EmployeePage.svelte`).
  - `/modules/[domain]/components`: Smart components tied to a domain.
  - `/modules/[domain]/runes`: Svelte 5 Custom Runes / State Classes for UI state management.

### 2. Core Layer (`src/lib/core`)
- Contains business logic, use cases, domain models, and interfaces.
- **Rule**: MUST be pure TypeScript. NEVER import `.svelte` files, UI components, Svelte Runes (`$state`, `$derived`), or any external frameworks/libraries here.
- **Rule**: This layer must be completely agnostic of outside dependencies. State management for the UI should be handled in the Presentation Layer, while the Core Layer focuses exclusively on pure business logic.

### 3. Infrastructure Layer (`src/lib/infrastructure`)
- Contains external integrations, API clients, repository implementations, schemas, mappers, and dependency providers.
- **Components**:
  - **Schemas (`*.schema.ts`)**: Defines request, response, and query payload structures as received from/sent to the backend API (e.g., in `snake_case`).
  - **Mappers (`*.mapper.ts`)**: Pure utility functions to convert data from API Schemas (Infrastructure) to Domain Models (Core) and vice versa. Decouples Core from backend structure.
  - **Dependency Providers (`*.provider.ts`)**: Functions/classes (e.g., `provide[Domain]UseCase()`) that manage instantiations, lifetimes (singleton/transient), and dependency injections. Swaps concrete repositories easily.
  - **Repository Implementations (`*.repository.impl.ts`)**: Implements the Core Repository contracts (`I[Domain]Repository`). Calls APIs, receives Schemas, and uses Mappers to return Domain Models.
- **Rule**: Connects the Core Layer to external services. The Presentation Layer should consume Use Cases via Dependency Providers, and not instantiate Infrastructure repositories directly.

## HTTP & API Client Rules
- **Axios HTTP Client**: Use `httpClient` from `$lib/infrastructure/http/client` for all external REST API communications.
- **Base URL & Config**: Never hardcode base URLs. Use `RuntimeConfig.apiBaseUrl` which automatically loads configuration dynamically (from `.env` in development, and from `/config.json` in production for Docker environments).
- **Authentication**:
  - `accessToken` must be stored securely in memory using `TokenStorage` (from `$lib/infrastructure/storage/token.storage`).
  - `refreshToken` is handled automatically via HttpOnly cookies by the backend (uses `withCredentials: true` during refresh).
  - 401 Unauthorized handling (token refresh and request queuing) is managed centrally by Axios interceptors. Repositories should not try to handle token refresh manually.
- **Response Format**: All successful responses match the standard `ApiResponse<T>` envelope. Generic errors are typed as `ApiErrorResponse` and validation errors as `ValidationError[]`.

