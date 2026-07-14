<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DateRangePicker from './DateRangePicker.svelte';

	const { Story } = defineMeta({
		title: 'DateRangePicker',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { today, getLocalTimeZone, type DateValue } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';

	const t = today(getLocalTimeZone());
	
	let selectedRange = $state<DateRange>({
		start: t,
		end: t.add({ days: 7 })
	});

	let emptyRange = $state<DateRange>({
		start: undefined,
		end: undefined
	});

	let errorRange = $state<DateRange>({
		start: undefined,
		end: undefined
	});

	let isoRange = $state<DateRange>({
		start: t,
		end: t.add({ days: 14 })
	});

	let longRange = $state<DateRange>({
		start: t,
		end: t.add({ days: 5 })
	});

	let limitedRange = $state<DateRange>({
		start: undefined,
		end: undefined
	});

	const minLimit = t.subtract({ days: 7 });
	const maxLimit = t.add({ days: 14 });

	// Custom format: yyyy-MM-dd
	const formatISO = (date: DateValue) => {
		const month = String(date.month).padStart(2, '0');
		const day = String(date.day).padStart(2, '0');
		return `${date.year}-${month}-${day}`;
	};

	// Custom format: 14 July 2026
	const formatLong = (date: DateValue) => {
		const months = [
			'January', 'February', 'March', 'April', 'May', 'June',
			'July', 'August', 'September', 'October', 'November', 'December'
		];
		return `${date.day} ${months[date.month - 1]} ${date.year}`;
	};
</script>

<Story name="Default">
	<div class="max-w-sm space-y-4">
		<DateRangePicker
			bind:value={selectedRange}
			label="Leave Period"
			helperText="Choose the start date and end date for your annual leave."
		/>
		<p class="text-sm text-slate-500">
			Selected Range: 
			<strong class="text-slate-900">
				{#if selectedRange?.start && selectedRange?.end}
					{selectedRange.start.toString()} to {selectedRange.end.toString()}
				{:else if selectedRange?.start}
					{selectedRange.start.toString()} to ...
				{:else}
					None
				{/if}
			</strong>
		</p>
	</div>
</Story>

<Story name="Custom Formats">
	<div class="max-w-sm space-y-6">
		<DateRangePicker
			bind:value={isoRange}
			displayFormat={formatISO}
			label="ISO Format (yyyy-MM-dd)"
			helperText="Custom formatting range using yyyy-MM-dd pattern."
		/>

		<DateRangePicker
			bind:value={longRange}
			displayFormat={formatLong}
			label="Long Date Format (d MMMM yyyy)"
			helperText="Custom formatting range using long month names."
		/>
	</div>
</Story>

<Story name="Empty / Placeholder">
	<div class="max-w-sm space-y-4">
		<DateRangePicker
			bind:value={emptyRange}
			label="Filter Period"
			placeholder="Pilih rentang tanggal filter..."
		/>
	</div>
</Story>

<Story name="With Validation Error">
	<div class="max-w-sm">
		<DateRangePicker
			bind:value={errorRange}
			label="Campaign Duration"
			error="Rentang waktu promosi tidak valid."
		/>
	</div>
</Story>

<Story name="Disabled">
	<div class="max-w-sm">
		<DateRangePicker
			value={{ start: t, end: t.add({ days: 3 }) }}
			disabled
			label="Disabled Range Picker"
		/>
	</div>
</Story>

<Story name="With Min and Max Limits">
	<div class="max-w-sm space-y-4">
		<DateRangePicker
			bind:value={limitedRange}
			minValue={minLimit}
			maxValue={maxLimit}
			label="Limited Leave Period (H-7 to H+14)"
			helperText="Only dates between {minLimit.toString()} and {maxLimit.toString()} are selectable."
		/>
	</div>
</Story>
