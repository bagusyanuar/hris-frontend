---
name: tailwindcss-v4
description: Guidelines and best practices for writing Tailwind CSS v4 styles, focusing on the differences from v3 and modern shorthand syntax.
---

# Tailwind CSS v4 Best Practices

Use this skill when writing CSS classes or styles in the presentation layer. Tailwind CSS v4 introduces a new engine (Rust-based) and native CSS-first configuration, along with updated utility classes and shorthand formats.

## Key Syntax Differences & Shorthands

Always write class utilities in their updated v4 shorthands:

### 1. Flexbox Utilities
- **Shrink**: Use `shrink` and `shrink-0` instead of `flex-shrink` and `flex-shrink-0`.
- **Grow**: Use `grow` and `grow-0` instead of `flex-grow` and `flex-grow-0`.
- **Basis**: Use `basis-*` instead of `flex-basis-*`.

### 2. Colors and Opacity
- Do **NOT** use `bg-opacity-*`, `text-opacity-*`, or `border-opacity-*`.
- **Always** use the modern slash notation:
  - `bg-slate-900/50` (instead of `bg-slate-900 bg-opacity-50`)
  - `text-red-500/80`
  - `border-indigo-500/30`

### 3. Container Queries (Built-in)
- v4 natively supports container queries without the `@tailwindcss/container-queries` plugin:
  - Mark parent: `@container`
  - Style children: `@md:grid-cols-2` (styles apply based on the parent container's width, not the viewport).

### 4. Spacing, Borders, and Transforms
- **3D Transforms**: v4 supports native 3D transforms (`transform-3d`, `rotate-x-*`, `rotate-y-*`, etc.).
- **Borders**: You can specify individual border colors directly (e.g. `border-x-red-500`, `border-t-transparent`).
- **Dynamic Viewports**: Always prefer `h-dvh` (dynamic viewport height) or `h-lvh` / `h-svh` for full-screen containers instead of `h-screen` to prevent layout shift on mobile browsers.

## Configuration (CSS-First)
- There is **NO** `tailwind.config.js` in v4. All configuration, themes, custom utilities, and `@import` statements are defined inside the CSS entrypoint (typically `src/app.css` or `index.css`) using the `@theme` directive:
  ```css
  @import "tailwindcss";

  @theme {
    --color-primary: #3b82f6;
    --font-display: "Outfit", sans-serif;
  }
  ```
- Reference custom colors in HTML directly: `bg-primary`, `font-display`.
