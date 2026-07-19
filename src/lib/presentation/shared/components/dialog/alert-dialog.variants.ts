import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva(
  'w-full max-w-lg overflow-hidden border border-neutral-border bg-neutral-card p-5 shadow-2xl outline-hidden rounded-xl mx-auto my-auto'
);

export const alertIconVariants = cva(
  'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
  {
    variants: {
      variant: {
        danger: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400',
        warning: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
        info: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
        success: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
      }
    },
    defaultVariants: {
      variant: 'warning'
    }
  }
);

export type AlertDialogVariants = VariantProps<typeof alertDialogVariants>;
export type AlertIconVariants = VariantProps<typeof alertIconVariants>;
