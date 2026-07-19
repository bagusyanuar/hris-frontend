<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AsyncCombobox from './AsyncCombobox.svelte';

  const { Story } = defineMeta({
    title: 'AsyncCombobox',
    tags: ['autodocs']
  });

  // Mock domain models
  interface StaffListModel {
    id: string;
    fullName: string;
    status: string;
  }

  const mockStaff: StaffListModel[] = Array.from({ length: 50 }, (_, i) => ({
    id: `staff-${i + 1}`,
    fullName: `Dr. Doctor ${i + 1}`,
    status: i % 10 === 0 ? 'inactive' : 'active'
  }));

  // Simulated paginated fetch function
  async function simulateFetch({ page, limit, q }: { page: number; limit: number; q: string }) {
    // Latency simulation
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filtered = mockStaff.filter((s) => s.fullName.toLowerCase().includes(q.toLowerCase()));
    const start = (page - 1) * limit;
    const end = start + limit;
    const items = filtered.slice(start, end);
    const hasNextPage = end < filtered.length;

    return { items, hasNextPage };
  }

  const mapFn = (staff: StaffListModel) => ({
    label: staff.fullName,
    value: staff.id
  });
</script>

<script lang="ts">
  import type { Option } from './Combobox.svelte';

  let selectedDoctor = $state<Option | undefined>(undefined);
  let selectedDoctors = $state<Option[]>([{ label: 'Dr. Doctor 1', value: 'staff-1' }]);
</script>

<Story name="Single Select">
  <div class="max-w-sm space-y-4">
    <AsyncCombobox
      fetchFn={simulateFetch}
      {mapFn}
      bind:value={selectedDoctor}
      label="Choose a Doctor"
      placeholder="Search doctor..."
      helperText="Start typing to search doctors with simulated API pagination."
    />
    <p class="text-sm text-slate-500">
      Selected: <strong class="text-slate-900"
        >{selectedDoctor ? JSON.stringify(selectedDoctor) : 'None'}</strong
      >
    </p>
  </div>
</Story>

<Story name="Multiple Select">
  <div class="max-w-sm space-y-4">
    <AsyncCombobox
      fetchFn={simulateFetch}
      {mapFn}
      bind:value={selectedDoctors}
      multiple
      label="Choose Doctors (Multiple)"
      placeholder="Search doctor..."
      helperText="Select multiple doctors with checkboxes and scroll-to-bottom pagination."
    />
    <p class="text-sm text-slate-500">
      Selected: <strong class="text-slate-900"
        >{selectedDoctors ? JSON.stringify(selectedDoctors) : 'None'}</strong
      >
    </p>
  </div>
</Story>
