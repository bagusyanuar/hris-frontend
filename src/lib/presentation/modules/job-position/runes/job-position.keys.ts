import type { JobPositionParams } from '$lib/core/job-position';

export const jobPositionKeys = {
	all: ['jobPositions'] as const,
	lists: () => [...jobPositionKeys.all, 'list'] as const,
	list: (params: JobPositionParams) => [...jobPositionKeys.lists(), params] as const,
	details: () => [...jobPositionKeys.all, 'detail'] as const,
	detail: (id: string) => [...jobPositionKeys.details(), id] as const
};
