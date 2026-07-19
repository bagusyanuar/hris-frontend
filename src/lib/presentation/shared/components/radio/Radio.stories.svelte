<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Radio from './Radio.svelte';

  const { Story } = defineMeta({
    title: 'Radio',
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  let selectedValue = $state('option1');
</script>

<Story name="Default Group">
  <div class="flex flex-col gap-4">
    <Radio
      bind:group={selectedValue}
      value="option1"
      label="Option One"
      description="This is the primary option."
    />
    <Radio
      bind:group={selectedValue}
      value="option2"
      label="Option Two"
      description="Choose this for secondary features."
    />
    <Radio
      bind:group={selectedValue}
      value="option3"
      label="Option Three"
      description="This is an alternative option."
    />
  </div>
</Story>

<Story name="With Validation Error">
  <div class="flex flex-col gap-4">
    <Radio
      bind:group={selectedValue}
      value="option1"
      label="Option One"
      error="Please select a different option."
    />
  </div>
</Story>

<Story name="Disabled">
  <div class="flex flex-col gap-4">
    <Radio bind:group={selectedValue} value="option1" label="Disabled Unchecked" disabled />
    <Radio group="option2" value="option2" label="Disabled Checked" disabled />
  </div>
</Story>
