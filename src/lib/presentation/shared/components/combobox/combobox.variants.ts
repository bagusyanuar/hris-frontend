import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxInputVariants = cva(
	'flex w-full items-center justify-between rounded-lg border bg-neutral-card text-slate-900 transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 dark:bg-slate-900 dark:text-slate-100 dark:disabled:bg-slate-800',
	{
		variants: {
			variant: {
				default:
					'border-slate-300 focus-within:border-brand-primary hover:border-slate-400 focus-within:hover:border-brand-primary dark:border-slate-700 dark:focus-within:border-brand-primary dark:hover:border-slate-600 dark:focus-within:hover:border-brand-primary',
				error:
					'border-rose-500 focus-within:border-rose-500 hover:border-rose-600 focus-within:hover:border-rose-500 dark:border-rose-500/80 dark:focus-within:hover:border-rose-500/80',
				success:
					'border-emerald-500 focus-within:border-emerald-500 hover:border-emerald-600 focus-within:hover:border-emerald-500 dark:border-emerald-500/80 dark:focus-within:hover:border-emerald-500/80'
			},
			size: {
				sm: 'min-h-9 py-1 px-3 text-xs',
				md: 'min-h-11 py-1.5 px-4 text-sm',
				lg: 'min-h-12 py-2 px-4 text-base'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type ComboboxInputVariants = VariantProps<typeof comboboxInputVariants>;
