import { cva, type VariantProps } from 'class-variance-authority';

export const carouselIndicatorVariants = cva(
  'h-1.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      tone: {
        light:
          'focus-visible:ring-white/70 focus-visible:ring-offset-transparent hover:bg-white/60',
        dark: 'focus-visible:ring-brand-primary/50 focus-visible:ring-offset-neutral-card hover:bg-slate-400'
      },
      active: {
        true: 'w-6',
        false: 'w-1.5'
      }
    },
    compoundVariants: [
      { tone: 'light', active: true, class: 'bg-white' },
      { tone: 'light', active: false, class: 'bg-white/30' },
      { tone: 'dark', active: true, class: 'bg-brand-primary' },
      { tone: 'dark', active: false, class: 'bg-slate-300 dark:bg-slate-700' }
    ],
    defaultVariants: {
      tone: 'dark',
      active: false
    }
  }
);

export const carouselArrowVariants = cva(
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      tone: {
        light:
          'border-white/15 bg-white/5 text-emerald-50/70 hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:ring-white/70 focus-visible:ring-offset-transparent',
        dark: 'border-neutral-border bg-neutral-card text-slate-500 hover:border-brand-border hover:text-brand-primary focus-visible:ring-brand-primary/50 focus-visible:ring-offset-neutral-card'
      }
    },
    defaultVariants: {
      tone: 'dark'
    }
  }
);

export type CarouselVariants = VariantProps<typeof carouselIndicatorVariants>;
export type CarouselTone = NonNullable<CarouselVariants['tone']>;
