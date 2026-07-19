---
description: Scaffolds a complete Domain-Driven Design (DDD) module inside the HRIS frontend
---

# Workflow: `/new-module`


## 🛑 Step 1: Information Gathering & Schema Design (INTERACTIVE)

When the user invokes this workflow, you **MUST STOP** and ask the user for the following information before writing any code:

1. **Module Name**: What is the name of the new domain/module? (e.g., `payroll`, `attendance`).
2. **Entity Schema**: What are the main fields for this entity? (e.g., "Does it just have `id`, `code`, `name`, `status`? Or are there relations like `departmentId`? Which fields are optional?").
3. **Routing Context**: Where should this page live in the SvelteKit router? (e.g., `src/routes/(app)/master-data/` or another folder?).
4. **UI Requirements**: Do they need the standard Card + Data Table + Form Dialog + Detail Drawer?

> **Wait for the user's response before proceeding to Step 2.**

---

## 🛠️ Step 2: Core Layer (Domain Logic)

Once the schema is confirmed, generate the Core layer in `src/lib/core/[module]/`:

- **`[module].model.ts`**: Define interfaces (`Model`, `CreateInput`, `UpdateInput`, `Params`). Ensure paginated params extend `PaginationSortParam`.
- **`[module].repository.ts`**: Define the `I[Module]Repository` interface.
- **`[module].usecase.ts`**: Implement the domain UseCase injected with the repository interface.
- **`[module].service.ts`**: (Optional) Domain service for pure UI formatting or data tree logic, e.g., `toInput(model)`.
- **`index.ts`**: Barrel export all of the above.

---

## 🔌 Step 3: Infrastructure Layer (Data Access & Mock)

Generate the Infrastructure layer in `src/lib/infrastructure/[module]/`:

- **`[module].schema.ts`**: API Response/Request interfaces matching backend snake_case.
- **`[module].validator.ts`**: Zod schemas for input validation. **CRITICAL**: Use `.optional()` for optional fields to perfectly match the domain model (do not use `.nullable().default(null)`).
- **`[module].mapper.ts`**: Transform functions between Schema and Model.
- **`[module].repository.mock.ts`**: **CRITICAL**: Create a functional mock repository implementing `I[Module]Repository` using an in-memory array and `setTimeout` to simulate latency. This allows the UI to be tested immediately.
- **`[module].repository.impl.ts`**: Axios implementation wrapped in `handleAppError`.
- **`[module].provider.ts`**: Export `provide[Module]UseCase()`. Set `const USE_MOCK = true;` by default.
- **`index.ts`**: Barrel export.

---

## 🎨 Step 4: Presentation Layer (Runes / State)

Generate the reactive data layer in `src/lib/presentation/modules/[module]/runes/`:

- **`[module].keys.ts`**: TanStack Query key factory.
- **`[module]-query.svelte.ts`**: Custom Svelte runes encapsulating `createQuery` and `createMutation`. **CRITICAL**: Explicitly type the `data` parameter in `onSuccess` callbacks to avoid `any` errors. Include toast notifications for success/error.
- **`[module]-form.svelte.ts`**: `use[Module]Form` wrapping Superforms with generic types `superForm<Create[Module]Input>(...)` and SPA strict mode (never call `cancel()` in `onUpdate`).
- **`[module]-directory.svelte.ts`**: The UI controller managing selection, form toggles, and drawer states.

---

## 🖼️ Step 5: Presentation Layer (UI Components)

Generate the UI components in `src/lib/presentation/modules/[module]/`:

- **`pages/[Module]Page.svelte`**: The main page layout utilizing `<Datatable>` and the directory rune.
- **`components/[Module]FormDialog.svelte`**: The `<Dialog>` form using Zod bindings.
- **`components/[Module]DetailDrawer.svelte`**: The `<Drawer>` showing read-only details.

_Use the `Typography` component for all text elements._

---

## 🔗 Step 6: Routing & Wiring

- Create the page route `+page.svelte` in the directory specified by the user in Step 1.
- Import and render `<[Module]Page />` inside it.
- Remind the user to add the navigation link to the sidebar config if necessary.

---

**Completion:** Once all steps are complete, inform the user that the module has been scaffolded and the mock repository is active, meaning they can immediately test the UI and CRUD operations without a real backend!
