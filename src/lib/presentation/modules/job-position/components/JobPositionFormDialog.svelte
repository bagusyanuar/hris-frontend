<script lang="ts">
	import { Typography } from '$lib/presentation/shared/components/typography';
	import type {
		JobPositionModel,
		CreateJobPositionInput,
		UpdateJobPositionInput
	} from '$lib/core/job-position';
	import type { Option } from '$lib/presentation/shared/components/combobox';

	let { isOpen = $bindable(), onClose } = $props<{
		isOpen: boolean;
		position: JobPositionModel | null;
		parentOptions: Option[];
		isSubmitting: boolean;
		onSubmit: (data: CreateJobPositionInput | UpdateJobPositionInput) => void;
		onClose: () => void;
	}>();
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
		<div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-lg p-6">
			<Typography variant="h4">Form Job Position</Typography>
			<Typography variant="body-sm" color="secondary" class="mt-2">
				Placeholder for form dialog.
			</Typography>
			<div class="mt-6 flex justify-end gap-3">
				<button
					class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg"
					onclick={onClose}
				>
					Batal
				</button>
			</div>
		</div>
	</div>
{/if}
