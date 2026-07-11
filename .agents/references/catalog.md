# Shared Component Catalog

This is the central reference catalog of all reusable presentation components in this project. All components reside in [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components).

---

## 📦 Component Index

### 1. Button
- **Path:** [Button.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/button/Button.svelte)
- **Props:**
  - `variant`: `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'`
  - `size`: `'default' | 'sm' | 'lg' | 'icon'`
  - `isLoading`: `boolean` (displays an animated spinner, disables button)
  - `loadingText`: `string` (text displayed when loading)
  - `children`: `Snippet` (button content)
- **Example:**
  ```svelte
  <Button variant="default" size="md" isLoading={submitting} onclick={saveData}>
    Save Changes
  </Button>
  ```

### 2. TextField
- **Path:** [TextField.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/textfield/TextField.svelte)
- **Props:**
  - `value`: `string | number | string[]` (bindable)
  - `label`: `string` (optional label text)
  - `error`: `string` (optional error message; forces input border to rose/danger)
  - `helperText`: `string` (optional descriptive subtext)
  - `prefix` / `suffix`: `Snippet` (optional icons/addons)
  - `wrapperClass`: `string` (classes for outer container)
  - `ref`: `HTMLInputElement` (bindable element reference)
- **Example:**
  ```svelte
  <TextField bind:value={email} label="Email Address" placeholder="alex@company.com" required />
  ```

### 3. PasswordField
- **Path:** [PasswordField.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/passwordfield/PasswordField.svelte)
- **Props:**
  - *Inherits all props from TextField* (except `type` and `suffix` which are managed internally).
- **Description:**
  - Provides a password input field with a toggleable show/hide eye icon.
- **Example:**
  ```svelte
  <PasswordField bind:value={password} label="Password" required />
  ```

### 4. CurrencyField
- **Path:** [CurrencyField.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/currencyfield/CurrencyField.svelte)
- **Props:**
  - `value`: `number | null` (bindable unmasked integer value, e.g. `5000000`)
  - `currencyPrefix`: `string` (defaults to `"Rp"`)
  - *Inherits all other props from TextField* (except `type` which is set to text).
- **Description:**
  - Uses `imask` to auto-format numeric currency inputs with thousands separator (`.`) and radix (`,`).
- **Example:**
  ```svelte
  <CurrencyField bind:value={salary} label="Basic Salary" />
  ```

### 5. Typography
- **Path:** [Typography.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/typography/Typography.svelte)
- **Props:**
  - `tag`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label'` (optional; automatically inferred from variant if not provided)
  - `variant`: `'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-lg' | 'body-md' | 'body-sm' | 'caption' | 'code'` (defaults to `'body-md'`)
  - `weight`: `'light' | 'normal' | 'medium' | 'semibold' | 'bold'` (optional)
  - `color`: `'primary' | 'secondary' | 'brand' | 'muted' | 'error' | 'success' | 'warning' | 'info' | 'inherit'` (defaults to `'primary'`)
  - `children`: `Snippet` (text/element content)
- **Example:**
  ```svelte
  <Typography variant="h1" color="brand">Welcome to HRIS</Typography>
  ```

