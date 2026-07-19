<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Dropzone from './Dropzone.svelte';
  import { fn } from 'storybook/test';
  import Icon from '@iconify/svelte';

  const { Story } = defineMeta({
    title: 'Dropzone',
    component: Dropzone,
    tags: ['autodocs'],
    argTypes: {
      accept: { control: 'text' },
      multiple: { control: 'boolean' },
      maxSize: { control: 'number' },
      maxFiles: { control: 'number' },
      disabled: { control: 'boolean' },
      showPreviewList: { control: 'boolean' }
    },
    args: {
      ondrop: fn()
    }
  });
</script>

<script lang="ts">
  import type { FileRejection } from './types';

  let defaultFiles = $state<File[]>([]);
  let imageFiles = $state<File[]>([]);
  let singleFile = $state<File[]>([]);
  let customFiles = $state<File[]>([]);

  let rejectedFilesList = $state<FileRejection[]>([]);

  function handleDrop(accepted: File[], rejected: FileRejection[]) {
    rejectedFilesList = rejected;
  }

  function clearRejections() {
    rejectedFilesList = [];
  }
</script>

<Story name="Default">
  <div class="flex flex-col gap-4 max-w-xl">
    <Dropzone bind:files={defaultFiles} ondrop={handleDrop} />

    {#if rejectedFilesList.length > 0}
      <div
        class="rounded-xl border border-rose-100 bg-rose-50/50 p-4 dark:border-rose-950/30 dark:bg-rose-950/10 flex flex-col gap-2"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-rose-600 dark:text-rose-400">File Gagal Upload:</span>
          <button
            onclick={clearRejections}
            class="text-xs text-rose-600 hover:underline font-medium">Clear</button
          >
        </div>
        <ul class="text-xs list-disc pl-4 text-slate-600 dark:text-slate-400">
          {#each rejectedFilesList as rejection, i (rejection.file.name + '-' + i)}
            <li>
              {rejection.file.name} -
              {#each rejection.errors as err, j (err.code + '-' + j)}
                <span class="text-rose-500 font-medium">[{err.message}]</span>
              {/each}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</Story>

<Story name="Images Only" args={{ accept: 'image/*' }}>
  <div class="max-w-xl">
    <Dropzone accept="image/*" bind:files={imageFiles} />
  </div>
</Story>

<Story name="Single File with Max Size" args={{ multiple: false, maxSize: 1024 * 1024 * 2 }}>
  <div class="max-w-xl flex flex-col gap-2">
    <Dropzone multiple={false} maxSize={1024 * 1024 * 2} bind:files={singleFile} />
    <p class="text-xs text-slate-400">Maksimal 1 file dan ukuran maksimal 2MB.</p>
  </div>
</Story>

<Story name="Disabled" args={{ disabled: true }}>
  <div class="max-w-xl">
    <Dropzone disabled={true} />
  </div>
</Story>

<Story name="Custom Template & Hidden Default Previews">
  <div class="max-w-xl flex flex-col gap-4">
    <Dropzone bind:files={customFiles} showPreviewList={false}>
      {#snippet children({ isDragActive })}
        <div class="flex flex-col items-center justify-center gap-3 py-4">
          <div class="rounded-full bg-brand-light p-3 text-brand-primary">
            <Icon icon="lucide:file-text" class="h-8 w-8" />
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isDragActive ? 'Lepaskan di sini!' : 'Unggah berkas dokumen Anda'}
            </p>
            <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Custom layout (Default preview list disembunyikan)
            </p>
          </div>
        </div>
      {/snippet}
    </Dropzone>

    {#if customFiles.length > 0}
      <div class="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50">
        <h4 class="text-xs font-bold text-slate-500 mb-2">
          Custom Render List ({customFiles.length} file):
        </h4>
        <div class="flex flex-wrap gap-2">
          {#each customFiles as file, index (file.name + '-' + index)}
            <div
              class="px-3 py-1.5 bg-brand-primary text-white rounded-full text-xs flex items-center gap-1.5"
            >
              <span>{file.name}</span>
              <button
                onclick={() => (customFiles = customFiles.filter((f) => f !== file))}
                class="hover:text-red-200 transition-colors"
              >
                <Icon icon="lucide:x" class="h-3.5 w-3.5" />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</Story>
