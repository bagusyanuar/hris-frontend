import type {
  IJobTitleRepository,
  JobTitleModel,
  CreateJobTitleInput,
  UpdateJobTitleInput,
  JobTitleParams
} from '$lib/core/job-title';
import type { PaginatedResult } from '$lib/core/shared';

const mockData: JobTitleModel[] = [
  {
    id: '1',
    code: 'MGR',
    name: 'Manager',
    status: 'active'
  },
  {
    id: '2',
    code: 'STF',
    name: 'Staff',
    status: 'active'
  }
];

export class JobTitleRepositoryMock implements IJobTitleRepository {
  async getAll(params: JobTitleParams): Promise<PaginatedResult<JobTitleModel>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = [...mockData];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
    }
    return {
      items: filtered,
      page: params.page || 1,
      perPage: params.limit || 10,
      total: filtered.length
    };
  }

  async getById(id: string): Promise<JobTitleModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockData.find((d) => d.id === id) || null;
  }

  async create(input: CreateJobTitleInput): Promise<JobTitleModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newModel: JobTitleModel = {
      ...input,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    mockData.push(newModel);
    return newModel;
  }

  async update(input: UpdateJobTitleInput): Promise<JobTitleModel> {
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
