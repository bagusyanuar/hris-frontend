<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '$lib/presentation/shared/utils/cn';
	import { dropdownItemVariants, type DropdownItemVariants } from './dropdown.variants';

	interface Props {
		onclick?: (e: MouseEvent) => void;
		variant?: DropdownItemVariants['variant'];
		disabled?: boolean;
		class?: string;
		children: Snippet;
	}

	let {
		onclick,
		variant = 'default',
		disabled = false,
		class: className = '',
		children
	}: Props = $props();

	function handleClick(e: MouseEvent) {
		if (disabled) {
			e.preventDefault();
			return;
		}
		onclick?.(e);
	}
</script>

<button
	type="button"
	{disabled}
	onclick={handleClick}
	class={cn(dropdownItemVariants({ variant, disabled }), className)}
	role="menuitem"
>
	<div class="flex items-center gap-2 w-full">
		{@render children()}
	</div>
</button>

