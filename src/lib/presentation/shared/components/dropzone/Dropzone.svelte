<script lang="ts">
  import { cn } from '$lib/presentation/shared/utils/cn';
  import Icon from '@iconify/svelte';
  import { untrack, onDestroy } from 'svelte';
  import Dialog from '../dialog/Dialog.svelte';
  import type { DropzoneProps, FileRejection } from './types';

  let {
    files = $bindable([]),
    showPreviewList = true,
    accept,
    multiple = true,
    maxSize,
    maxFiles,
    disabled = false,
    class: className = '',
    ondrop,
    children
  }: DropzoneProps = $props();

  let isDragActive = $state(false);
  let fileInputRef = $state<HTMLInputElement | null>(null);
  let previewUrls = $state<Record<string, string>>({});
  let activePreviewFile = $state<File | null>(null);
  let isModalOpen = $state(false);
  let downloadUrl = $state<string>('');

  function isImageFile(file: File): boolean {
    if (file.type.startsWith('image/')) return true;
    const ext = file.name.split('.').pop()?.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp'].includes(ext || '');
  }

  interface FileConfig {
    icon: string;
    bgClass: string;
    textClass: string;
  }

  function getFileConfig(file: File): FileConfig {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (['xls', 'xlsx', 'csv'].includes(ext)) {
      return {
        icon: 'lucide:file-spreadsheet',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
        textClass: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    if (['doc', 'docx'].includes(ext)) {
      return {
        icon: 'lucide:file-text',
        bgClass: 'bg-blue-50 dark:bg-blue-950/20',
        textClass: 'text-blue-600 dark:text-blue-400'
      };
    }
    if (ext === 'pdf') {
      return {
        icon: 'lucide:file-text',
        bgClass: 'bg-rose-50 dark:bg-rose-950/20',
        textClass: 'text-rose-600 dark:text-rose-400'
      };
    }
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return {
        icon: 'lucide:file-archive',
        bgClass: 'bg-amber-50 dark:bg-amber-950/20',
        textClass: 'text-amber-600 dark:text-amber-400'
      };
    }
    if (['mp3', 'wav', 'ogg'].includes(ext)) {
      return {
        icon: 'lucide:file-audio',
        bgClass: 'bg-indigo-50 dark:bg-indigo-950/20',
        textClass: 'text-indigo-600 dark:text-indigo-400'
      };
    }
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
      return {
        icon: 'lucide:file-video',
        bgClass: 'bg-purple-50 dark:bg-purple-950/20',
        textClass: 'text-purple-600 dark:text-purple-400'
      };
    }
    if (isImageFile(file)) {
      return {
        icon: 'lucide:file-image',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
        textClass: 'text-emerald-600 dark:text-emerald-400'
      };
    }
    return {
      icon: 'lucide:file-x',
      bgClass: 'bg-slate-100 dark:bg-slate-800',
      textClass: 'text-slate-400 dark:text-slate-500'
    };
  }

  function openPreview(file: File) {
    activePreviewFile = file;
    isModalOpen = true;
    downloadUrl = URL.createObjectURL(file);
  }

  function handleClosePreview() {
    activePreviewFile = null;
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      downloadUrl = '';
    }
  }

  function downloadFile() {
    if (downloadUrl && activePreviewFile) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = activePreviewFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Reactive preview URL generator using untrack to prevent infinite loops
  $effect(() => {
    const currentFiles = files;

    untrack(() => {
      const nextUrls: Record<string, string> = {};

      currentFiles.forEach((file) => {
        const key = file.name + '-' + file.size;
        if (isImageFile(file)) {
          if (previewUrls[key]) {
            nextUrls[key] = previewUrls[key];
          } else {
            nextUrls[key] = URL.createObjectURL(file);
          }
        }
      });

      Object.keys(previewUrls).forEach((key) => {
        if (!nextUrls[key]) {
          URL.revokeObjectURL(previewUrls[key]);
        }
      });

      previewUrls = nextUrls;
    });
  });

  onDestroy(() => {
    Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url));
  });

  function open() {
    if (!disabled && fileInputRef) {
      fileInputRef.click();
    }
  }

  function fileMatchesAccept(file: File, acceptString: string): boolean {
    const rules = acceptString.split(',').map((r) => r.trim().toLowerCase());
    if (rules.length === 0 || acceptString === '*') return true;

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return rules.some((rule) => {
      if (rule.startsWith('.')) {
        return fileName.endsWith(rule);
      }
      if (rule.endsWith('/*')) {
        const prefix = rule.slice(0, -1); // e.g. 'image/'
        return fileType.startsWith(prefix);
      }
      return fileType === rule;
    });
  }

  function validateFiles(fileList: FileList): { accepted: File[]; rejected: FileRejection[] } {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    const filesArray = Array.from(fileList);
    const currentFilesCount = files.length;
    const limit = !multiple ? 1 : (maxFiles ?? Infinity);

    filesArray.forEach((file) => {
      const errors: { code: string; message: string }[] = [];

      // 1. Check maxFiles limit
      if (currentFilesCount + accepted.length >= limit) {
        errors.push({
          code: 'too-many-files',
          message: 'Jumlah file melebihi batas yang ditentukan'
        });
      }

      // 2. Check accept rules
      if (accept && !fileMatchesAccept(file, accept)) {
        errors.push({ code: 'file-invalid-type', message: 'Format file tidak didukung' });
      }

      // 3. Check maxSize rule
      if (maxSize && file.size > maxSize) {
        const maxMb = (maxSize / (1024 * 1024)).toFixed(1);
        errors.push({
          code: 'file-too-large',
          message: `Ukuran file melebihi batas maksimal ${maxMb}MB`
        });
      }

      if (errors.length > 0) {
        rejected.push({ file, errors });
      } else {
        accepted.push(file);
      }
    });

    return { accepted, rejected };
  }

  function handleDragOver(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    isDragActive = true;
  }

  function handleDragLeave() {
    isDragActive = false;
  }

  function handleDrop(e: DragEvent) {
    if (disabled) return;
    e.preventDefault();
    isDragActive = false;

    if (e.dataTransfer?.files) {
      const { accepted, rejected } = validateFiles(e.dataTransfer.files);
      if (accepted.length > 0) {
        files = multiple ? [...files, ...accepted] : [accepted[0]];
      }
      ondrop?.(accepted, rejected);
    }
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const { accepted, rejected } = validateFiles(target.files);
      if (accepted.length > 0) {
        files = multiple ? [...files, ...accepted] : [accepted[0]];
      }
      ondrop?.(accepted, rejected);
      target.value = '';
    }
  }

  function removeFile(fileToRemove: File) {
    files = files.filter((f) => f !== fileToRemove);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  }
</script>

<div class="flex w-full flex-col gap-4">
  <div
    role="button"
    tabindex={disabled ? -1 : 0}
    class={cn(
      'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
      isDragActive
        ? 'border-brand-primary bg-brand-light/20 scale-[1.01]'
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-brand-primary/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/80',
      disabled
        ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900/20 border-slate-200'
        : 'cursor-pointer',
      className
    )}
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    onclick={open}
    onkeydown={handleKeyDown}
  >
    <input
      bind:this={fileInputRef}
      type="file"
      class="sr-only"
      {accept}
      {multiple}
      {disabled}
      onchange={handleFileSelect}
    />

    {#if children}
      {@render children({ isDragActive, open })}
    {:else}
      <div class="flex flex-col items-center justify-center gap-3">
        <div
          class={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300',
            isDragActive
              ? 'bg-brand-primary/10 text-brand-primary scale-110'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
          )}
        >
          <Icon icon="lucide:upload-cloud" class="h-6 w-6" />
        </div>

        <div class="flex flex-col gap-1">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
            Tarik dan lepas file di sini, atau <span
              class="text-brand-primary hover:text-brand-hover hover:underline transition-colors font-semibold"
              >pilih file</span
            >
          </p>
          <p class="text-xs text-slate-400 dark:text-slate-500">
            {#if accept}
              Mendukung format: {accept.replace(/\./g, '').toUpperCase()}
            {/if}
            {#if maxSize}
              {accept ? ' • ' : ''}Ukuran maks: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            {/if}
          </p>
        </div>
      </div>
    {/if}
  </div>

  <!-- Preview List -->
  {#if showPreviewList && files.length > 0}
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {#each files as file (file.name + '-' + file.size)}
        <div
          class="group relative flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all dark:border-slate-800 dark:bg-slate-900/50"
        >
          <!-- Thumbnail / Icon preview -->
          {#if isImageFile(file) && previewUrls[file.name + '-' + file.size]}
            <button
              type="button"
              onclick={() => openPreview(file)}
              class="group/thumb relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Klik untuk preview gambar"
            >
              <img
                src={previewUrls[file.name + '-' + file.size]}
                alt={file.name}
                class="h-full w-full object-cover transition-transform duration-300 group-hover/thumb:scale-110"
              />
              <div
                class="absolute inset-0 bg-slate-950/20 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center text-white"
              >
                <Icon icon="lucide:zoom-in" class="h-4 w-4" />
              </div>
            </button>
          {:else}
            {@const config = getFileConfig(file)}
            <button
              type="button"
              onclick={() => openPreview(file)}
              class={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer',
                config.bgClass,
                config.textClass
              )}
              title="Klik untuk detail berkas"
            >
              <Icon icon={config.icon} class="h-6 w-6" />
            </button>
          {/if}

          <!-- File Meta Info -->
          <div class="flex flex-1 flex-col min-w-0 pr-8">
            <span class="truncate text-xs font-semibold text-slate-700 dark:text-slate-200">
              {file.name}
            </span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>

          <!-- Delete Button -->
          <button
            type="button"
            onclick={(e) => {
              e.stopPropagation();
              removeFile(file);
            }}
            {disabled}
            class="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-slate-200 bg-white p-1.5 text-rose-500 transition-all hover:bg-rose-50 hover:scale-105 active:scale-95 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-rose-950/30 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            title="Hapus file"
          >
            <Icon icon="lucide:trash-2" class="h-4 w-4" />
          </button>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Fullscreen Preview Modal -->
  <Dialog
    bind:open={isModalOpen}
    title={activePreviewFile?.name}
    size="md"
    onclose={handleClosePreview}
  >
    {#if activePreviewFile}
      {#if isImageFile(activePreviewFile) && previewUrls[activePreviewFile.name + '-' + activePreviewFile.size]}
        <div
          class="flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl p-2 max-h-[60vh] overflow-hidden"
        >
          <img
            src={previewUrls[activePreviewFile.name + '-' + activePreviewFile.size]}
            alt={activePreviewFile.name}
            class="max-h-[55vh] max-w-full object-contain rounded-lg shadow-sm"
          />
        </div>
      {:else}
        {@const config = getFileConfig(activePreviewFile)}
        <div class="flex flex-col items-center justify-center p-6 text-center gap-4">
          <div
            class={cn(
              'h-16 w-16 rounded-full flex items-center justify-center scale-110',
              config.bgClass,
              config.textClass
            )}
          >
            <Icon icon={config.icon} class="h-8 w-8" />
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Pratinjau Tidak Tersedia
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              Format file <strong>{activePreviewFile.name.split('.').pop()?.toUpperCase()}</strong> tidak
              mendukung pratinjau langsung di browser.
            </p>
          </div>
          <!-- Download solution button -->
          {#if downloadUrl}
            <button
              type="button"
              onclick={downloadFile}
              class="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer mt-2"
            >
              <Icon icon="lucide:download" class="h-4 w-4" />
              Unduh Berkas
            </button>
          {/if}
        </div>
      {/if}
    {/if}
  </Dialog>
</div>
