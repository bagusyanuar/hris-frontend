import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
	'inline-flex items-center gap-1.5 rounded-full font-medium border',
	{
		variants: {
			variant: {
				default: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700',
				primary: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
				success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
				danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
				warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
			},
			size: {
				sm: 'px-2 py-0.5 text-[10px]',
				md: 'px-2.5 py-0.5 text-xs',
				lg: 'px-3 py-1 text-sm'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'md'
		}
	}
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
