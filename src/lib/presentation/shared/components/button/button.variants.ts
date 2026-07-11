import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
	'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
	{
		variants: {
			variant: {
				primary:
					'bg-brand-primary text-white hover:bg-brand-hover focus-visible:ring-brand-primary',
				secondary:
					'bg-brand-light text-brand-text hover:bg-brand-light/80 focus-visible:ring-brand-primary',
				outline:
					'border border-slate-300 bg-transparent text-slate-700 hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/5 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-primary dark:hover:text-brand-primary dark:hover:bg-brand-primary/10 focus-visible:ring-brand-primary',
				ghost:
					'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-slate-500',
				danger: 'bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500'
			},
			size: {
				sm: 'px-3.5 py-2 text-xs gap-1.5',
				md: 'px-5 py-2.5 text-sm gap-2',
				lg: 'px-6 py-3.5 text-base gap-2.5',
				icon: 'p-2.5'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	}
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
