<script lang="ts">
	import { type Snippet } from 'svelte';
	import { scale } from 'svelte/transition';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import Icon from '@iconify/svelte';

	interface Props {
		open: boolean;
		title?: string;
		size?: 'sm' | 'md' | 'lg' | 'xl';
		children: Snippet;
		footer?: Snippet;
		onclose?: () => void;
	}

	let { open = $bindable(false), title, size = 'md', children, footer, onclose }: Props = $props();

	let dialogElement: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (open) {
			if (dialogElement && !dialogElement.open) {
				dialogElement.showModal();
			}
		} else {
			if (dialogElement && dialogElement.open) {
				dialogElement.close();
			}
		}
	});

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogElement) {
			handleClose();
		}
	}

	const sizeClasses = {
		sm: 'max-w-md',
		md: 'max-w-lg',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl'
	};
</script>

{#if open}
	<dialog
		bind:this={dialogElement}
		onclose={handleClose}
		onclick={handleBackdropClick}
		class={cn(
			'w-full overflow-hidden rounded-xl border border-neutral-border bg-neutral-card p-0 shadow-xl outline-hidden',
			'backdrop:bg-slate-950/40 backdrop:backdrop-blur-xs',
			sizeClasses[size]
		)}
		transition:scale={{ duration: 150, start: 0.95 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-neutral-border px-6 py-4">
			{#if title}
				<Typography variant="h4" weight="semibold" color="primary">
					{title}
				</Typography>
			{:else}
				<div></div>
			{/if}
			<button
				type="button"
				onclick={handleClose}
				class="rounded-lg p-1.5 text-slate-400 hover:bg-neutral-bg hover:text-slate-600 transition-colors duration-200"
				aria-label="Close dialog"
			>
				<Icon icon="lucide:x" class="h-5 w-5" />
			</button>
		</div>

		<!-- Body -->
		<div class="px-6 py-5 overflow-y-auto max-h-[70vh]">
			{@render children()}
		</div>

		<!-- Footer -->
		{#if footer}
			<div
				class="flex justify-end gap-3 border-t border-neutral-border bg-slate-50/50 dark:bg-slate-900/20 px-6 py-4"
			>
				{@render footer()}
			</div>
		{/if}
	</dialog>
{/if}
