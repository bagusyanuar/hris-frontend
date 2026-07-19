import type { BranchModel, UpdateBranchInput } from './branch.model';

export class BranchService {
  static toInput(model: BranchModel): UpdateBranchInput {
    return {
      id: model.id,
      code: model.code,
      name: model.name,
      address: model.address,
      phone: model.phone,
      status: model.status
    };
  }

  static getStats(branches: BranchModel[]) {
    const total = branches.length;
    const active = branches.filter((b) => b.status === 'active').length;
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
    filters: { search: string; status: 'all' | 'active' | 'inactive' }
  ): BranchModel[] {
    return branches.filter((branch) => {
      const matchSearch =
        !filters.search ||
        branch.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        branch.code.toLowerCase().includes(filters.search.toLowerCase()) ||
        (branch.address && branch.address.toLowerCase().includes(filters.search.toLowerCase()));

      const matchStatus = filters.status === 'all' || branch.status === filters.status;

      return !!(matchSearch && matchStatus);
    });
  }
}
