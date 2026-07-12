# Svelte 5 Coding Conventions

Rules and patterns for writing clean, lint-free Svelte 5 code using runes.

---

## 1. Tracking Dependencies in `$effect` / `$derived`

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

## 2. Runes Usage

- Use `$state()` for component-local mutable state.
- Use `$derived()` for computed values.
- Use `$effect()` for side effects that depend on reactive values.
- Use `$props()` for component props (not `export let`).
- Use `$bindable()` inside `$props()` for two-way bindable props.

---

## 3. Event Handling

- Use callback props (e.g., `onclick`, `onchange`) instead of `createEventDispatcher`.
- For DOM events, use Svelte 5's `on:event` or shorthand `onevent` attribute syntax.

---

## 4. Snippets over Slots

- Prefer `{#snippet}` blocks over `<slot>` for content projection in Svelte 5.
- Use `{@render children()}` to render the default snippet.
