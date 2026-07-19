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
    code: 'ENG',
    name: 'Engineering',
    parent_id: null,
    description: 'Product engineering division',
    status: 'active',
    manager_name: 'John Doe',
    employee_count: 42
  },
  {
    id: 'DEPT002',
    code: 'ENG-FE',
    name: 'Frontend',
    parent_id: 'DEPT001',
    description: 'Client-side application development',
    status: 'active',
    manager_name: 'Alice Smith',
    employee_count: 14
  },
  {
    id: 'DEPT003',
    code: 'ENG-BE',
    name: 'Backend',
    parent_id: 'DEPT001',
    description: 'Server-side & infrastructure development',
    status: 'active',
    manager_name: 'Bob Johnson',
    employee_count: 18
  },
  {
    id: 'DEPT004',
    code: 'ENG-QA',
    name: 'Quality Assurance',
    parent_id: 'DEPT001',
    description: 'Testing & release quality',
    status: 'active',
    manager_name: 'Eve Davis',
    employee_count: 10
  },
  {
    id: 'DEPT005',
    code: 'HR',
    name: 'Human Resources',
    parent_id: null,
    description: 'People operations & talent management',
    status: 'active',
    manager_name: 'Sarah Wilson',
    employee_count: 5
  },
  {
    id: 'DEPT006',
    code: 'FIN',
    name: 'Finance',
    parent_id: null,
    description: 'Financial planning & accounting',
    status: 'active',
    manager_name: 'Michael Brown',
    employee_count: 8
  },
  {
    id: 'DEPT007',
    code: 'FIN-ACC',
    name: 'Accounting',
    parent_id: 'DEPT006',
    description: 'Bookkeeping & tax compliance',
    status: 'active',
    manager_name: 'Lisa Taylor',
    employee_count: 4
  },
  {
    id: 'DEPT008',
    code: 'DES',
    name: 'Product Design',
    parent_id: null,
    description: 'UX/UI & product design',
    status: 'active',
    manager_name: 'David Lee',
    employee_count: 6
  },
  {
    id: 'DEPT009',
    code: 'MKT',
    name: 'Marketing',
    parent_id: null,
    description: 'Brand & growth marketing',
    status: 'inactive',
    manager_name: 'Emma White',
    employee_count: 0
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
