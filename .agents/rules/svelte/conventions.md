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

If a `$derived` field's expression reads `this.someConstructorParam` (any constructor parameter — an injected dependency, or a plain value like an id), assign it **inside the constructor body**, not as a top-level class field initializer — even if the field is declared textually below the constructor.

### Why?

All class field initializers run before the constructor body executes — this includes TS parameter-property assignments (`constructor(private excludeId: string)`), which compile to `this.excludeId = excludeId` as a statement inside the constructor body. A `$derived(...)` field initializer that reads `this.excludeId` therefore always runs first and sees it as unassigned, no matter where the field is declared relative to the constructor. TypeScript correctly flags this as `Property 'excludeId' is used before its initialization` (TS2729).

> Note: pure transforms like `DepartmentService.getAssignableParents(...)` live on a **Domain Service** (static, see `architecture/ddd.md` §2), so the class below is a client-side UI-state Store (the fallback case) that holds the reactive `departments`/`excludeId` and derives a filtered view from them.

### ✅ Correct

```ts
export class DepartmentFilterStore {
	departments = $state<DepartmentModel[]>([]);
	assignableParents: DepartmentModel[];

	constructor(private excludeId: string) {
		this.assignableParents = $derived(
			DepartmentService.getAssignableParents(this.departments, this.excludeId)
		);
	}
}
```

### ❌ Incorrect — TS2729 "used before its initialization"

```ts
export class DepartmentFilterStore {
	// runs before constructor body → this.excludeId not assigned yet
	assignableParents = $derived(DepartmentService.getAssignableParents(this.departments, this.excludeId));

	constructor(private excludeId: string) {}
}
```

### ❌ Also incorrect — plain getter breaks memoization and can cause infinite loops

```ts
get assignableParents(): DepartmentModel[] {
	// builds a NEW array on every read
	return DepartmentService.getAssignableParents(this.departments, this.excludeId);
}
```

A plain (non-`$derived`) getter has no caching — every read produces a new reference. Any consumer that treats reference identity as a change signal (e.g. TanStack Table's `data` option read via a getter) sees a "new" value on every access, which can trigger endless re-computation / render loops and freeze the page. Always use `$derived` — assigned in the constructor when it depends on constructor params — so the value is memoized and only recomputes when its actual reactive dependencies change.

---

## 10. Event Propagation and Modifiers in Svelte 5

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

---

## 11. URL State vs Local State (Datatables & Filters)

For SaaS and Enterprise applications, **Filter, Search, Pagination, and Tab states must be stored in the URL (Search Params)**, not purely in local Svelte `$state()`.

### Why?
- **Shareable Links:** Users can share a URL with their exact filters applied.
- **Refresh-Safe:** Refreshing the page keeps the table exactly where it was.
- **Browser History:** Back/Forward buttons work correctly.

### ✅ Correct (URL State Pattern)
```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// 1. Read initial state from URL
	let searchQuery = $derived(page.url.searchParams.get('search') || '');
	
	// 2. Update URL on change (using SvelteKit's goto with keepFocus/replaceState)
	function updateSearch(query: string) {
		const url = new URL(page.url);
		if (query) url.searchParams.set('search', query);
		else url.searchParams.delete('search');
		
		goto(url, { keepFocus: true, replaceState: true, noScroll: true });
	}
</script>
```

### Kapan menggunakan `$state()` lokal?
Hanya untuk *state* UI yang bersifat sementara (*ephemeral*) dan tidak relevan untuk dibagikan:
- Modal/Dialog/Drawer (buka/tutup)
- *Hover states*
- *Form inputs* (yang belum di-*submit*)

---

## 12. Prefer Writable `$derived` over `$state` and `$effect`

Do not use `$effect` to synchronize one piece of state with another. Instead of creating a `$state` and updating it inside an `$effect`, use `$derived`. If you need to both read and write to the derived value, use a getter/setter object pattern (often referred to as a "writable `$derived`").

### ✅ Correct (Writable Derived / Getter-Setter)

```svelte
<script lang="ts">
	let count = $state(0);
	
	// Writable derived pattern
	const double = {
		get value() { return count * 2; },
		set value(v: number) { count = v / 2; }
	};
</script>

<button onclick={() => count++}>Count: {count}</button>
<button onclick={() => double.value = 10}>Set Double to 10</button>
<p>Double: {double.value}</p>
```

### ❌ Incorrect (State Syncing with `$effect`)

```svelte
<script lang="ts">
	let count = $state(0);
	let double = $state(0);
	
	// Anti-pattern: Syncing state in an effect
	$effect(() => {
		double = count * 2;
	});
</script>
```

