import type {
  IJobPositionRepository,
  JobPositionModel,
  CreateJobPositionInput,
  UpdateJobPositionInput,
  JobPositionParams
} from '$lib/core/job-position';
import type { PaginatedResult } from '$lib/core/shared';

const mockData: JobPositionModel[] = [
  {
    id: '1',
    name: 'Engineering Manager',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    jobTitleId: 'jt-1',
    jobTitleName: 'Manager',
    parentId: null,
    headcountQuota: 1,
    employeeCount: 1,
    status: 'active'
  },
  {
    id: '2',
    name: 'Frontend Developer',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    jobTitleId: 'jt-2',
    jobTitleName: 'Staff',
    parentId: '1',
    parentName: 'Engineering Manager',
    headcountQuota: 5,
    employeeCount: 2,
    status: 'active'
  },
  {
    id: '3',
    name: 'Backend Developer',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    jobTitleId: 'jt-3',
    jobTitleName: 'Senior',
    parentId: '1',
    parentName: 'Engineering Manager',
    headcountQuota: 10,
    employeeCount: 4,
    status: 'active'
  }
];

export class JobPositionRepositoryMock implements IJobPositionRepository {
  async getAll(params: JobPositionParams): Promise<PaginatedResult<JobPositionModel>> {
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

  async getById(id: string): Promise<JobPositionModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockData.find((d) => d.id === id) || null;
  }

  async create(input: CreateJobPositionInput): Promise<JobPositionModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newModel: JobPositionModel = {
      ...input,
      id: Math.random().toString(36).substring(7),
      departmentName: 'Mock Dept',
      jobTitleName: 'Mock Title',
      employeeCount: 0,
      createdAt: new Date().toISOString(),
    };
    mockData.push(newModel);
    return newModel;
  }

  async update(input: UpdateJobPositionInput): Promise<JobPositionModel> {
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
