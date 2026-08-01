<script lang="ts" generics="T">
  import type { Snippet } from 'svelte';
  import Icon from '@iconify/svelte';
  import { cn } from '$lib/presentation/shared/utils/cn';
  import {
    carouselArrowVariants,
    carouselIndicatorVariants,
    type CarouselTone
  } from './carousel.variants';

  interface Props {
    /** Descriptive identifier for the carousel landmark (a11y & e2e testing). */
    id: string;
    items: T[];
    slide: Snippet<[T, number]>;
    activeIndex?: number;
    autoplay?: boolean;
    /** Autoplay delay in milliseconds. */
    interval?: number;
    pauseOnHover?: boolean;
    showIndicators?: boolean;
    showArrows?: boolean;
    tone?: CarouselTone;
    label?: string;
    class?: string;
    /** Classes for the controls row (indicators & arrows). */
    controlsClass?: string;
  }

  let {
    id,
    items,
    slide,
    activeIndex = $bindable(0),
    autoplay = true,
    interval = 6000,
    pauseOnHover = true,
    showIndicators = true,
    showArrows = false,
    tone = 'dark',
    label = 'Galeri informasi',
    class: className = '',
    controlsClass = ''
  }: Props = $props();

  let isPaused = $state(false);

  const indices = $derived([...items.keys()]);
  const hasControls = $derived(items.length > 1 && (showIndicators || showArrows));

  function goTo(index: number) {
    if (items.length === 0) return;
    activeIndex = (index + items.length) % items.length;
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  $effect(() => {
    if (!autoplay || isPaused || items.length < 2) return;
    void activeIndex; // restart the timer whenever the slide changes manually

    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  });
</script>

<section
  {id}
  class={cn('flex flex-col', className)}
  aria-roledescription="carousel"
  aria-label={label}
  onmouseenter={() => {
    if (pauseOnHover) isPaused = true;
  }}
  onmouseleave={() => {
    if (pauseOnHover) isPaused = false;
  }}
  onfocusin={() => (isPaused = true)}
  onfocusout={() => (isPaused = false)}
>
  <!-- Slides are stacked in a single grid cell so the track keeps the tallest slide's height. -->
  <div class="grid flex-1">
    {#each items as item, index (index)}
      <div
        class={cn(
          'col-start-1 row-start-1 transition-all duration-500 ease-out',
          index === activeIndex
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        )}
        role="group"
        aria-roledescription="slide"
        aria-label="Slide {index + 1} dari {items.length}"
        aria-hidden={index !== activeIndex}
        inert={index !== activeIndex}
      >
        {@render slide(item, index)}
      </div>
    {/each}
  </div>

  {#if hasControls}
    <div class={cn('flex items-center gap-4 pt-6', controlsClass)}>
      {#if showArrows}
        <button
          type="button"
          class={carouselArrowVariants({ tone })}
          aria-label="Slide sebelumnya"
          onclick={previous}
        >
          <Icon icon="lucide:chevron-left" class="h-4 w-4" />
        </button>
      {/if}

      {#if showIndicators}
        <div class="flex items-center gap-1.5">
          {#each indices as index (index)}
            <button
              type="button"
              class={carouselIndicatorVariants({ tone, active: index === activeIndex })}
              aria-label="Ke slide {index + 1}"
              aria-current={index === activeIndex}
              onclick={() => goTo(index)}
            ></button>
          {/each}
        </div>
      {/if}

      {#if showArrows}
        <button
          type="button"
          class={carouselArrowVariants({ tone })}
          aria-label="Slide berikutnya"
          onclick={next}
        >
          <Icon icon="lucide:chevron-right" class="h-4 w-4" />
        </button>
      {/if}
    </div>
  {/if}
</section>
