import type { BranchModel, UpdateBranchInput } from './branch.model';

export class BranchService {
  static toInput(model: BranchModel): UpdateBranchInput {
    return {
      id: model.id,
      companyId: model.companyId,
      code: model.code,
      name: model.name,
      city: model.city,
      isMain: model.isMain,
      isActive: model.isActive
    };
  }

  static getStats(branches: BranchModel[]) {
    const total = branches.length;
    const active = branches.filter((b) => b.isActive).length;
    const inactive = total - active;
    const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);

    return {
      total,
      active,
      inactive,
      activePercentage
    };
  }

  static filter(
    branches: BranchModel[],
    filters: { search: string; isActive: 'all' | boolean }
  ): BranchModel[] {
    return branches.filter((branch) => {
      const matchSearch =
        !filters.search ||
        branch.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        branch.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        (branch.city && branch.city.toLowerCase().includes(filters.search.toLowerCase()));

      const matchStatus = filters.isActive === 'all' || branch.isActive === filters.isActive;

      return !!(matchSearch && matchStatus);
    });
  }
}
