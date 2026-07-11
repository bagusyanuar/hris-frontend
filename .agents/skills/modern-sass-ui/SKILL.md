---
name: modern-sass-ui
description: Guidelines and utility code templates for building Modern Corporate SaaS UI / Clean Dashboard with Card-based Layout and brand color abstraction.
---

# Modern SaaS UI & Dashboard Component Builder

Activate this skill when creating or modifying UI components, pages, templates, or layouts for the HRIS frontend, especially when designing dashboards, cards, sidebar/header navigations, and interactive widgets.

This skill ensures that all UI elements conform to the premium **SaaS Design System** and use optimal Tailwind CSS v4 practices with abstract brand tokens so color schemes can be easily changed (e.g., from Emerald to Indigo/Blue) via CSS variables.

---

## 1. CSS Theme Variables (Tailwind CSS v4 Configuration)
Define theme tokens using CSS variables inside the main entrypoint CSS (e.g., `src/app.css`):

```css
@import "tailwindcss";

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

## 2. Component Design Specifications

### A. The Dashboard Card (Standard Container)
Cards use the abstract colors to remain flexible:

```html
<!-- Base Card Template -->
<div class="group relative rounded-2xl border border-neutral-border bg-neutral-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100/80">
  <!-- Content -->
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium text-slate-500">Metric Title</span>
    <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-light text-brand-primary transition-colors group-hover:bg-brand-primary group-hover:text-white">
      <!-- Icon -->
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    </div>
  </div>
  <div class="mt-4 flex items-baseline gap-2">
    <span class="text-2xl font-bold tracking-tight text-slate-900">2,450</span>
    <span class="text-xs font-semibold text-brand-text bg-brand-light/70 px-2 py-0.5 rounded-full">+12.5%</span>
  </div>
</div>
```

### B. Clean Navigation List (Sidebar Items)
Active states must use abstract brand variables:

```html
<!-- Active Sidebar Link -->
<a href="/employees" class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 bg-brand-light text-brand-text">
  <!-- Icon -->
  <svg class="h-5 w-5 text-brand-primary" ...></svg>
  <span>Employees</span>
</a>

<!-- Inactive Sidebar Link -->
<a href="/payroll" class="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
  <!-- Icon -->
  <svg class="h-5 w-5 text-slate-400 group-hover:text-slate-600" ...></svg>
  <span>Payroll</span>
</a>
```

### C. Glassmorphism Dynamic Overlay
For dropdowns, dialogs, and popovers:

```html
<div class="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-neutral-border bg-white/80 p-2 shadow-lg backdrop-blur-md">
  <!-- Dropdown content -->
</div>
```

---

## 3. Height Consistency & Proportional Spacing (White Space)
To maintain alignment when interactive components (Buttons, Inputs, Selects) are placed side-by-side:

### A. Strict Height Consistency
Always design inline interactive elements to have matching line-height, font-size, and vertical paddings. Do not allow inputs or buttons to have different heights when placed next to each other.
- **Small size (sm)**: Target height `32px` (2rem). Class pattern: `py-1.5 px-3 text-xs` or `py-2 px-3.5 text-xs`.
- **Medium size (md)**: Target height `40px` (2.5rem). Class pattern: `py-2.5 px-5 text-sm`.
- **Large size (lg)**: Target height `48px` (3rem). Class pattern: `py-3.5 px-6 text-base`.

### B. Proportional Spacing (White Space)
- **Form Layouts**: Use `space-y-5` or `gap-5` for grouping inputs vertically.
- **Inside Card**: Use a minimum of `p-6` (24px) for desktop layout containers, and `p-4` (16px) for mobile.
- **Element Relationships**: Keep related labels closer to inputs (`mb-1.5` / `mb-2`) than the gap between fields (`mb-5` / `mb-6`).

---

## 4. Accessibility (A11y) Guidelines
All components must be fully accessible by design:
- **Contrast**: Text elements inside colored containers (e.g. `bg-brand-primary` or state badges) must have a minimum contrast ratio of 4.5:1.
- **Keyboard Navigation**:
  - All interactive elements must have visible focus rings (`focus-visible:ring-2 focus-visible:ring-offset-2`).
  - Use `focus-visible:ring-brand-primary` for brand elements and `focus-visible:ring-slate-500` for neutral elements.
- **Form Labels**: Every input field must have an associated `<label>` element with a matching `for` attribute, or an `aria-label`/`aria-labelledby` if visually hidden.
- **Status Indicators**: Never rely solely on color to convey information. Use icons or text labels inside badges (e.g., success badge should include text, not just green background).

---

## 5. Best Practices Checklist
- [ ] **Avoid Hardcoded Colors**: Always prefer abstract token classes (`bg-brand-primary`, `bg-brand-light`, `text-brand-text`, `border-brand-border`) over hardcoded color utilities like `bg-emerald-600` inside component templates.
- [ ] **Spacious Padding**: Minimum `p-6` for normal cards. Don't crowd info.
- [ ] **Hover Transitions**: Apply `transition-all duration-200 active:scale-[0.98]` to all hoverable elements.
- [ ] **Consistent Heights**: Verify that input fields, selectors, and buttons placed side-by-side share the exact same height class (`py-2.5` for Medium/40px).
- [ ] **A11y Focus Rings**: Every button and input must have a clear `focus-visible` outline or ring style.

