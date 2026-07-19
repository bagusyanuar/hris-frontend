import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva(
  'w-full border-collapse text-left align-middle text-slate-900 dark:text-slate-100',
  {
    variants: {
      density: {
        default: '',
        compact: ''
      }
    },
    defaultVariants: {
      density: 'default'
    }
  }
);

export const cellVariants = cva('transition-colors duration-200', {
  variants: {
    density: {
      default: 'px-6 py-4 text-sm',
      compact: 'px-4 py-2 text-xs'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    },
    pinned: {
      left: 'sticky bg-inherit z-10 border-r border-neutral-border',
      right: 'sticky bg-inherit z-10 border-l border-neutral-border',
      none: ''
    }
  },
  defaultVariants: {
    density: 'default',
    align: 'left',
    pinned: 'none'
  }
});

export const headVariants = cva(
  'border-b border-neutral-border font-semibold text-slate-500 dark:text-slate-400 select-none bg-neutral-bg/40',
  {
    variants: {
      density: {
        default: 'px-6 py-3 text-sm',
        compact: 'px-4 py-2 text-xs'
      },
      align: {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
      },
      pinned: {
        left: 'sticky bg-neutral-bg z-20 border-r border-neutral-border',
        right: 'sticky bg-neutral-bg z-20 border-l border-neutral-border',
        none: ''
      }
    },
    defaultVariants: {
      density: 'default',
      align: 'left',
      pinned: 'none'
    }
  }
);

export const rowVariants = cva('transition-colors duration-200 bg-neutral-card', {
  variants: {
    hoverable: {
      true: 'hover:bg-neutral-bg/30 cursor-pointer',
      false: ''
    },
    selected: {
      true: 'bg-brand-light/40 text-brand-text dark:bg-brand-primary/10',
      false: ''
    },
    striped: {
      true: 'even:bg-neutral-bg/10',
      false: ''
    }
  },
  defaultVariants: {
    hoverable: false,
    selected: false,
    striped: false
  }
});

export type TableVariants = VariantProps<typeof tableVariants>;
export type CellVariants = VariantProps<typeof cellVariants>;
export type HeadVariants = VariantProps<typeof headVariants>;
export type RowVariants = VariantProps<typeof rowVariants>;
