import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownItemVariants = cva(
	'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors duration-150 focus:outline-none flex items-center justify-between cursor-pointer',
	{
		variants: {
			variant: {
				default:
					'text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-slate-100',
				danger:
					'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/30 dark:hover:text-rose-350'
			},
			disabled: {
				true: 'opacity-50 pointer-events-none cursor-not-allowed',
				false: ''
			}
		},
		defaultVariants: {
			variant: 'default',
			disabled: false
		}
	}
);

export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
