import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
	'transition-all duration-300',
	{
		variants: {
			variant: {
				default: 'border border-neutral-border bg-neutral-card text-slate-900 dark:text-slate-100',
				'accent-primary': 'border border-neutral-border border-l-4 border-l-brand-primary bg-neutral-card text-slate-900 dark:text-slate-100',
				'accent-success': 'border border-neutral-border border-l-4 border-l-emerald-500 bg-neutral-card text-slate-900 dark:text-slate-100',
				'accent-danger': 'border border-neutral-border border-l-4 border-l-rose-500 bg-neutral-card text-slate-900 dark:text-slate-100',
				'accent-warning': 'border border-neutral-border border-l-4 border-l-amber-500 bg-neutral-card text-slate-900 dark:text-slate-100',
				glass: 'bg-neutral-card/70 backdrop-blur-md border border-neutral-border/60 text-slate-900 dark:text-slate-100',
				glow: 'border border-neutral-border bg-neutral-card text-slate-900 dark:text-slate-100 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] dark:hover:shadow-[0_0_20px_rgba(16,185,129,0.08)]',
				gradient: 'bg-gradient-to-br from-brand-primary/10 to-brand-light/5 text-slate-900 border border-brand-border/30 dark:from-slate-900/50 dark:to-slate-950/50 dark:text-slate-100'
			},
			padding: {
				none: 'p-0',
				sm: 'p-4',
				md: 'p-4 md:p-6',
				lg: 'p-6 md:p-8'
			},
			rounded: {
				none: 'rounded-none',
				sm: 'rounded-lg',
				md: 'rounded-xl',
				lg: 'rounded-2xl'
			},
			shadow: {
				none: 'shadow-none',
				xs: 'shadow-xs',
				sm: 'shadow-sm',
				md: 'shadow-md',
				lg: 'shadow-lg'
			},
			hoverable: {
				true: 'hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-100/80 dark:hover:shadow-neutral-bg/20 cursor-pointer',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'default',
			padding: 'md',
			rounded: 'lg',
			shadow: 'xs',
			hoverable: false
		}
	}
);

export type CardVariants = VariantProps<typeof cardVariants>;

