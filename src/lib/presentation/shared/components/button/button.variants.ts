import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-brand-primary text-white hover:bg-brand-hover focus-visible:ring-brand-primary',
        secondary: 'bg-brand-light text-brand-text hover:bg-brand-light/80 focus-visible:ring-brand-primary',
        outline: 'border border-neutral-border bg-neutral-card text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/50 focus-visible:ring-slate-500',
        ghost: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-slate-500',
        danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500',
      },
      size: {
        sm: 'px-3.5 py-2 text-xs gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3.5 text-base gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
