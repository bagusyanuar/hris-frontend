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
