import type {
  CreateDepartmentInput,
  DepartmentModel,
  DepartmentParams,
  IDepartmentRepository,
  UpdateDepartmentInput
} from '$lib/core/department';
import { NotFoundError } from '$lib/core/errors/app-error';
import { DepartmentMapper } from './department.mapper';
import type { DepartmentResponse } from './department.schema';

const MOCK_LATENCY_MS = 500;

// In-memory mock "database" simulating a backend API (snake_case payloads).
let mockDepartments: DepartmentResponse[] = [
  {
    id: 'DEPT001',
    code: 'IT-ENG',
    name: 'IT & Engineering',
    parent_id: null,
    description: 'Fokus pada pengembangan Core System v2.0 dan keamanan infrastruktur.',
    status: 'active',
    manager_name: 'Alice Nguyen',
    employee_count: 145
  },
  {
    id: 'DEPT002',
    code: 'IT-FE',
    name: 'Frontend Development',
    parent_id: 'DEPT001',
    description: 'Pengembangan antarmuka klien menggunakan Svelte dan React.',
    status: 'hiring',
    manager_name: 'David Kim',
    employee_count: 32
  },
  {
    id: 'DEPT003',
    code: 'IT-BE',
    name: 'Backend Systems',
    parent_id: 'DEPT001',
    description: 'Skalabilitas database dan integrasi API pihak ketiga.',
    status: 'restructuring',
    manager_name: 'Sarah Jones',
    employee_count: 48
  },
  {
    id: 'DEPT004',
    code: 'QA',
    name: 'Quality Assurance',
    parent_id: 'DEPT001',
    description: 'Memastikan rilis bebas bug dengan automasi Cypress.',
    status: 'planning',
    manager_name: 'Emily Davis',
    employee_count: 15
  },
  {
    id: 'DEPT005',
    code: 'HR',
    name: 'Human Resources',
    parent_id: null,
    description: 'Rekrutmen, pengembangan talenta, dan operasional karyawan.',
    status: 'inactive',
    manager_name: '',
    employee_count: 0
  },
  {
    id: 'DEPT006',
    code: 'FIN',
    name: 'Finance & Legal',
    parent_id: null,
    description: 'Perencanaan anggaran kuartalan dan kepatuhan pajak.',
    status: 'restructuring',
    manager_name: 'Michael Chen',
    employee_count: 68
  },
  {
    id: 'DEPT007',
    code: 'FIN-ACC',
    name: 'Accounting',
    parent_id: 'DEPT006',
    description: 'Pembukuan harian dan manajemen invoice vendor.',
    status: 'active',
    manager_name: 'Budi Santoso',
    employee_count: 12
  },
  {
    id: 'DEPT008',
    code: 'MKT-CRT',
    name: 'Marketing & Creative',
    parent_id: null,
    description: 'Strategi pemasaran digital dan produksi aset kreatif.',
    status: 'hiring',
    manager_name: 'Anisa Larasati',
    employee_count: 82
  },
  {
    id: 'DEPT009',
    code: 'SLS',
    name: 'Sales & Expansion',
    parent_id: null,
    description: 'Membuka pasar baru di kawasan Asia Tenggara.',
    status: 'growing',
    manager_name: 'Jessica Brown',
    employee_count: 165
  }
];

let nextId = mockDepartments.length + 1;

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_LATENCY_MS));
}

export class DepartmentRepositoryMock implements IDepartmentRepository {
  async getAll(params?: DepartmentParams): Promise<DepartmentModel[]> {
    let result = mockDepartments;

    if (params?.search) {
      const keyword = params.search.toLowerCase();
      result = result.filter(
        (department) =>
          department.name.toLowerCase().includes(keyword) ||
          department.code.toLowerCase().includes(keyword)
      );
    }

    if (params?.status && params.status !== 'all') {
      result = result.filter((department) => department.status === params.status);
    }

    return await delay(DepartmentMapper.toDomainList(result));
  }

  async getById(id: string): Promise<DepartmentModel> {
    const found = mockDepartments.find((department) => department.id === id);
    if (!found) {
      throw new NotFoundError(`Department with id "${id}" was not found`);
    }
    return await delay(DepartmentMapper.toDomain(found));
  }

  async create(input: CreateDepartmentInput): Promise<DepartmentModel> {
    const request = DepartmentMapper.toRequest(input);
    const created: DepartmentResponse = {
      id: `DEPT${String(nextId++).padStart(3, '0')}`,
      ...request
    };
    mockDepartments = [...mockDepartments, created];
    return await delay(DepartmentMapper.toDomain(created));
  }

  async update(input: UpdateDepartmentInput): Promise<DepartmentModel> {
    const index = mockDepartments.findIndex((department) => department.id === input.id);
    if (index === -1) {
      throw new NotFoundError(`Department with id "${input.id}" was not found`);
    }

    const request = DepartmentMapper.toRequest(input);
    const updated: DepartmentResponse = { id: input.id, ...request };
    mockDepartments = [
      ...mockDepartments.slice(0, index),
      updated,
      ...mockDepartments.slice(index + 1)
    ];
    return await delay(DepartmentMapper.toDomain(updated));
  }

  async delete(id: string): Promise<void> {
    mockDepartments = mockDepartments.filter((department) => department.id !== id);
    await delay(undefined);
  }
}
