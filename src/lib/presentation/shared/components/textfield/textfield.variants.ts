import { cva, type VariantProps } from 'class-variance-authority';

export const textfieldInputVariants = cva(
  'flex w-full rounded-lg border bg-neutral-card text-slate-900 transition-colors duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800',
  {
    variants: {
      variant: {
        default:
          'border-slate-300 focus:border-brand-primary hover:border-slate-400 dark:border-slate-700 dark:focus:border-brand-primary dark:hover:border-slate-600',
        error:
          'border-rose-500 focus:border-rose-500 hover:border-rose-600 dark:border-rose-500/80',
        success:
          'border-emerald-500 focus:border-emerald-500 hover:border-emerald-600 dark:border-emerald-500/80'
      },
      size: {
        sm: 'h-9 px-3 py-1.5 text-xs',
        md: 'h-11 px-4 py-2 text-sm',
        lg: 'h-12 px-4 py-3 text-base'
      },
      hasPrefix: {
        true: '',
        false: ''
      },
      hasSuffix: {
        true: '',
        false: ''
      }
    },
    compoundVariants: [
      { size: 'sm', hasPrefix: true, class: 'pl-9' },
      { size: 'md', hasPrefix: true, class: 'pl-10' },
      { size: 'lg', hasPrefix: true, class: 'pl-11' },
      { size: 'sm', hasSuffix: true, class: 'pr-9' },
      { size: 'md', hasSuffix: true, class: 'pr-10' },
      { size: 'lg', hasSuffix: true, class: 'pr-11' }
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hasPrefix: false,
      hasSuffix: false
    }
  }
);

export type TextfieldInputVariants = VariantProps<typeof textfieldInputVariants>;
