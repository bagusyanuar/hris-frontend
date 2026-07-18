# Reusable Component Rules & Fallback Guidelines

This document defines the strict rules for using, searching, and creating UI components within this project to prevent redundant styling, duplicate code, and inconsistent patterns.

For the list of currently registered components, see the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md).

---

## 🤖 AI Workflow & Fallback Decision Tree

Whenever you need to render a UI element (e.g., inputs, buttons, selections, loaders, modal dialogs, status badges):

1. **Step 1: Check the Catalog first**
   - Verify if a matching component exists in the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md).
   - *Note:* The catalog is a reference file. Only read it when you are actively building UI components.
2. **Step 2: Fallback Scan the Physical Directory**
   - If not cataloged, scan the [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components) directory to see if the component exists but was not yet registered in the catalog.
3. **Step 3: Slice/Create a New Shared Component**
   - If the component does not exist yet, **do NOT write raw HTML/Tailwind inputs or inline styles directly in page files.**
   - Instead, create a new reusable component under [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components).
   - Ensure the new component follows our design system standards (Tailwind v4 abstract tokens, Svelte 5 Runes, strict TypeScript, and barrel exports).
   - **Immediately update** the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md) to register your new component for future sessions.

---

## 🔌 Data Binding & Architecture Mapping Rules

When binding complex UI components (such as `Combobox` which expects `{ value, label }` objects) to the Core Layer models:

1. **Presentation Layer Decoupling**:
   - UI component bindings should use presentation-specific state types (e.g., `Option` or `Option[]`).
   - Do NOT modify the Core domain models/entities to store UI-specific properties (like `{ value, label }`). Core models should remain pure and use primitive identifiers (e.g., `departmentId: string`, `roleIds: string[]`).

2. **Rune/State Class Mapping**:
   - Manage the `{ value, label }` representation within Svelte 5 Custom Runes or UI State Classes in the Presentation layer.
   - Map these UI states back to domain primitives when invoking use cases or preparing payloads to submit.
   - Example:
     ```typescript
     // Mapping selected Option state back to Core model ID
     const departmentId = selectedOption?.value as string || '';
     ```

---

## 🎨 Styling and Variants Rule (CVA & Tailwind Standards)

1. **Mandatory Class-Variance-Authority (CVA)**:
   - When creating or refactoring a UI component that supports multiple visual styles, sizes, or states (variants), you **MUST** use `class-variance-authority` (CVA).
   - Define variants in a separate `<component>.variants.ts` file alongside the Svelte component.
   - Do not write ad-hoc style conditionals directly in Svelte class attributes.

2. **Avoid Tailwind Arbitrary Values**:
   - Do **NOT** use arbitrary values (e.g., `bg-[#f3f3f3]`, `w-[325px]`, `p-[17px]`, `h-[400px]`) in Tailwind classes.
   - Always rely on standard Tailwind classes/spacing scales or the configured `@theme` tokens in the CSS entrypoint.
	- If a specific custom dimension or color is absolutely necessary, define it as a variable or token inside `@theme` in `app.css` rather than writing inline arbitrary values in component classes.

---

## ⚠️ Component Composition & Layout Gotchas

1. **`text-inherit` does NOT inherit font-size**:
   - In Tailwind CSS, the `text-inherit` utility only compiles to `color: inherit;`. It does **not** inherit font-size.
   - When building compound/wrapper-based form components (like a `Combobox`, `Select`, or nested `input`), do **not** rely on `text-inherit` on the inner `<input>` tag to inherit the font-size (e.g., `text-sm`) from its parent wrapper.
   - **Solution:** Always map the component's `size` prop directly to concrete Tailwind typography classes (`text-xs`, `text-sm`, `text-base`) and apply them explicitly onto the inner `<input>` element to ensure consistent sizing across browsers.

2. **No Explicit Margins on Icons inside Flex Components**:
   - Reusable components like `<Button>`, `<DropdownItem>`, and other wrappers are typically built using `inline-flex` or `flex` with `gap` properties (e.g., `gap-1.5`, `gap-2`).
   - Do **NOT** add explicit margin classes (e.g., `mr-1.5`, `ml-2`) to `<Icon>` components when placing them inside these wrappers. This causes double-spacing and breaks the proportional layout.
   - Let the parent component's `gap` utility handle the spacing between the icon and text natively.

3. **Beware of Flex Layouts on Custom Components with Inner Wrappers**:
   - Applying layout utility classes like `class="flex flex-col sm:flex-row ..."` directly to custom container components (e.g., `<Card class="...">`) often breaks layout expectations.
   - This occurs because many custom components wrap their `children` snippet inside an internal structural element (e.g., `<div class="text-sm">`). The `flex` class applies to the outermost container, but the inner wrapper remains a standard block element, preventing the actual children from becoming flex items.
   - **Solution:** Instead of passing layout classes to the component's `class` prop, wrap your content inside a standard `<div class="flex ... w-full">` *inside* the component's slot.

4. **Typography Color Variants and Dark Mode Overrides**:
   - The `<Typography>` component applies a default `color="primary"` prop, which compiles to `text-slate-900 dark:text-slate-100`. 
   - If you attempt to override the text color using a class (e.g., `class="text-brand-primary"`), it will successfully apply in light mode, but the component's internal `dark:text-slate-100` will override your color in dark mode, causing the text to unexpectedly turn white.
   - **Solution:** Always use the component's native `color` prop (e.g., `color="brand"`, `color="muted"`) to change text colors.

5. **Destructive Action Buttons in Dark Mode**:
   - For destructive actions (e.g., "Hapus"/Delete buttons) using `variant="outline"`, the default component styles may fall back to brand/primary colors in dark mode.
   - **Solution:** explicitly append dark mode text and hover border overrides to ensure the destructive intent is visible (e.g., `class="text-red-600 dark:text-red-500 hover:border-red-200 dark:hover:border-red-900/50"`).

6. **Strict Badge Variants**:
   - The `<Badge>` component strictly accepts specific variants (`primary`, `success`, `warning`, `default`, `danger`). Do NOT arbitrarily use other terms (e.g., `secondary`) as they will throw type errors. Always default to `"default"` if a specific semantic variant is not applicable.
