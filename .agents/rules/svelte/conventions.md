# Svelte 5 & TypeScript Coding Conventions

Rules and patterns for writing clean, type-safe, lint-free Svelte 5 and TypeScript code.

---

## 1. Keyed Each Blocks (CRITICAL)

Always use keyed `{#each}` blocks to ensure Svelte can track element identities during updates, preventing rendering bugs and lint/compiler warnings. 
Every `{#each}` block MUST have a key expression.

### ✅ Correct

```svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}

{#each ['A', 'B', 'C'] as label (label)}
  <span>{label}</span>
{/each}
```

### ❌ Incorrect

```svelte
{#each items as item}
  <li>{item.name}</li>
{/each}
```

---

## 2. TypeScript & Typesafety (CRITICAL)

- **ABSOLUTELY NO `any` ALLOWED UNDER ANY CIRCUMSTANCES.** Even for quick fixes or third-party libraries, use proper typing, `unknown` with a type guard, or utility/generic types.
- Ensure all callback props, event handlers, and helper function parameters are explicitly typed.
- Prefer strict interfaces for Svelte component props.

---

## 3. Tracking Dependencies in `$effect` / `$derived`

When you need to read a reactive value inside `$effect` solely to register it as a dependency (without using the value), use the `void` operator.

### ✅ Correct

```svelte
$effect(() => {
  void searchQuery; // track dependency
  void isOpen;      // track dependency

  // ... effect logic that uses these implicitly
});
```

### ❌ Incorrect — triggers "assigned but never used"

```svelte
$effect(() => {
  const _query = searchQuery; // lint error: '_query' assigned but never used
});
```

### ❌ Incorrect — triggers "no unused expressions"

```svelte
$effect(() => {
  searchQuery; // lint error: Expected an assignment or function call
});
```

### Why?

`void expr` evaluates the expression (registering the reactive dependency for Svelte's compiler) and returns `undefined`. This satisfies:
- **Svelte 5 reactivity**: the value is read, so the effect re-runs when it changes.
- **ESLint `no-unused-vars`**: no variable is created.
- **ESLint `no-unused-expressions`**: `void` makes it a valid expression statement.

---

## 4. Runes Usage

- Use `$state()` for component-local mutable state.
- Use `$derived()` for computed values.
- Use `$effect()` for side effects that depend on reactive values.
- Use `$props()` for component props (not `export let`).
- Use `$bindable()` inside `$props()` for two-way bindable props.

---

## 5. Event Handling

- Use callback props (e.g., `onclick`, `onchange`) instead of `createEventDispatcher`.
- For DOM events, use Svelte 5's `on:event` or shorthand `onevent` attribute syntax.

---

## 6. Snippets over Slots

- Prefer `{#snippet}` blocks over `<slot>` for content projection in Svelte 5.
- Use `{@render children()}` to render the default snippet.

---

## 7. Custom Runes & Folders
- Place all custom reusable UI states and reactive controllers under `/runes` folders (e.g. `src/lib/presentation/modules/employee/runes/`).
- Avoid using the term `hooks` for UI-state modules to prevent naming collisions and conceptual confusion with SvelteKit's request/response middleware `hooks` (`src/hooks.server.ts`).

---

## 8. SvelteKit Client-Side Routing
- Always use standard anchor tags (`<a href="...">`) for normal page transitions to enable SvelteKit's prefetching and routing optimizations.
- Use `$app/state` or `$app/navigation` selectively:
  - Import `page` from `$app/state` to retrieve query parameters or the current pathname reatively.
  - Import `goto` from `$app/navigation` only when programmatic redirection is required (e.g. redirecting after a successful form submission).

---

## 9. `$derived` Class Fields That Depend on Constructor Parameters (CRITICAL)

If a `$derived` field's expression reads `this.someConstructorParam` (e.g. an injected UseCase/Repository), assign it **inside the constructor body**, not as a top-level class field initializer — even if the field is declared textually below the constructor.

### Why?

All class field initializers run before the constructor body executes — this includes TS parameter-property assignments (`constructor(private useCase: X)`), which compile to `this.useCase = useCase` as a statement inside the constructor body. A `$derived(...)` field initializer that reads `this.useCase` therefore always runs first and sees it as unassigned, no matter where the field is declared relative to the constructor. TypeScript correctly flags this as `Property 'useCase' is used before its initialization` (TS2729).

### ✅ Correct

```ts
export class DepartmentStore {
	departments = $state<DepartmentModel[]>([]);
	tree: DepartmentModel[];

	constructor(private useCase: DepartmentUseCase) {
		this.tree = $derived(this.useCase.buildTree(this.departments));
	}
}
```

### ❌ Incorrect — TS2729 "used before its initialization"

```ts
export class DepartmentStore {
	tree = $derived(this.useCase.buildTree(this.departments)); // runs before constructor body

	constructor(private useCase: DepartmentUseCase) {}
}
```

### ❌ Also incorrect — plain getter breaks memoization and can cause infinite loops

```ts
get tree(): DepartmentModel[] {
	return this.useCase.buildTree(this.departments); // builds a NEW array/object graph on every read
}
```

A plain (non-`$derived`) getter has no caching — every read produces a new reference. Any consumer that treats reference identity as a change signal (e.g. TanStack Table's `data` option read via a getter) sees a "new" value on every access, which can trigger endless re-computation / render loops and freeze the page. Always use `$derived` — assigned in the constructor when it depends on constructor params — so the value is memoized and only recomputes when its actual reactive dependencies change.

---

## 7. Event Propagation and Modifiers in Svelte 5

Svelte 5 removes built-in event modifiers like `|stopPropagation` and `|preventDefault` in favor of standard web APIs.

When building nested interactive components (e.g., an actionable Dropdown or an expander button placed inside a clickable Datatable row), **you must manually stop propagation** to prevent the parent's `onclick` handler from firing (Event Bubbling / "Bocor").

### ✅ Correct (Svelte 5)

```svelte
<!-- Action button inside a clickable table row -->
<button
	onclick={(e) => {
		e.stopPropagation(); // Prevents the parent row's onclick from triggering
		toggleDropdown();
	}}
>
	...
</button>
```

### ❌ Incorrect (Will trigger parent events)

```svelte
<button onclick={toggleDropdown}>
	...
</button>

<!-- Svelte 4 modifiers are no longer valid / recommended in Svelte 5 -->
<button onclick|stopPropagation={toggleDropdown}>
	...
</button>
```
