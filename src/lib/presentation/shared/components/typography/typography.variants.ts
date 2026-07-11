import { cva, type VariantProps } from 'class-variance-authority';

export const typographyVariants = cva('', {
	variants: {
		variant: {
			h1: 'text-4xl font-bold tracking-tight',
			h2: 'text-3xl font-semibold tracking-tight',
			h3: 'text-2xl font-semibold tracking-tight',
			h4: 'text-xl font-semibold tracking-tight',
			h5: 'text-lg font-medium tracking-tight',
			h6: 'text-base font-medium tracking-tight',
			'body-lg': 'text-lg leading-relaxed',
			'body-md': 'text-base leading-relaxed',
			'body-sm': 'text-sm leading-relaxed',
			caption: 'text-xs text-slate-500 dark:text-slate-400',
			code: 'font-mono text-sm bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5'
		},
		weight: {
			light: 'font-light',
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold'
		},
		color: {
			primary: 'text-slate-900 dark:text-slate-100',
			secondary: 'text-slate-500 dark:text-slate-400',
			brand: 'text-brand-primary',
			muted: 'text-slate-400 dark:text-slate-500',
			error: 'text-rose-600 dark:text-rose-500',
			success: 'text-emerald-600 dark:text-emerald-500',
			warning: 'text-amber-600 dark:text-amber-500',
			info: 'text-sky-600 dark:text-sky-500',
			inherit: 'text-inherit'
		}
	},
	defaultVariants: {
		variant: 'body-md',
		color: 'primary'
	}
});

export type TypographyVariants = VariantProps<typeof typographyVariants>;
