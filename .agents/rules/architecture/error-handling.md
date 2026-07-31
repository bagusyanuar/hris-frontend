# Error Handling & Validation Rules

Preventing the application from crashing (White Screen of Death) and providing clear error feedback to the user are key for SaaS/Enterprise applications like HRIS.

## 1. Preventing UI Component Crashes

<never_do>
- **Rule:** Presentation Components (Svelte) **MUST NOT** guess the error object structure directly from the backend (e.g., `catch (e) { toast.error(e.response.data.message) }`).
</never_do>
- **Solution (AppError Pattern):**
  All errors from the HTTP client (like Axios or Fetch) must be caught in the _Infrastructure Layer_ (Repository) and mapped to a standard `AppError` instance before being returned to the _Use Case_ and UI.

### ✅ Correct (UI Layer)

```svelte
try {
	await submitMutation.mutateAsync(data);
} catch (err) {
	// err is guaranteed to be an instance of Error / AppError by the Infrastructure Layer
	toast.error(err instanceof Error ? err.message : 'A system error occurred');
}
```

## 2. API Response Wrapper

All API calls in the _Infrastructure layer_ must use the `handleAppError` wrapper (from `$lib/infrastructure/http/error.mapper`) to automatically translate raw Axios/HTTP errors into user-friendly `AppError` instances.

### ✅ Correct (Infrastructure Layer - Repository Impl)

```typescript
import { handleAppError } from '$lib/infrastructure/http/error.mapper';

async getAll(): Promise<Model[]> {
	return handleAppError(async () => {
		const response = await httpClient.get('/v1/data');
		return Mapper.toDomainList(response.data.data);
	});
}
```

- `400 Bad Request` -> Show validation error message (form).
- `401 Unauthorized` -> Redirect to login (handled via global interceptor).
- `403 Forbidden` -> "You do not have permission to access this feature".
- `404 Not Found` -> "Data not found".
- `500 Internal Error` -> "A server error occurred. Please try again later."

## 3. Zod for Schema Validation (Form & Payload)

Use **Zod** (`z`) to validate form _input_ in the presentation layer and API _payload_ in the infrastructure layer.

- Error messages from Zod must be mapped and passed to the `error={...}` prop on form components (like `TextField` or `Combobox`).

### 3.1 Schema Location & Naming

- Zod validation schemas live in the **Infrastructure layer**: `src/lib/infrastructure/[domain]/[domain].validator.ts`.
- Export per operation: `Create[Domain]Schema`, and derive the update schema from create (do not rewrite fields): `export const UpdateDepartmentSchema = CreateDepartmentSchema.and(z.object({ id: z.string().min(1) }));`.
<CRITICAL_RULES>
- **Nullable vs optional (CRITICAL):** if the domain model uses `T | null` (e.g., `parentId: string | null`), use `z.string().nullable().default(null)` — **not** `.optional()`. `.optional()` injects `undefined` into the inferred schema result type, making it unassignable to `CreateXInput` which requires `string | null` (TS2345 error "Type 'undefined' is not assignable to type 'string | null'").
</CRITICAL_RULES>

### 3.2 Zod v4 + superForm Adapter (CRITICAL)

<CRITICAL_RULES>
This project uses **Zod v4**. The superForm adapter must be `zod4`, **not** `zod`:

```ts
// ✅ Zod v4
import { zod4 } from 'sveltekit-superforms/adapters';
```
</CRITICAL_RULES>

Using the old `zod` adapter on a Zod v4 schema throws a runtime error:

> `SchemaError: No shape could be created for schema. If using Zod v4, import { zod4 } from "sveltekit-superforms/adapters" instead of { zod }.`

With `zod4`, the types match perfectly — **do not** add an `as unknown as ...` cast on the schema.

### 3.3 SPA superForm is initialized in Rune, not in Component

The superForm initialization (adapter + validators + `onUpdate`) lives in the **rune factory** in the presentation layer, not inline in `.svelte`. The rune also exposes a `load()` helper for populate/reset (see §3.4). The component only holds the template bindings (`$form`, `$errors`, `enhance`) — **without** shadow states or per-widget synchronization `$effect`s.

Mapping **Model → Input** lives in **Core**, not in the rune or in the infra `*.mapper.ts`. This is a Core-type → Core-type transform (it does not touch snake_case Schemas), so it belongs in the **Domain Service** `[Domain]Service` (see `architecture/ddd.md` — Domain Service = pure/stateless domain operations), alongside other pure transforms (`buildTree`, `getAssignableParents`):

```ts
// core/[domain]/[domain].service.ts — pure & stateless, no repository
export class DepartmentService {
  /** Projects a department into the create/update form input shape (Model -> Input). */
  static toInput(department: DepartmentModel): CreateDepartmentInput {
    return {
      code: department.code,
      name: department.name,
      description: department.description ?? '',
      parentId: department.parentId,
      status: department.status
    };
  }
  // static buildTree(...) { }  static getAssignableParents(...) { }
}
```

> **Do not** put `toInput` in `infrastructure/[domain]/[domain].mapper.ts` (that is the API boundary — **Schema ↔ Model**), and **do not** put it in `[Domain]UseCase` (which is for async orchestration + business rules: `create`/`update`/`delete` + repository). `toInput` is pure & synchronous → **Domain Service**.

```ts
// presentation/modules/[domain]/runes/[domain]-form.svelte.ts
import { superForm, defaults } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import {
  DepartmentService,
  type CreateDepartmentInput,
  type DepartmentModel
} from '$lib/core/department';
import { CreateDepartmentSchema } from '$lib/infrastructure/department/department.validator';

// Must be called synchronously at the top-level <script> of the component — superForm uses onDestroy.
export function useDepartmentForm(onValid: (input: CreateDepartmentInput) => void | Promise<void>) {
  const sf = superForm<CreateDepartmentInput>(defaults(zod4(CreateDepartmentSchema)), {
    SPA: true,
    validators: zod4(CreateDepartmentSchema),
    async onUpdate({ form }) {
      if (form.valid) await onValid(form.data);
    }
  });

  return {
    ...sf,
    // Populate from record (edit) or reset to Zod default (create). Mapping is in Core Service.
    load: (d: DepartmentModel | null) =>
      sf.reset(d ? { data: DepartmentService.toInput(d) } : undefined)
  };
}
```

> Domain Services are called directly from Presentation (`DepartmentService.toInput(...)`, `DepartmentService.buildTree(...)`) — **without** `provide[Domain]UseCase()`. Use the provider/UseCase only for operations that touch the repository (fetch/persist).

```svelte
<!-- Component: wrap callback prop in a closure to read the latest prop value -->
<!-- (prevents Svelte state_referenced_locally / initial-value capture warnings). -->
const {(form, errors, enhance, load, submitting)} = useDepartmentForm((input) => onsubmit(input));
```

**Why closure?** Passing the `onsubmit` prop directly (`useDepartmentForm(onsubmit)`) only captures its initial value; wrapping it in `(input) => onsubmit(input)` ensures submit calls the latest version of `onsubmit`.

**End-to-end submit flow:** component `onValid` → calls `onsubmit` prop (data is validated & type-safe) → page `handleSubmit` → `mutateAsync` (toast & invalidate handled in mutation's `onError`/`onSuccess`, see `tanstack-query` skill).

### 3.4 Form Reset/Populate: `reset({ data })` + Function Binding (CRITICAL)

<never_do>
For populate (edit) & reset (create), **do not** manually assign `$form = {...}` and **do not** create shadow `$state` + sync `$effect`s per widget. These two anti-patterns bloat files as fields grow, plus cause subtle bugs.
</never_do>

**a. Use `reset({ data })`, not `$form = {...}`.** `$form = {...}` only overwrites data — **errors** and **tainted** states from the previous session remain (re-opening the form still shows red). `reset()` clears data + errors + tainted all at once. Populate/reset runs via one thin `$effect` that only depends on `open`:

```svelte
// Populate on edit, reset to default on create. Zero field enumeration in the component.
$effect(() => {
	if (open) load(department);
});
```

> **Do not** include `parentOptions` (or other async data) as a dependency for the populate effect. If options arrive late, the effect re-runs and **overwrites** user edits. Combobox can just derive the label from `$form.parentId` (see b).

**b. Non-text widgets use function binding (get/set) directly to `$form`** — remove shadow `$state` + sync `$effect`. Requires Svelte ≥ 5.9.

```svelte
<!-- Switch: boolean <-> enum status -->
<Switch
  bind:checked={() => $form.status === 'active', (v) => ($form.status = v ? 'active' : 'inactive')}
/>

<!-- Combobox: Option {value,label} <-> primitive id in $form.parentId -->
<Combobox
  options={parentOptions}
  bind:value={
    () => parentOptions.find((o) => String(o.value) === $form.parentId),
    (opt) => ($form.parentId = opt ? String(opt.value) : null)
  }
/>
```

**Scaling result:** adding a new field = touching **2 places** only — `toInput` in the rune + its input in the markup. No new `$state`, no new `$effect`, or long populate blocks. A TextField binding directly to `$form` requires zero extra effort.

> Svelte < 5.9 (without function binding): fallback to using `$derived` for Combobox getter, rather than reviving the shadow `$state` + `$effect` pattern.
