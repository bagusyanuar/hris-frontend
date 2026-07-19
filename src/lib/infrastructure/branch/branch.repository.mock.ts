import type {
  IBranchRepository,
  BranchModel,
  CreateBranchInput,
  UpdateBranchInput,
  BranchParams
} from '$lib/core/branch';
import type { PaginatedResult } from '$lib/core/shared';

const mockData: BranchModel[] = [
  {
    id: 'B01',
    code: 'HQ',
    name: 'PT. Pusat Jakarta',
    address: 'Jl. Jenderal Sudirman No. 1, Jakarta Pusat',
    phone: '021-123456',
    status: 'active'
  },
  {
    id: 'B02',
    code: 'BDG',
    name: 'PT. Cabang Bandung',
    address: 'Jl. Asia Afrika No. 10, Bandung',
    phone: '022-654321',
    status: 'active'
  },
  {
    id: 'B03',
    code: 'SUB',
    name: 'PT. Cabang Surabaya',
    address: 'Jl. Tunjungan No. 50, Surabaya',
    phone: '031-789012',
    status: 'active'
  }
];

export class BranchRepositoryMock implements IBranchRepository {
  async getAll(params: BranchParams): Promise<PaginatedResult<BranchModel>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = [...mockData];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      filtered = filtered.filter((d) => d.status === params.status);
    }
    return {
      items: filtered,
      page: params.page || 1,
      perPage: params.limit || 10,
      total: filtered.length
    };
  }

  async getById(id: string): Promise<BranchModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockData.find((d) => d.id === id) || null;
  }

  async create(input: CreateBranchInput): Promise<BranchModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newModel: BranchModel = {
      ...input,
      id: 'B' + Math.random().toString().substr(2, 4),
      createdAt: new Date().toISOString()
    };
    mockData.push(newModel);
    return newModel;
  }

  async update(input: UpdateBranchInput): Promise<BranchModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockData.findIndex((d) => d.id === input.id);
    if (index === -1) throw new Error('Not found');
    mockData[index] = { ...mockData[index], ...input, updatedAt: new Date().toISOString() };
    return mockData[index];
  }

  async delete(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockData.findIndex((d) => d.id === id);
    if (index === -1) return false;
    mockData.splice(index, 1);
    return true;
  }
}
