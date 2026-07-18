import { cva, type VariantProps } from 'class-variance-authority';

export const drawerOverlayVariants = cva(
	'fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300',
	{
		variants: {
			isOpen: {
				true: 'opacity-100',
				false: 'opacity-0 pointer-events-none'
			}
		},
		defaultVariants: {
			isOpen: false
		}
	}
);

export const drawerContentVariants = cva(
	'fixed z-50 flex flex-col bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 ease-in-out',
	{
		variants: {
			position: {
				right: 'inset-y-0 right-0 w-full sm:w-[400px] md:w-[500px] border-l border-slate-200 dark:border-slate-800',
				left: 'inset-y-0 left-0 w-full sm:w-[400px] md:w-[500px] border-r border-slate-200 dark:border-slate-800'
			},
			isOpen: {
				true: 'translate-x-0',
				false: ''
			}
		},
		compoundVariants: [
			{
				position: 'right',
				isOpen: false,
				class: 'translate-x-full'
			},
			{
				position: 'left',
				isOpen: false,
				class: '-translate-x-full'
			}
		],
		defaultVariants: {
			position: 'right',
			isOpen: false
		}
	}
);

export const drawerHeaderClass = 'flex items-center justify-between border-b border-slate-200 dark:border-slate-800 p-4 sm:p-6';
export const drawerBodyClass = 'flex-1 overflow-y-auto p-4 sm:p-6';
export const drawerFooterClass = 'border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6';

export type DrawerContentVariants = VariantProps<typeof drawerContentVariants>;
