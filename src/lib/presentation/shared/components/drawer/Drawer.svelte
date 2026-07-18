<script lang="ts">
	import { type Snippet } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { drawerOverlayVariants, drawerContentVariants, drawerHeaderClass, drawerBodyClass, drawerFooterClass, type DrawerContentVariants } from './drawer.variants';

	interface Props extends DrawerContentVariants {
		isOpen: boolean;
		onClose: () => void;
		title?: string;
		class?: string;
		header?: Snippet;
		children: Snippet;
		footer?: Snippet;
	}

	let {
		isOpen,
		onClose,
		position = 'right',
		title,
		class: className,
		header,
		children,
		footer
	}: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div class="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
		<!-- Backdrop -->
		<div
			class={drawerOverlayVariants({ isOpen })}
			transition:fade={{ duration: 300 }}
			onclick={onClose}
			aria-hidden="true"
		></div>

		<!-- Panel -->
		<div
			class={cn(drawerContentVariants({ position, isOpen }), className)}
			transition:fly={{
				x: position === 'right' ? 500 : -500,
				duration: 300,
				opacity: 1
			}}
		>
			<!-- Header -->
			{#if header || title}
				<div class={drawerHeaderClass}>
					{#if header}
						{@render header()}
					{:else if title}
						<h2 class="text-lg font-semibold text-slate-900 dark:text-white" id="slide-over-title">
							{title}
						</h2>
					{/if}
					<button
						type="button"
						class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
						onclick={onClose}
					>
						<span class="sr-only">Close panel</span>
						<Icon icon="lucide:x" class="h-5 w-5" />
					</button>
				</div>
			{/if}

			<!-- Body -->
			<div class={drawerBodyClass}>
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class={drawerFooterClass}>
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
