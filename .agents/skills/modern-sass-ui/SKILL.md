---
name: modern-sass-ui
description: Guidelines and utility code templates for building Modern Corporate SaaS UI / Clean Dashboard with Card-based Layout and brand color abstraction.
---

# Modern SaaS UI & Dashboard Component Builder

Activate this skill when creating or modifying UI components, pages, templates, or layouts for the HRIS frontend, especially when designing dashboards, cards, sidebar/header navigations, and interactive widgets.

> **CRITICAL RULE**: Before you render any UI element (inputs, buttons, modal dialogs, status badges, tables), you **MUST** read the [Component Catalog](file:///Users/dystopia/svelte/hris-frontend/.agents/references/catalog.md) FIRST to find existing reusable components. Do NOT guess component names or write raw HTML/Tailwind for elements that are already cataloged.

This skill ensures that all UI elements conform to the premium **SaaS Design System** and use optimal Tailwind CSS v4 practices with abstract brand tokens so color schemes can be easily changed (e.g., from Emerald to Indigo/Blue) via CSS variables.

---

## 1. CSS Theme Variables (Tailwind CSS v4 Configuration)

Define theme tokens using CSS variables inside the main entrypoint CSS (e.g., `src/app.css`):

```css
@import 'tailwindcss';

@theme {
  /* Brand Tokens (Easy to change when client requests color change) */
  --color-brand-primary: var(--color-emerald-600); /* Change to indigo-600, blue-600, etc. */
  --color-brand-hover: var(--color-emerald-700);
  --color-brand-light: var(--color-emerald-50);
  --color-brand-text: var(--color-emerald-700);
  --color-brand-border: var(--color-emerald-100);

  /* Neutrals & States */
  --color-neutral-bg: var(--color-slate-50);
  --color-neutral-card: var(--color-white);
  --color-neutral-border: var(--color-slate-100);
}
```

---

## 2. Component Variant Management (Mandatory CVA & cn Utility)

For clean, modular, and type-safe components, you **MUST** split styling variants from Svelte components using `class-variance-authority` (CVA) and the `cn` helper (`clsx` + `tailwind-merge`):

### A. Suffix Suffix Convention (`.variants.ts`)

Store all variants definitions in a separate TypeScript file adjacent to the Svelte component, named `<component-name>.variants.ts` (e.g. `button.variants.ts`).

Example variant file structure:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva('base-classes-here', {
  variants: {
    variant: {
      primary: 'bg-brand-primary text-white hover:bg-brand-hover',
      secondary: 'bg-brand-light text-brand-text hover:bg-brand-light/80'
    },
    size: {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm'
    }
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md'
  }
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;
```

### B. Clean Svelte Component Integration

Import variants and merge class names inside the `.svelte` file using the `$lib/presentation/shared/utils/cn` helper.

```html
<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import { buttonVariants, type ButtonVariants } from './button.variants';

  interface Props extends HTMLButtonAttributes, ButtonVariants {
    children?: Snippet;
  }

  let { variant, size, class: className = '', children, ...restProps }: Props = $props();
</script>

<button class="{cn(buttonVariants({" variant, size }), className)} {...restProps}>
  {#if children} {@render children()} {/if}
</button>
```

### C. Complex Multi-Part Components

Unlike `tailwind-variants`, `class-variance-authority` (CVA) **does not support slots**. If you are building a complex component with multiple DOM elements (e.g., a `Drawer` with an overlay, content panel, header, and body), you must export multiple `cva` instances or constants from your `.variants.ts` file, rather than trying to use a `slots` object.

Example for a multi-part component:

```typescript
import { cva, type VariantProps } from 'class-variance-authority';

export const drawerOverlayVariants = cva('fixed inset-0 bg-black/50', { ... });
export const drawerContentVariants = cva('fixed bg-white', { ... });
export const drawerHeaderClass = 'p-4 border-b';
```

---

## 3. Component Design Specifications

### A. The Dashboard Card (Standard Container)

Cards use the abstract colors to remain flexible:

```html
<!-- Base Card Template -->
<div
  class="group relative rounded-2xl border border-neutral-border bg-neutral-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100/80"
>
  <!-- Content -->
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium text-slate-500">Metric Title</span>
    <div
      class="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white"
    >
      <!-- Icon -->
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </div>
  </div>
  <div class="mt-4 flex items-baseline gap-2">
    <span class="text-2xl font-bold tracking-tight text-slate-900">2,450</span>
    <span class="rounded-full bg-brand-light/70 px-2 py-0.5 text-xs font-semibold text-brand-text"
      >+12.5%</span
    >
  </div>
</div>
```

### B. Clean Navigation List (Sidebar Items)

Active states must use abstract brand variables:

```html
<!-- Active Sidebar Link -->
<a
  href="/employees"
  class="group flex items-center gap-3 rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-text transition-all duration-200"
>
  <!-- Icon -->
  <svg class="h-5 w-5 text-brand-primary" ...></svg>
  <span>Employees</span>
</a>

<!-- Inactive Sidebar Link -->
<a
  href="/payroll"
  class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900"
>
  <!-- Icon -->
  <svg class="h-5 w-5 text-slate-400 group-hover:text-slate-600" ...></svg>
  <span>Payroll</span>
</a>
```

### C. Glassmorphism Dynamic Overlay

For dropdowns, dialogs, and popovers:

```html
<div
  class="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-neutral-border bg-white/80 p-2 shadow-lg backdrop-blur-md"
>
  <!-- Dropdown content -->
</div>
```

### D. Bento Grid & Floating Panels Layout

For modern dashboards, style panels as independent floating cards:

- **Outer Wrapper**: Use `h-screen flex p-3 gap-3 overflow-hidden bg-neutral-bg` to enclose the layouts.
- **Main Layout Container**: The `<main>` container where pages render should be transparent (`bg-transparent border-none p-0`). Do NOT apply card styles (`bg-white` or `border`) here.
- **Card Styling**: Aside (sidebar), header, and individual main content panels (Page Header, Metrics, Tables) should have `bg-neutral-card border border-neutral-border rounded-xl` (or `rounded-2xl`) without drop shadows (`shadow-*`) to keep the design minimal and clean.
- **Do NOT Wrap Entire Pages**: Never put all page contents inside a single `<Card>`. Split them into logical blocks.
- **Scrolling**: Enable `overflow-y-auto` only on the active panels (sidebar menu, workspace content area) so the layout stays locked within the viewport height.

### E. Custom Global Scrollbars

For consistent appearance across platforms, apply thin, custom scrollbars using global styles in your Svelte views:

```css
:global(*::-webkit-scrollbar) {
  width: 4px;
  height: 4px;
}
:global(*::-webkit-scrollbar-track) {
  background: transparent;
}
:global(*::-webkit-scrollbar-thumb) {
  background: var(--color-neutral-border, #e2e8f0);
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}
:global(*::-webkit-scrollbar-thumb:hover) {
  background: var(--color-slate-300, #cbd5e1);
}
:global(.dark *::-webkit-scrollbar-thumb) {
  background: var(--color-neutral-border, #334155);
}
```

---

## 4. Height Consistency & Proportional Spacing (White Space)

To maintain alignment when interactive components (Buttons, Inputs, Selects) are placed side-by-side:

### A. Strict Height Consistency

Always design inline interactive elements to have matching line-height, font-size, and vertical paddings. Do not allow inputs or buttons to have different heights when placed next to each other.

- **Small size (sm)**: Target height `32px` (2rem). Class pattern: `py-1.5 px-3 text-xs` or `py-2 px-3.5 text-xs`.
- **Medium size (md)**: Target height `40px` (2.5rem). Class pattern: `py-2.5 px-5 text-sm`.
- **Large size (lg)**: Target height `48px` (3rem). Class pattern: `py-3.5 px-6 text-base`.

### B. Proportional Spacing (Uniform Bento Gaps)

- **Bento Grid Uniformity**: To achieve a flawless floating bento layout, vertical and horizontal gaps must be strictly uniform. If the layout wrapper uses `gap-3` (12px), then the page container must use `flex flex-col gap-3` and grids must use `gap-3`. Do NOT mix `space-y-6` with `gap-4`.
- **Form Layouts**: Use `space-y-5` or `gap-5` for grouping inputs vertically inside a card.
- **Inside Card**: Use a minimum of `p-6` (24px) for desktop layout containers, and `p-4` (16px) for mobile.
- **Element Relationships**: Keep related labels closer to inputs (`mb-1.5` / `mb-2`) than the gap between fields (`mb-5` / `mb-6`).

---

## 5. Accessibility (A11y) Guidelines

All components must be fully accessible by design:

- **Contrast**: Text elements inside colored containers (e.g. `bg-brand-primary` or state badges) must have a minimum contrast ratio of 4.5:1.
- **Keyboard Navigation**:
  - All interactive elements must have visible focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).
  - Use `focus-visible:ring-brand-primary` for brand elements and `focus-visible:ring-slate-500` for neutral elements.
- **Form Labels**: Every input field must have an associated `<label>` element with a matching `for` attribute, or an `aria-label`/`aria-labelledby` if visually hidden.
- **Status Indicators**: Never rely solely on color to convey information. Use icons or text labels inside badges (e.g., success badge should include text, not just green background).

---

## 6. Best Practices Checklist

- [ ] **Mandatory CVA**: Ensure all multi-variant or styled state components split their style configurations into a companion `.variants.ts` file using `class-variance-authority`.
- [ ] **No Arbitrary Tailwind Values**: Make sure there are no arbitrary values like `h-[200px]` or `bg-[#abc]` in Tailwind classes. Instead, use standard scales or add a theme token in `src/app.css` if custom dimensions are needed.
- [ ] **Avoid Hardcoded Colors**: Always prefer abstract token classes (`bg-brand-primary`, `bg-brand-light`, `text-brand-text`, `border-brand-border`) over hardcoded color utilities like `bg-emerald-600` inside component templates.
- [ ] **Spacious Padding**: Minimum `p-6` for normal cards. Don't crowd info.
- [ ] **Hover Transitions**: Apply `transition-all duration-200 active:scale-[0.98]` to all hoverable elements.
- [ ] **Consistent Heights**: Verify that input fields, selectors, and buttons placed side-by-side share the exact same height class (`py-2.5` for Medium/40px).
- [ ] **A11y Focus Rings**: Every button and input must have a clear `focus-visible` outline or ring style.
