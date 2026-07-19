import { RuntimeConfig } from '$lib/infrastructure/config/runtime.config';

export const ssr = false;
export const prerender = false;

export async function load({ fetch }) {
  // Panggil init dengan fetch bawaan SvelteKit untuk menjaga kompabilitas load function
  await RuntimeConfig.init(fetch);
  return {};
}
