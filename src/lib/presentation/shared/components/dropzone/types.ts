import type { Snippet } from 'svelte';

export interface FileRejection {
	file: File;
	errors: { code: string; message: string }[];
}

export interface DropzoneState {
	isDragActive: boolean;
	open: () => void;
}

export interface DropzoneProps {
	files?: File[];
	showPreviewList?: boolean;
	accept?: string;
	multiple?: boolean;
	maxSize?: number;
	maxFiles?: number;
	disabled?: boolean;
	class?: string;
	ondrop?: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
	children?: Snippet<[DropzoneState]>;
}
