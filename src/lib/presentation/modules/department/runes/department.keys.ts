import type { DepartmentParams } from '$lib/core/department';

export const departmentKeys = {
  all: ['department'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params?: DepartmentParams) => [...departmentKeys.lists(), params ?? {}] as const
};
