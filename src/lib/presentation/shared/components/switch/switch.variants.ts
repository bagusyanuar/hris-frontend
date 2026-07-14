import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
	'rounded-full relative transition-colors duration-200 ease-in-out cursor-pointer select-none',
	{
		variants: {
			variant: {
				primary: '',
				danger: '',
				success: ''
			},
			size: {
				sm: 'h-4 w-7',
				md: 'h-5 w-9',
				lg: 'h-6 w-11'
			}
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md'
		}
	}
);

export const thumbVariants = cva(
	'rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out absolute left-0.5 top-0.5',
	{
		variants: {
			size: {
				sm: 'h-3 w-3',
				md: 'h-4 w-4',
				lg: 'h-5 w-5'
			}
		},
		defaultVariants: {
			size: 'md'
		}
	}
);

export type SwitchVariants = VariantProps<typeof switchVariants>;
export type SwitchVariant = NonNullable<SwitchVariants['variant']>;
export type SwitchSize = NonNullable<SwitchVariants['size']>;
