import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'w-full overflow-hidden border border-neutral-border bg-neutral-card p-0 shadow-xl outline-hidden',
  {
    variants: {
      size: {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
      },
      position: {
        center: 'my-auto mx-auto rounded-xl',
        top: 'mt-16 mb-auto mx-auto rounded-xl',
        right:
          'mr-0 ml-auto my-0 h-full max-h-none rounded-l-xl rounded-r-none border-y-0 border-r-0'
      }
    },
    defaultVariants: {
      size: 'md',
      position: 'center'
    }
  }
);

export type DialogVariants = VariantProps<typeof dialogVariants>;
