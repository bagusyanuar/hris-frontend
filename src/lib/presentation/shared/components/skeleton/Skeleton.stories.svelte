<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SkeletonComponent from './Skeleton.svelte';

  const { Story } = defineMeta({
    title: 'Skeleton',
    component: SkeletonComponent,
    tags: ['autodocs']
  });
</script>

<script lang="ts">
  import Skeleton from './Skeleton.svelte';
</script>

<Story name="Default" asChild>
  <div class="space-y-8 p-6">
    <div>
      <h3 class="text-sm font-medium text-slate-500 mb-4">User Profile Skeleton</h3>
      <div class="flex items-center space-x-4">
        <Skeleton class="h-12 w-12 rounded-full" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-64" />
          <Skeleton class="h-4 w-48" />
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-slate-500 mb-4">Card Skeleton</h3>
      <div class="flex flex-col space-y-3">
        <Skeleton class="h-32 w-full max-w-sm rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-full max-w-sm" />
          <Skeleton class="h-4 w-3/4 max-w-sm" />
        </div>
      </div>
    </div>
  </div>
</Story>
