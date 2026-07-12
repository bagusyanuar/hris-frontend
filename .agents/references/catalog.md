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

### 6. Label
- **Path:** [Label.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/label/Label.svelte)
- **Props:**
  - `required`: `boolean` (optional; displays a red asterisk next to the label content if true)
  - `children`: `Snippet` (label text/content)
- **Example:**
  ```svelte
  <Label required={true}>First Name</Label>
  ```

### 7. HelperText
- **Path:** [HelperText.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/helpertext/HelperText.svelte)
- **Props:**
  - `variant`: `'default' | 'error'` (defaults to `'default'`)
  - `children`: `Snippet` (text content)
- **Example:**
  ```svelte
  <HelperText variant="error">This field is required</HelperText>
  ```

### 8. Checkbox
- **Path:** [Checkbox.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/checkbox/Checkbox.svelte)
- **Props:**
  - `checked`: `boolean` (bindable; reflects checked state)
  - `label`: `string` (optional; displays a label next to the checkbox)
  - `description`: `string` (optional; displays secondary descriptive subtext)
  - `error`: `string` (optional; displays a red validation error)
- **Example:**
  ```svelte
  <Checkbox bind:checked={agreed} label="Terms & Conditions" description="Agree to terms" />
  ```

### 9. Radio
- **Path:** [Radio.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/radio/Radio.svelte)
- **Props:**
  - `value`: `any` (the value this radio represents)
  - `group`: `any` (bindable; the shared active group value)
  - `label`: `string` (optional; label text)
  - `description`: `string` (optional; secondary description subtext)
  - `error`: `string` (optional; validation error message)
- **Example:**
  ```svelte
  <Radio bind:group={selectedValue} value="option1" label="Option One" />
  ```

### 10. Combobox
- **Path:** [Combobox.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/combobox/Combobox.svelte)
- **Props:**
  - `options`: `Option[]` (list of selectable options, where `Option` is `{ value: string | number; label: string }`)
  - `value`: `Option | undefined` (bindable; active selected option object)
  - `placeholder`: `string` (defaults to `"Select option..."`)
  - `label`: `string` (optional label text)
  - `error`: `string` (optional validation error message)
  - `helperText`: `string` (optional descriptive helper text)
  - `disabled`: `boolean` (disables interaction)
  - `required`: `boolean` (displays red asterisk on the label)
  - `variant`: `'default' | 'error' | 'success'` (visual status styling)
  - `size`: `'sm' | 'md' | 'lg'` (input size)
  - `clearable`: `boolean` (defaults to `true`; shows/hides the clear button)
  - `prefix`: `string` (optional; Iconify icon name to display on the left side)
- **Example:**
  ```svelte
  <Combobox
    options={[
      { value: 'svelte', label: 'Svelte' },
      { value: 'react', label: 'React' }
    ]}
    bind:value={selectedFramework}
    label="Frontend Framework"
    placeholder="Choose framework..."
    prefix="lucide:search"
  />
  ```

### 11. Toast / Toaster
- **Path:** [Toaster.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/toast/Toaster.svelte) / [toast.svelte.ts](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/toast/toast.svelte.ts)
- **Methods:**
  - `toast.success(message: string, title?: string, duration?: number)`
  - `toast.error(message: string, title?: string, duration?: number)`
  - `toast.warning(message: string, title?: string, duration?: number)`
  - `toast.info(message: string, title?: string, duration?: number)`
  - `toast.dismiss(id: string)`
- **Description:**
  - Standard Svelte 5 reactive notification toast manager. Must mount `<Toaster />` in the root layout file.
- **Example:**
  ```typescript
  import { toast } from '$lib/presentation/shared/components/toast';

  toast.success('Settings saved successfully!', 'Success');
  ```

