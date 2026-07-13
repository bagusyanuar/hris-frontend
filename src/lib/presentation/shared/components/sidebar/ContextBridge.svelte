<script lang="ts">
	import { setContext } from 'svelte';
	import type { SidebarContext } from './Sidebar.svelte';

	interface Props {
		value: SidebarContext;
		children?: import('svelte').Snippet;
	}

	let { value, children }: Props = $props();

	// Provide a reactive wrapper object to getContext users.
	// This ensures updates are tracked reactively and avoids the compiler warning.
	setContext('sidebar', {
		get isCollapsed() { return value.isCollapsed; },
		get isMobile() { return value.isMobile; },
		get closeMobile() { return value.closeMobile; }
	});
</script>

{@render children?.()}
