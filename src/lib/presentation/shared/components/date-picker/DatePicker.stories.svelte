<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import DatePicker from './DatePicker.svelte';

	const { Story } = defineMeta({
		title: 'DatePicker',
		tags: ['autodocs']
	});
</script>

<script lang="ts">
	import { today, getLocalTimeZone, type DateValue } from '@internationalized/date';
	
	let selectedDate = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let emptyDate = $state<DateValue | undefined>(undefined);
	let errorDate = $state<DateValue | undefined>(undefined);
	let isoDate = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let longDate = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let limitedDate = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let monthValue = $state<DateValue | undefined>(today(getLocalTimeZone()));
	let yearValue = $state<DateValue | undefined>(today(getLocalTimeZone()));

	const minLimit = today(getLocalTimeZone()).subtract({ days: 7 });
	const maxLimit = today(getLocalTimeZone()).add({ days: 7 });

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
		<DatePicker
			bind:value={selectedDate}
			label="Birth Date"
			helperText="Please select your date of birth as stated in your official ID."
		/>
		<p class="text-sm text-slate-500">Selected Value: <strong class="text-slate-900">{selectedDate ? selectedDate.toString() : 'None'}</strong></p>
	</div>
</Story>

<Story name="Custom Formats">
	<div class="max-w-sm space-y-6">
		<DatePicker
			bind:value={isoDate}
			displayFormat={formatISO}
			label="ISO Format (yyyy-MM-dd)"
			helperText="Custom formatting using yyyy-MM-dd pattern."
		/>

		<DatePicker
			bind:value={longDate}
			displayFormat={formatLong}
			label="Long Date Format (d MMMM yyyy)"
			helperText="Custom formatting using long month name."
		/>
	</div>
</Story>

<Story name="Empty / Placeholder">
	<div class="max-w-sm space-y-4">
		<DatePicker
			bind:value={emptyDate}
			label="Target Date"
			placeholder="Pilih tanggal target..."
		/>
	</div>
</Story>

<Story name="With Validation Error">
	<div class="max-w-sm">
		<DatePicker
			bind:value={errorDate}
			label="Deadline Date"
			error="Tanggal tidak boleh di masa lalu."
		/>
	</div>
</Story>

<Story name="Disabled">
	<div class="max-w-sm">
		<DatePicker
			value={today(getLocalTimeZone())}
			disabled
			label="Disabled Date Picker"
		/>
	</div>
</Story>

<Story name="With Min and Max Limits">
	<div class="max-w-sm space-y-4">
		<DatePicker
			bind:value={limitedDate}
			minValue={minLimit}
			maxValue={maxLimit}
			label="Limited Date (H-7 to H+7)"
			helperText="Only dates between {minLimit.toString()} and {maxLimit.toString()} are selectable."
		/>
	</div>
</Story>

<Story name="Popover Alignments">
	<div class="max-w-sm space-y-6">
		<DatePicker
			align="start"
			label="Align Start (Default / Rata Kiri)"
		/>
		<DatePicker
			align="center"
			label="Align Center (Rata Tengah)"
		/>
		<DatePicker
			align="end"
			label="Align End (Rata Kanan)"
		/>
	</div>
</Story>

<Story name="Month Picker Mode">
	<div class="max-w-sm space-y-4">
		<DatePicker
			bind:value={monthValue}
			type="month"
			label="Month Selection"
			helperText="Select month and year only."
		/>
		<p class="text-sm text-slate-500">Selected Value: <strong class="text-slate-900">{monthValue ? monthValue.toString() : 'None'}</strong></p>
	</div>
</Story>

<Story name="Year Picker Mode">
	<div class="max-w-sm space-y-4">
		<DatePicker
			bind:value={yearValue}
			type="year"
			label="Year Selection"
			helperText="Select year only."
		/>
		<p class="text-sm text-slate-500">Selected Value: <strong class="text-slate-900">{yearValue ? yearValue.toString() : 'None'}</strong></p>
	</div>
</Story>
