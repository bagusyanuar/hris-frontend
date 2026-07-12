import { cva, type VariantProps } from 'class-variance-authority';

export const cardVariants = cva(
	'border border-neutral-border bg-neutral-card text-slate-900 dark:text-slate-100 transition-all duration-300',
	{
		variants: {
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
			padding: 'md',
			rounded: 'lg',
			shadow: 'xs',
			hoverable: false
		}
	}
);

export type CardVariants = VariantProps<typeof cardVariants>;
