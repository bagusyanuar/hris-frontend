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


