# Shared Component Catalog

This is the central reference catalog of all reusable presentation components in this project. All components reside in [shared/components](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components).

---

## 📦 Component Index

### 1. Button
- **Path:** [Button.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/button/Button.svelte)
- **Props:**
  - `variant`: `'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'` (defaults to `'primary'`)
  - `size`: `'sm' | 'md' | 'lg' | 'icon'` (defaults to `'md'`)
  - `isLoading`: `boolean` (displays an animated spinner, disables button)
  - `loadingText`: `string` (text displayed when loading)
  - `children`: `Snippet` (button content)
- **Example:**
  ```svelte
  <Button variant="primary" size="md" isLoading={submitting} onclick={saveData}>
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

### 12. Dialog
- **Path:** [Dialog.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dialog/Dialog.svelte)
- **Props:**
  - `open`: `boolean` (bindable; controls the visibility of the dialog)
  - `title`: `string` (optional; displays a header title using Typography component)
  - `size`: `'sm' | 'md' | 'lg' | 'xl'` (defaults to `'md'`; defines the max-width of the modal)
  - `children`: `Snippet` (dialog main content)
  - `footer`: `Snippet` (optional; displays an action bar at the bottom)
  - `onclose`: `() => void` (optional callback triggered when the dialog is closed)
- **Description:**
  - Standard accessibility-compliant modal dialog using HTML5 native `<dialog>` element. Manages backdrop blur, focus trapping, escape-key support, and scaling animations.
- **Example:**
  ```svelte
  <Dialog bind:open={isOpen} title="Confirm Action" size="sm">
    <p>Are you sure you want to proceed?</p>
    {#snippet footer()}
      <Button variant="outline" onclick={() => isOpen = false}>Cancel</Button>
      <Button onclick={confirmAction}>Proceed</Button>
    {/snippet}
  </Dialog>
  ```

### 13. AlertDialog
- **Path:** [AlertDialog.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dialog/AlertDialog.svelte)
- **Props:**
  - `open`: `boolean` (bindable; controls the visibility of the alert dialog)
  - `title`: `string` (header title)
  - `description`: `string` (optional; simple message paragraph)
  - `variant`: `'info' | 'warning' | 'danger' | 'success'` (defaults to `'warning'`; styles icon and confirm button)
  - `closable`: `boolean` (defaults to `false`; if true, allows closing using the ESC key)
  - `confirmText`: `string` (defaults to `'Confirm'`)
  - `cancelText`: `string` (defaults to `'Cancel'`)
  - `confirmVariant`: `'default' | 'destructive' | 'outline' | 'secondary'` (optional; default is inferred from variant)
  - `isLoading`: `boolean` (defaults to `false`; shows a spinner on the confirm button and disables the cancel button)
  - `children`: `Snippet` (optional; overrides `description` for custom body markup)
  - `actions`: `Snippet` (optional; overrides default Cancel/Confirm action buttons)
  - `icon`: `Snippet` (optional; overrides default variant indicator icon)
  - `onconfirm`: `() => void | Promise<void>` (optional callback when confirm is clicked)
  - `oncancel`: `() => void` (optional callback when cancel/close is triggered)
- **Description:**
  - Compact, modern landscape/horizontal alert dialog for critical confirmation dialogs. Prevents backdrop closing by default, and structures visual importance via HSL-accented indicator circles. Includes built-in scale & opacity exit and entry transitions.
- **Example:**
  ```svelte
  <AlertDialog
    bind:open={isConfirmOpen}
    title="Discard Changes?"
    description="You have unsaved changes that will be permanently lost."
    variant="warning"
    confirmText="Discard"
    cancelText="Keep Editing"
    onconfirm={discardData}
  />
  ```

### 14. Switch
- **Path:** [Switch.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/switch/Switch.svelte)
- **Props:**
  - `checked`: `boolean` (bindable; reflects active state)
  - `label`: `string` (optional label text)
  - `description`: `string` (optional secondary description subtext)
  - `error`: `string` (optional validation error message)
- **Description:**
  - Standard accessibility-compliant switch toggle component. Fully supports key focus, sliding micro-animations, custom labels, descriptions, and error states.
- **Example:**
  ```svelte
  <Switch bind:checked={isNotificationsEnabled} label="Enable Notifications" description="Receive real-time alerts." />
  ```

### 15. Card
- **Path:** [Card.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/card/Card.svelte)
- **Props:**
  - `variant`: `'default' | 'accent-primary' | 'accent-success' | 'accent-danger' | 'accent-warning' | 'glass' | 'glow' | 'gradient'` (design style variant)
  - `title`: `string` (optional title text)
  - `description`: `string` (optional secondary/muted description text)
  - `padding`: `'default' | 'none' | 'sm' | 'lg'` (defines internal padding padding)
  - `rounded`: `'default' | 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'` (defines border-radius)
  - `shadow`: `'default' | 'none' | 'sm' | 'md' | 'lg'` (defines shadow depth)
  - `hoverable`: `boolean` (adds interactive hover translation and shadow)
  - `children`: `Snippet` (main card contents)
  - `header`: `Snippet` (optional custom header content overrides `title` and `description`)
  - `footer`: `Snippet` (optional custom footer contents; adds top border separator)
- **Description:**
  - Standard container component designed for the modern card-based SaaS interface. Supports title/description presets, custom headers, footers, hover states, and fully customized borders, padding, and shading.
- **Example:**
  ```svelte
  <Card title="Quick Stats" description="Daily system activity updates" hoverable>
    <p>Main card content here...</p>
    {#snippet footer()}
      <Button size="sm" variant="ghost">View Details</Button>
    {/snippet}
  </Card>
  ```

### 16. DatePicker
- **Path:** [DatePicker.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/date-picker/DatePicker.svelte)
- **Props:**
  - `value`: `DateValue | undefined` (bindable; active selected date value)
  - `type`: `'date' | 'month' | 'year'` (defaults to `'date'`; selects date granularity)
  - `placeholder`: `string` (defaults to context-aware default)
  - `label`: `string` (optional label text)
  - `error`: `string` (optional validation error message)
  - `helperText`: `string` (optional helper caption)
  - `disabled`: `boolean` (disables interactions)
  - `required`: `boolean` (shows red asterisk on label)
  - `variant`: `'default' | 'error' | 'success'`
  - `size`: `'sm' | 'md' | 'lg'`
  - `displayFormat`: `(date: DateValue) => string` (custom date format renderer)
  - `minValue` / `maxValue`: `DateValue | undefined` (range boundary restrictions)
  - `align`: `'start' | 'center' | 'end'` (alignment of calendar dropdown relative to input)
- **Description:**
  - Accessible date selection popover component built on top of `bits-ui` calendar components. Fully styled, supporting month/year navigation dropdowns.
- **Example:**
  ```svelte
  <DatePicker bind:value={birthDate} label="Date of Birth" required />
  ```

### 17. DateRangePicker
- **Path:** [DateRangePicker.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/date-picker/DateRangePicker.svelte)
- **Props:**
  - `value`: `DateRange | undefined` (bindable; active range `{ start: DateValue, end: DateValue }`)
  - `placeholder`: `string` (defaults to `"Pilih rentang tanggal..."`)
  - `label`: `string` (optional label text)
  - `error`: `string` (optional validation error message)
  - `helperText`: `string` (optional helper caption)
  - `disabled`: `boolean` (disables interaction)
  - `required`: `boolean` (shows red asterisk)
  - `variant`: `'default' | 'error' | 'success'`
  - `size`: `'sm' | 'md' | 'lg'`
  - `displayFormat`: `(date: DateValue) => string`
  - `minValue` / `maxValue`: `DateValue | undefined`
  - `align`: `'start' | 'center' | 'end'`
- **Description:**
  - Form-friendly date range selector. Automatically manages date-range highlighting states and formats date labels in human-readable dd/MM/yyyy.
- **Example:**
  ```svelte
  <DateRangePicker bind:value={leaveRange} label="Leave Period" />
  ```

### 18. Dropdown
- **Path:** [Dropdown.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dropdown/Dropdown.svelte) / [DropdownItem.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dropdown/DropdownItem.svelte) / [DropdownDivider.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dropdown/DropdownDivider.svelte)
- **Props (Dropdown):**
  - `align`: `'left' | 'right'` (defaults to `'left'`; alignment of the popup box)
  - `portal`: `boolean` (defaults to `true`; mounts menu to document body)
  - `trigger`: `Snippet<[toggle: () => void, isOpen: boolean]>` (trigger node builder)
  - `content`: `Snippet` (dropdown item list content)
- **Props (DropdownItem):**
  - `variant`: `'default' | 'danger'` (danger styles item with red text/hover state)
  - `disabled`: `boolean`
  - `onclick`: `() => void`
- **Description:**
  - Elegant popup/context menu element with smooth `@starting-style` transitions, click-outside dismissal, focus trapping, and portal rendering.
- **Example:**
  ```svelte
  <Dropdown align="right">
    {#snippet trigger(toggle)}
      <Button onclick={toggle} variant="outline">Actions</Button>
    {/snippet}
    {#snippet content()}
      <DropdownItem onclick={editItem}>Edit Profile</DropdownItem>
      <DropdownDivider />
      <DropdownItem onclick={deleteItem} variant="danger">Delete Account</DropdownItem>
    {/snippet}
  </Dropdown>
  ```

### 19. Navbar
- **Path:** [Navbar.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/navbar/Navbar.svelte) (along with breadcrumbs, toggles, notifications, and search components in the `navbar/` folder)
- **Description:**
  - Desktop-optimized headers containing brand titles, breadcrumbs, search, notification triggers, and user theme toggles.
- **Example:**
  ```svelte
  <Navbar>
    <div class="flex items-center gap-3">
      <NavbarSidebarToggle />
      <NavbarBreadcrumbs items={[{ label: 'Dashboard' }]} />
    </div>
    <div class="flex items-center gap-4">
      <NavbarSearch />
      <NavbarThemeToggle />
      <NavbarNotifications />
    </div>
  </Navbar>
  ```

### 20. Sidebar / DashboardSidebar
- **Path:** [Sidebar.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/sidebar/Sidebar.svelte) / [DashboardSidebar.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/sidebar/DashboardSidebar.svelte)
- **Props (DashboardSidebar):**
  - `isCollapsed`: `boolean` (bindable)
  - `branches`: `Branch[]` (active branches context list)
  - `activeBranch`: `Branch` (bindable; currently selected branch context)
  - `user`: `UserProfile` (`{ name, role, initials }`)
  - `onProfileClick`: `() => void`
  - `onLogoutClick`: `() => void`
- **Description:**
  - Sidebar container supporting collapse/expand animations, mobile overlay slide-ins, nested group lists, branch switcher popovers, and profile summary anchors.
- **Example:**
  ```svelte
  <DashboardSidebar
    bind:isCollapsed={collapsed}
    user={{ name: 'Jane Doe', role: 'HR Admin', initials: 'JD' }}
    branches={[{ id: 'hq', name: 'Headquarters', short: 'HQ', color: 'bg-primary' }]}
  />
  ```

### 21. Dropzone
- **Path:** [Dropzone.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/dropzone/Dropzone.svelte)
- **Props:**
  - `files`: `File[]` (bindable; array of selected/dropped files)
  - `showPreviewList`: `boolean` (defaults to `true`; renders a grid of uploaded files below the dropzone with custom icons and preview modal dialog)
  - `accept`: `string` (comma-separated list of MIME types or extensions, e.g. `'image/*, .pdf'`)
  - `multiple`: `boolean` (defaults to `true`; allows multiple files)
  - `maxSize`: `number` (maximum file size in bytes)
  - `maxFiles`: `number` (maximum number of files allowed)
  - `disabled`: `boolean` (disables interactions)
  - `class`: `string` (custom CSS wrapper classes)
  - `ondrop`: `(acceptedFiles: File[], rejectedFiles: FileRejection[]) => void` (triggered when files are dropped or selected)
  - `children`: `Snippet<[DropzoneState]>` (optional slot for custom template)
- **Description:**
  - Fully accessible drag-and-drop file upload zone styled according to system brand guidelines (emerald accents and support for dark mode). Supports automated validations for file type, file size, and file count, and built-in detail/image preview modal on click.
- **Example:**
  ```svelte
  <script lang="ts">
    import { Dropzone } from '$lib/presentation/shared/components/dropzone';
    let uploadedFiles = $state<File[]>([]);
  </script>

  <Dropzone
    bind:files={uploadedFiles}
    accept="image/*, .pdf, .xlsx"
    maxSize={5 * 1024 * 1024}
  />
  ```

### 22. DataTable
- **Path:** [table/](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/table/) — `Root` / `Header` / `Head` / `Body` / `Row` / `Cell` / `Pagination` (import via `import * as TableUI from '$lib/presentation/shared/components/table'`)
- **Helpers (`helpers.svelte.ts`):**
  - `createTable(options: TableOptions<TData>)`: wraps `@tanstack/svelte-table`'s `createSvelteTable` for Svelte 5. Returns `{ get current(): Table<TData> }` — **always read the table via `.current`**, never wrap the return value in `let x = $derived(...)` around a raw store; TanStack re-emits the same `Table` object reference on every state change, which a `$derived`-from-store chain fails to react to (silently stops updating sort/pagination/expand).
  - `createTableState(initial?: { pageIndex?, pageSize?, sorting? })`: Svelte 5 rune helper for controlled sorting/pagination/selection/visibility/expanded state.
  - `createRowNumberColumn<TData>(header?: string)`: prepend to `columns` for an auto sequential row-number column; `<Table.Cell>` renders it automatically.
  - `getRowNumber(table, row)` / `getPinnedOffset(table, columnId, side)`: pagination-aware row index / cumulative sticky offset for pinned columns.
- **Props (`Root`):** `table: Table<TData>` (pass `tableWrapper.current`), `isLoading?: boolean`, `density?: 'default' | 'compact'`, `loading?: Snippet`, `empty?: Snippet`.
- **Props (`Pagination`):** `table: Table<TData>`, `pageSizeOptions?: number[]`.
- **Column meta (`table.types.ts`):** `ColumnDef.meta` supports `align`, `pinned: 'left' | 'right' | 'none'`, `className`, `headerClassName` for freeze-column / alignment styling.
- **Description:**
  - Headless TanStack Table v8 wrapper styled per the design system: sorting, pagination, row selection/expansion, frozen (pinned) columns, compact density, custom loading/empty states, and auto row-numbering. See [Table.stories.svelte](file:///Users/dystopia/svelte/hris-frontend/src/lib/presentation/shared/components/table/Table.stories.svelte) for full usage patterns across every feature.
  - **Expandable rows gotcha:** TanStack `Row` objects keep a stable identity across re-renders (only external table state mutates), so a keyed `{#each rows as row (row.id)}` does not re-run its body when `row.getIsExpanded()` flips — Svelte sees the same `row` reference and skips it. Read the expanded state straight off `table.current.getState().expanded` in the `{#if}` condition instead of calling `row.getIsExpanded()` there.
- **Example:**
  ```svelte
  <script lang="ts">
    import { getCoreRowModel, getSortedRowModel, getPaginationRowModel, type ColumnDef } from '@tanstack/svelte-table';
    import * as TableUI from '$lib/presentation/shared/components/table';
    import { createTable } from '$lib/presentation/shared/components/table/helpers.svelte';

    const columns: ColumnDef<Employee>[] = [{ accessorKey: 'name', header: 'Nama' }];
    const table = createTable({
      data: employees,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      rowCount: employees.length
    });
  </script>

  <TableUI.Root table={table.current}>
    <TableUI.Header>
      {#each table.current.getHeaderGroups() as headerGroup (headerGroup.id)}
        <TableUI.Row>
          {#each headerGroup.headers as header (header.id)}
            <TableUI.Head {header} />
          {/each}
        </TableUI.Row>
      {/each}
    </TableUI.Header>
    <TableUI.Body>
      {#each table.current.getRowModel().rows as row (row.id)}
        <TableUI.Row hoverable={true}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <TableUI.Cell {cell}>{cell.getValue()}</TableUI.Cell>
          {/each}
        </TableUI.Row>
      {/each}
    </TableUI.Body>
  </TableUI.Root>
  <TableUI.Pagination table={table.current} />
  ```

