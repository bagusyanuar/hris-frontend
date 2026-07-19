import type { JobTitleParams } from '$lib/core/job-title';

export const jobTitleKeys = {
  all: ['jobTitles'] as const,
  lists: () => [...jobTitleKeys.all, 'list'] as const,
  list: (params: JobTitleParams) => [...jobTitleKeys.lists(), params] as const,
  details: () => [...jobTitleKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobTitleKeys.details(), id] as const
};
