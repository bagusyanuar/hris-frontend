<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import Button from '$lib/presentation/shared/components/button/Button.svelte';
	import Icon from '@iconify/svelte';
	import { alertDialogVariants, alertIconVariants } from './alert-dialog.variants';


	interface Props {
		open: boolean;
		title: string;
		description?: string;
		variant?: 'info' | 'warning' | 'danger' | 'success';
		closable?: boolean; // If true, ESC key can close it

		// Default buttons customization
		confirmText?: string;
		cancelText?: string;
		confirmVariant?: 'primary' | 'danger' | 'outline' | 'secondary';
		isLoading?: boolean;

		// Custom snippets
		children?: Snippet; // Overrides description if provided
		actions?: Snippet;  // Overrides footer buttons if provided
		icon?: Snippet;     // Overrides default icon if provided

		// Events
		onconfirm?: () => void | Promise<void>;
		oncancel?: () => void;
	}

	let {
		open = $bindable(false),
		title,
		description,
		variant = 'warning',
		closable = false,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		confirmVariant,
		isLoading = false,
		children,
		actions,
		icon,
		onconfirm,
		oncancel
	}: Props = $props();

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

	function handleConfirm() {
		onconfirm?.();
	}

	function handleCancel() {
		open = false;
		oncancel?.();
	}

	// Variant icon names
	const iconNames = {
		danger: 'lucide:triangle-alert',
		warning: 'lucide:circle-alert',
		info: 'lucide:info',
		success: 'lucide:circle-check'
	};

	// Determine default confirm button variant based on alert variant
	const computedConfirmVariant = $derived(
		confirmVariant || (variant === 'danger' ? 'danger' : 'primary')
	);
</script>

<dialog
	bind:this={dialogElement}
	onclose={handleCancel}
	oncancel={(e) => {
		if (!closable) {
			e.preventDefault();
		}
	}}
	class={cn(alertDialogVariants())}
>
	<div class="flex items-start gap-3.5">
		<!-- Left Column: Icon -->
		<div class="flex-shrink-0">
			{#if icon}
				{@render icon()}
			{:else}
				<div class={cn(alertIconVariants({ variant }))}>
					<Icon icon={iconNames[variant]} class="h-5 w-5" />
				</div>
			{/if}
		</div>

		<!-- Right Column: Content + Actions -->
		<div class="flex-1 space-y-3 pt-0.5">
			<!-- Title & Content -->
			<div class="space-y-1">
				<Typography variant="h4" weight="semibold" color="primary">
					{title}
				</Typography>
				{#if children}
					<div class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
						{@render children()}
					</div>
				{:else if description}
					<p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
						{description}
					</p>
				{/if}
			</div>

			<!-- Actions Area -->
			<div class="flex justify-end gap-3 pt-1">
				{#if actions}
					{@render actions()}
				{:else}
					<Button variant="outline" onclick={handleCancel} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button
						variant={computedConfirmVariant}
						{isLoading}
						onclick={handleConfirm}
					>
						{confirmText}
					</Button>
				{/if}
			</div>
		</div>
	</div>
</dialog>

<style>
	dialog {
		transition:
			opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
			transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
			display 300ms allow-discrete,
			overlay 300ms allow-discrete;
		opacity: 0;
		transform: scale(0.95);
	}

	dialog[open] {
		opacity: 1;
		transform: scale(1);
	}

	@starting-style {
		dialog[open] {
			opacity: 0;
			transform: scale(0.95);
		}
	}

	/* Backdrop */
	dialog::backdrop {
		transition:
			background-color 300ms cubic-bezier(0.4, 0, 0.2, 1),
			backdrop-filter 300ms cubic-bezier(0.4, 0, 0.2, 1),
			display 300ms allow-discrete,
			overlay 300ms allow-discrete;
		background-color: transparent;
		backdrop-filter: blur(0px);
	}

	dialog[open]::backdrop {
		background-color: rgba(2, 6, 23, 0.4);
		backdrop-filter: blur(4px);
	}

	@starting-style {
		dialog[open]::backdrop {
			background-color: transparent;
			backdrop-filter: blur(0px);
		}
	}
</style>
