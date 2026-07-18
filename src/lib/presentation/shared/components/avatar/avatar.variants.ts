import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva(
	'relative flex shrink-0 overflow-hidden rounded-full items-center justify-center font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 select-none border border-slate-200 dark:border-slate-700',
	{
		variants: {
			size: {
				xs: 'h-6 w-6 text-[10px]',
				sm: 'h-8 w-8 text-xs',
				md: 'h-10 w-10 text-sm',
				lg: 'h-12 w-12 text-base',
				xl: 'h-16 w-16 text-lg'
			},
			variant: {
				default: '',
				primary: 'bg-brand-light text-brand-primary dark:bg-brand-primary/10 border-brand-primary/20',
				success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 border-emerald-500/20'
			}
		},
		defaultVariants: {
			size: 'md',
			variant: 'default'
		}
	}
);

export type AvatarVariants = VariantProps<typeof avatarVariants>;
