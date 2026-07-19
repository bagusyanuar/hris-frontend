import type {
  IRolesRepository,
  RoleModel,
  CreateRoleInput,
  UpdateRoleInput,
  RoleParams
} from '$lib/core/roles';
import type { PaginatedResult } from '$lib/core/shared';

const mockData: RoleModel[] = [
  {
    id: '1',
    name: 'Super Administrator',
    description: 'Akses penuh ke seluruh sistem dan konfigurasi.',
    permissions: [
      'employee:read',
      'employee:create',
      'employee:update',
      'employee:delete',
      'attendance:read',
      'attendance:update',
      'branch:read',
      'branch:create',
      'branch:update',
      'branch:delete',
      'department:read',
      'department:create',
      'department:update',
      'department:delete',
      'job-title:read',
      'job-title:create',
      'job-title:update',
      'job-title:delete',
      'job-position:read',
      'job-position:create',
      'job-position:update',
      'job-position:delete',
      'payroll:read',
      'payroll:create',
      'payroll:update',
      'payroll:delete',
      'payroll:run',
      'payslip:read',
      'payslip:create',
      'expense:read',
      'expense:create',
      'expense:update',
      'expense:delete',
      'user:read',
      'user:create',
      'user:update',
      'user:delete',
      'role:read',
      'role:create',
      'role:update',
      'role:delete'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'HR Manager',
    description: 'Mengelola direktori karyawan, absensi, dan struktur organisasi.',
    permissions: [
      'employee:read',
      'employee:create',
      'employee:update',
      'attendance:read',
      'attendance:update',
      'branch:read',
      'department:read',
      'department:create',
      'department:update',
      'job-title:read',
      'job-title:create',
      'job-title:update',
      'job-position:read',
      'job-position:create',
      'job-position:update'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Finance Specialist',
    description: 'Mengelola keuangan, payroll, dan klaim pengeluaran.',
    permissions: [
      'payroll:read',
      'payroll:create',
      'payroll:update',
      'payroll:run',
      'payslip:read',
      'payslip:create',
      'expense:read',
      'expense:create',
      'expense:update'
    ],
    createdAt: new Date().toISOString()
  }
];

export class RolesRepositoryMock implements IRolesRepository {
  async getAll(params: RoleParams): Promise<PaginatedResult<RoleModel>> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let filtered = [...mockData];
    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.description && d.description.toLowerCase().includes(q))
      );
    }
    return {
      items: filtered,
      page: params.page || 1,
      perPage: params.limit || 10,
      total: filtered.length
    };
  }

  async getById(id: string): Promise<RoleModel | null> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockData.find((d) => d.id === id) || null;
  }

  async create(input: CreateRoleInput): Promise<RoleModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newModel: RoleModel = {
      ...input,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    mockData.push(newModel);
    return newModel;
  }

  async update(input: UpdateRoleInput): Promise<RoleModel> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockData.findIndex((d) => d.id === input.id);
    if (index === -1) throw new Error('Not found');
    mockData[index] = {
      ...mockData[index],
      ...input,
      updatedAt: new Date().toISOString()
    };
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
