import type {
  IBranchRepository,
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from '$lib/core/branch';
import type { PaginatedResult } from '$lib/core/shared';

export const mockBranches: BranchModel[] = [
  {
    id: 'br-1',
    companyId: 'co-1',
    code: 'JKT',
    name: 'Kantor Pusat Jakarta',
    city: 'Jakarta',
    isMain: true,
    isActive: true
  },
  {
    id: 'br-2',
    companyId: 'co-1',
    code: 'SBY',
    name: 'Cabang Surabaya',
    city: 'Surabaya',
    isMain: false,
    isActive: true
  },
  {
    id: 'br-3',
    companyId: 'co-2',
    code: 'BDG',
    name: 'Kantor Pusat Bandung',
    city: 'Bandung',
    isMain: true,
    isActive: true
  }
];

export class BranchRepositoryMock implements IBranchRepository {
  async getAll(params: BranchParams & { companyId?: string }): Promise<PaginatedResult<BranchModel>> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    let filtered = [...mockBranches];
    
    if (params.companyId) {
      filtered = filtered.filter((d) => d.companyId === params.companyId);
    }
    
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
      );
    }
    
    if (params.isActive !== undefined && params.isActive !== 'all') {
      filtered = filtered.filter((d) => d.isActive === params.isActive);
    }
    
    return {
      items: filtered,
      page: params.page || 1,
      perPage: params.limit || 10,
      total: filtered.length
    };
  }

  async getById(id: string): Promise<BranchModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockBranches.find((d) => d.id === id) || null;
  }

  async create(input: CreateBranchInput): Promise<BranchModel> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Auto-demote logic for main branch:
    if (input.isMain) {
      mockBranches.forEach((b) => {
        if (b.companyId === input.companyId) {
          b.isMain = false;
        }
      });
    }

    const newModel: BranchModel = {
      ...input,
      id: 'br-' + Math.random().toString().substring(2, 6),
      createdAt: new Date().toISOString()
    };
    mockBranches.push(newModel);
    return newModel;
  }

  async update(input: UpdateBranchInput): Promise<BranchModel> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockBranches.findIndex((d) => d.id === input.id);
    if (index === -1) throw new Error('Branch not found');

    // Auto-demote logic for main branch:
    if (input.isMain) {
      mockBranches.forEach((b) => {
        if (b.companyId === input.companyId && b.id !== input.id) {
          b.isMain = false;
        }
      });
    }

    mockBranches[index] = { ...mockBranches[index], ...input, updatedAt: new Date().toISOString() };
    return mockBranches[index];
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockBranches.findIndex((d) => d.id === id);
    if (index === -1) return false;
    mockBranches.splice(index, 1);
    return true;
  }
}
