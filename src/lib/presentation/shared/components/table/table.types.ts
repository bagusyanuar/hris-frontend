import type { RowData } from '@tanstack/svelte-table';

/**
 * Module augmentation for TanStack Table's `ColumnMeta`.
 * Lets column definitions carry presentation-layer layout/style hints
 * (align, pinned side, extra classes) with full type-safety — no casting.
 */
declare module '@tanstack/svelte-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    pinned?: 'left' | 'right' | 'none';
    className?: string;
    headerClassName?: string;
  }
}

export {};
