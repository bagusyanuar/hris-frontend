# UI Design & Theming Rules (Modern Corporate SaaS UI)

These rules define the UI standards, theming conventions, and layout guidelines for the HRIS frontend project. All components and pages must adhere to these rules to maintain visual consistency, premium aesthetics, and professional user experience.

## 1. Design Philosophy
- **Modern Corporate SaaS / Clean Dashboard**: Clean layout, premium feel, subtle border lines, spacious elements, and rich typography.
- **Card-based Layout**: Main data and sections must be grouped in structured, independent cards with consistent padding, subtle shadows, and rounded corners.
- **Aesthetic Excellence**: Avoid generic colors or raw CSS borders. Use proper shadows, micro-interactions, transitions, and hover states.

## 2. Color Palette (Abstracted Tokens)
We use a premium, configurable color theme. All component classes should use abstract tokens rather than hardcoded tailwind colors (e.g. use `bg-brand-primary` instead of `bg-emerald-600`), making it trivial to change colors if requested by clients.

- **Primary / Brand Color Tokens**:
  - Base Primary: `bg-brand-primary` / `text-brand-primary` (for main actions, focus states, and primary highlights)
  - Dark Primary: `bg-brand-hover` / `hover:bg-brand-hover` (for button hover states)
  - Light Primary Accent: `bg-brand-light` / `text-brand-text` (for active navigation indicators, badges, or selected state highlights)
  - Border Accent: `border-brand-border`
- **Neutral Colors (Slate / Zinc)**:
  - App Background: `bg-neutral-bg` (soft off-white to contrast against white cards in light mode; slate-950 in dark mode)
  - Card Background: `bg-neutral-card` (white in light mode; slate-900 in dark mode)
  - Text Primary: `text-slate-900` / `text-zinc-900` (auto shifts in dark mode)
  - Text Secondary: `text-slate-500` / `text-zinc-500`
  - Borders: `border-neutral-border` (slate-100 in light mode; slate-800 in dark mode)
- **Status Colors**:
  - Success: Green (`emerald-600` / `emerald-50` or success tokens)
  - Warning: Amber (`amber-500` / `amber-50`)
  - Danger: Rose (`rose-600` / `rose-50`)
  - Info: Sky/Blue (`sky-600` / `sky-50`)

## 3. Dark Mode Support
The application defaults to **Light Mode** and fully supports **Dark Mode** via class toggling (`.dark` on the `html` or `body` element).
- Design system variables (neutral backgrounds, cards, and borders) will automatically invert values when the `.dark` class is active.
- Always use the semantic abstract token classes (e.g., `bg-neutral-bg`, `bg-neutral-card`, `border-neutral-border`) to ensure layout components transition seamlessly.
- Avoid absolute colors like `bg-white` or `bg-slate-50` on core layout wrappers, use `bg-neutral-card` and `bg-neutral-bg` respectively.

## 3. Card-based Layout Guidelines
Every content card must have:
- **Borders & Shadows**: Soft borders (`border border-neutral-border`). **IMPORTANT**: Avoid using drop shadows (`shadow-sm`, etc.) on parent/layout containers (such as the Sidebar, Page Header, and Main Content wrap in Bento Grid) to keep the app minimal; rely entirely on border lines for structural definition.
- **Rounding**: Consistent rounded corners, preferably `rounded-xl`.
- **Padding**: Generous spacing inside the card, minimum `p-6` (24px) for desktop, `p-4` (16px) for mobile.
- **Structure**:
  - **Header**: Optional, but if present, contains a descriptive title (`text-base font-semibold text-slate-900`) and optional actions (e.g. menu, filter button).
  - **Body**: Core visual details or data representation.
  - **Footer**: Optional action area separated by a soft border or simple spacing.

```html
<!-- Example of a Standard Card in Svelte using Abstract Tokens (No Shadow) -->
<div class="rounded-xl border border-neutral-border bg-neutral-card p-6 transition-all duration-200">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-base font-semibold text-slate-900">Card Title</h3>
    <span class="rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-medium text-brand-text">Status</span>
  </div>
  <div class="text-sm text-slate-600">
    <!-- Card content here -->
  </div>
</div>
```

## 4. Bento Grid & Floating Panels Layout
For premium SaaS dashboards, use the **Bento Grid / Floating Panels** layout:
- **Outer Viewport**: `h-screen flex p-3 gap-3 overflow-hidden bg-neutral-bg`.
- **Panels**: The Sidebar, Page Header, and Workspace content scroll area are styled as individual floating cards (`bg-neutral-card border border-neutral-border rounded-xl`).
- **Internal Scrolling**: Set `overflow-y-auto` and `flex-1` on individual panels (like Sidebar menu and Main workspace body) instead of scrolling the whole window.

## 5. Custom Scrollbars
Never use browser default scrollbars on scrollable panels.
- Add global styling for Webkit and Firefox scrollbars to make them extremely thin and subtle:
  ```css
  :global(*::-webkit-scrollbar) {
    width: 4px;
    height: 4px;
  }
  :global(*::-webkit-scrollbar-thumb) {
    background: var(--color-neutral-border);
    border-radius: 9999px;
  }
  ```

## 6. Typography & Spacing
- **Font**: Use clean, modern geometric fonts (e.g., `font-sans`).
- **Mandatory Typography Component**: **ALL** text content (headings, body copy, descriptions, captions, spans, labels, etc.) must be rendered using the `Typography` component. Never use raw HTML text tags (`<h1>`, `<p>`, `<span>`, `<label>`) with manual classes or custom styles directly in pages or components.
- **Consistency**: Maintain a strict spacing rhythm (e.g., `gap-4`, `space-y-6`, `p-6`). Do not use ad-hoc pixel values; rely entirely on Tailwind CSS utility spacing values.
- **Micro-animations**: All interactive elements (buttons, cards, links, tabs) must have smooth transitions: `transition-all duration-200 ease-in-out` with hover scale or background shifts.

---

## 7. Collapsed Sidebar Tooltips & Hover Flyouts Guidelines

When implementing tooltips or flyout panels in a collapsed/mini-sidebar layout, follow these critical UX and styling patterns:

1. **Hover Bridge Pattern (CRITICAL)**:
   - Avoid using margins (e.g., `ml-2`) to create space between the sidebar trigger button and the absolute-positioned hover panel. Margin gaps create a dead-zone that triggers a `mouseout` event when the cursor crosses over, causing the panel to flicker or close immediately.
   - **Solution**: Wrap the hover panel in a parent container with left padding (e.g., `pl-2`) that acts as an invisible interactive bridge. This ensures the hover state stays active as the mouse moves into the submenu.
2. **Preventing Overflow Clipping**:
   - Scrollable sidebar lists (`overflow-y-auto` or `overflow-hidden`) will clip absolute children extending outside the sidebar width (like tooltips or submenus).
   - **Solution**: Conditionally disable vertical overflow when the sidebar is collapsed (e.g., `{sidebar.isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`).
3. **Contrast in Dark Mode**:
   - Tooltips and floating panels must stand out against parent containers. Do not use the same background token (e.g., `bg-neutral-card`) as the sidebar.
   - **Solution**: In Light Mode, use a clean white card with a subtle border and shadow. In Dark Mode, use a contrasting background (e.g., `dark:bg-slate-950`) accompanied by a subtle brand-colored border (e.g., `dark:border-emerald-500/30`) to make it pop.

---

## 8. Tailwind & Styling Best Practices

1. **Mandatory `class-variance-authority` (CVA)**:
   - When building a component with multiple states, sizes, colors, or visual styles, you **MUST** define them using `class-variance-authority` (CVA) in a companion file named `<ComponentName>.variants.ts`.
   - Merging classes should be performed using the `cn` utility (`$lib/presentation/shared/utils/cn`).

2. **Strict Avoidance of Tailwind Arbitrary Values**:
   - Do **NOT** use arbitrary values such as `bg-[#6366f1]`, `w-[360px]`, `h-[48px]`, or `top-[8px]`.
   - Prefer Tailwind's native layout, spacing, and sizing scales (e.g., `w-80`, `h-12`, `top-2`).
   - If a specific custom spacing, color, or dimension is needed, configure it as a design token variable inside the `@theme` block in `src/app.css` (Tailwind v4) rather than using an inline arbitrary value.

