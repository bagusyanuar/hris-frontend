---
name: sveltekit-superforms
description: Guidelines and best practices for writing SvelteKit Superforms (especially in SPA mode) and integrating it seamlessly with Zod schemas and Svelte 5 types.
---

# SvelteKit Superforms & Zod Guidelines

This skill provides patterns for building form validations using `sveltekit-superforms` and Zod within a Svelte 5 Single Page Application (SPA) architecture.

## 1. Superforms SPA Mode Configuration

When using `sveltekit-superforms` in SPA mode (client-side only without form actions):

- **Always provide a Generic Type**: Use `superForm<InputType>(...)` so that `form.data` is strictly typed according to your Domain Model, overriding Zod's default inferences (which may include unwanted `null` types).
<never_do>
- **Do not cancel on validation errors**: Never call `cancel()` inside `onUpdate` just because `!form.valid`. Canceling stops the Superforms lifecycle completely, preventing validation errors from being rendered in the UI.
</never_do>

### ✅ Correct (SPA Mode `onUpdate`)

```ts
const sf = superForm<CreateJobTitleInput>(defaults(zod(schema)), {
  SPA: true,
  validators: zod(schema),
  async onUpdate({ form }) {
    if (form.valid) {
      await onValid(form.data);
    }
    // Do NOT return cancel() if invalid! Let superforms render the errors.
  }
});
```

## 2. Zod Schema vs Domain Model (Optional Fields)

<CRITICAL_RULES>
When a Domain Model defines a property as optional (e.g. `description?: string;`), its corresponding Zod schema MUST use `.optional()`, **NOT** `.nullable().default(null)`.
</CRITICAL_RULES>

Mismatches here will cause TypeScript errors when injecting the model type into `superForm<DomainInput>`. If the schema is strictly `.optional()`, UI components like `TextField` can safely use `bind:value={$form.description}` without needing complex getter/setter workarounds.

### ✅ Correct

```ts
// Model: description?: string;
export const Schema = z.object({
  description: z.string().optional() // aligns with string | undefined
});
```

### ❌ Incorrect

```ts
// Model: description?: string;
export const Schema = z.object({
  description: z.string().nullable().default(null) // creates string | null!
});
```
