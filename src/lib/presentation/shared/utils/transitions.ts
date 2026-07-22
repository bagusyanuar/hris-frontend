import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';

export interface SlideParams {
  delay?: number;
  duration?: number;
  easing?: (t: number) => number;
  axis?: 'x' | 'y';
}

/**
 * Safe slide transition for Svelte 5 that guards against NaN height/width keyframe calculations
 * when getComputedStyle returns "auto" or unparsed values.
 */
export function safeSlide(
  node: HTMLElement,
  { delay = 0, duration = 200, easing = cubicOut, axis = 'y' }: SlideParams = {}
): TransitionConfig {
  const style = getComputedStyle(node);
  const opacity = +style.opacity || 1;

  const primary_size =
    (axis === 'y'
      ? parseFloat(style.height) || node.getBoundingClientRect().height
      : parseFloat(style.width) || node.getBoundingClientRect().width) || 0;

  const padding_start = parseFloat(axis === 'y' ? style.paddingTop : style.paddingLeft) || 0;
  const padding_end = parseFloat(axis === 'y' ? style.paddingBottom : style.paddingRight) || 0;
  const margin_start = parseFloat(axis === 'y' ? style.marginTop : style.marginLeft) || 0;
  const margin_end = parseFloat(axis === 'y' ? style.marginBottom : style.marginRight) || 0;
  const border_start_width =
    parseFloat(axis === 'y' ? style.borderTopWidth : style.borderLeftWidth) || 0;
  const border_end_width =
    parseFloat(axis === 'y' ? style.borderBottomWidth : style.borderRightWidth) || 0;

  const size_prop = axis === 'y' ? 'height' : 'width';
  const padding_start_prop = axis === 'y' ? 'padding-top' : 'padding-left';
  const padding_end_prop = axis === 'y' ? 'padding-bottom' : 'padding-right';
  const margin_start_prop = axis === 'y' ? 'margin-top' : 'margin-left';
  const margin_end_prop = axis === 'y' ? 'margin-bottom' : 'margin-right';
  const border_start_prop = axis === 'y' ? 'border-top-width' : 'border-left-width';
  const border_end_prop = axis === 'y' ? 'border-bottom-width' : 'border-right-width';

  return {
    delay,
    duration,
    easing,
    css: (t: number) => `
      overflow: hidden;
      opacity: ${t * opacity};
      ${size_prop}: ${t * primary_size}px;
      ${padding_start_prop}: ${t * padding_start}px;
      ${padding_end_prop}: ${t * padding_end}px;
      ${margin_start_prop}: ${t * margin_start}px;
      ${margin_end_prop}: ${t * margin_end}px;
      ${border_start_prop}: ${t * border_start_width}px;
      ${border_end_prop}: ${t * border_end_width}px;
    `
  };
}
