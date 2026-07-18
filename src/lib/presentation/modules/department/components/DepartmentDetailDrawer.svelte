<script lang="ts">
	import { Drawer } from '$lib/presentation/shared/components/drawer';
	import { Avatar } from '$lib/presentation/shared/components/avatar';
	import { Typography } from '$lib/presentation/shared/components/typography';
	import { Badge } from '$lib/presentation/shared/components/badge';
	import { Button } from '$lib/presentation/shared/components/button';
	import Icon from '@iconify/svelte';
	import type { DepartmentModel } from '$lib/core/department';

	interface Props {
		isOpen: boolean;
		onClose: () => void;
		department: DepartmentModel | null;
	}

	let { isOpen, onClose, department }: Props = $props();
</script>

<Drawer {isOpen} {onClose} position="right">
	{#snippet header()}
		<div>
			<h2 class="text-lg font-semibold text-brand-primary flex items-center gap-2">
				<Icon icon="lucide:building-2" class="w-5 h-5" />
				Detail Departemen
			</h2>
			<p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
				Informasi lengkap dan struktur departemen
			</p>
		</div>
	{/snippet}

	{#snippet footer()}
		{#if department}
			<div class="flex flex-col gap-4 w-full">
				<div class="flex justify-end gap-3 w-full">
					<Button
						variant="outline"
						class="flex-1 sm:flex-none text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50"
					>
						<Icon icon="lucide:trash-2" class="w-4 h-4" />
						Hapus
					</Button>
					<Button variant="primary" class="flex-1 sm:flex-none">
						<Icon icon="lucide:pencil" class="w-4 h-4" />
						Edit
					</Button>
				</div>

				{#if department.createdAt || department.updatedAt}
					<div
						class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3"
					>
						{#if department.createdAt}
							<div class="flex items-center gap-1.5">
								<Icon icon="lucide:calendar-plus" class="w-3.5 h-3.5" />
								Dibuat: {new Date(department.createdAt).toLocaleDateString('id-ID')}
							</div>
						{/if}
						{#if department.updatedAt}
							<div class="flex items-center gap-1.5">
								<Icon icon="lucide:calendar-clock" class="w-3.5 h-3.5" />
								Diubah: {new Date(department.updatedAt).toLocaleDateString('id-ID')}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	{/snippet}

	{#if department}
		<div class="flex flex-col gap-6">
			<!-- Header Card -->
			<div
				class="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4"
			>
				<div class="flex items-start justify-between">
					<div>
						<Typography variant="h4" weight="semibold" class="mb-1">{department.name}</Typography>
						<div class="flex flex-wrap items-center gap-2 text-slate-500 text-sm mt-1">
							<div class="flex items-center gap-1.5">
								<Icon icon="lucide:hash" class="w-4 h-4" />
								{department.code}
							</div>
							{#if department.parentName}
								<span class="text-slate-300 dark:text-slate-700">•</span>
								<div class="flex items-center gap-1.5">
									<Icon icon="lucide:git-merge" class="w-4 h-4" />
									{department.parentName}
								</div>
							{/if}
						</div>
					</div>
					<div
						class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
							department.status === 'active'
								? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
								: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
						}`}
					>
						{department.status === 'active' ? 'Aktif' : 'Nonaktif'}
					</div>
				</div>
				<p class="mt-4 text-sm text-slate-600 dark:text-slate-400">
					{department.description || 'Tidak ada deskripsi.'}
				</p>
			</div>

			<hr class="border-slate-200 dark:border-slate-800" />

			<!-- Manager Info -->
			<div>
				<Typography variant="h6" weight="semibold" class="mb-3" color="brand">Kepala Departemen</Typography>
				<div class="flex items-center gap-4">
					<Avatar name={department.managerName} size="lg" variant="primary" />
					<div>
						<Typography variant="body-sm" weight="medium"
							>{department.managerName || 'Belum Ditentukan'}</Typography
						>
						<Typography variant="caption" class="text-slate-500">Manajer</Typography>
					</div>
				</div>
			</div>

			<hr class="border-slate-200 dark:border-slate-800" />

			<!-- Stats -->
			<div>
				<Typography variant="h6" weight="semibold" class="mb-3" color="brand">Ringkasan</Typography>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-center">
						<div class="flex items-center gap-2 mb-1.5">
							<Icon icon="lucide:users" class="w-4 h-4 text-brand-primary" />
							<Typography variant="caption" class="text-slate-500">Total Karyawan</Typography>
						</div>
						<Typography variant="h4" weight="bold">{department.employeeCount || 0}</Typography>
					</div>
					<div class="rounded-xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-center">
						<div class="flex items-center gap-2 mb-1.5">
							<Icon icon="lucide:network" class="w-4 h-4 text-indigo-500" />
							<Typography variant="caption" class="text-slate-500">Sub-departemen</Typography>
						</div>
						<Typography variant="h4" weight="bold">{department.children?.length || 0}</Typography>
					</div>
				</div>
			</div>

			{#if department.children && department.children.length > 0}
				<hr class="border-slate-200 dark:border-slate-800" />
				<div>
					<Typography variant="h6" weight="semibold" class="mb-3" color="brand">Daftar Sub-departemen</Typography>
					<div class="flex flex-wrap gap-2">
						{#each department.children as child (child.id)}
							<Badge variant="default">
								{child.name}
							</Badge>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</Drawer>
