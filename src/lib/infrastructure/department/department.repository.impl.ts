import type {
  CreateDepartmentInput,
  DepartmentModel,
  DepartmentParams,
  IDepartmentRepository,
  UpdateDepartmentInput
} from '$lib/core/department';
import { DepartmentMapper } from './department.mapper';
import type { DepartmentResponse } from './department.schema';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class DepartmentRepositoryImpl implements IDepartmentRepository {
  private readonly basePath = '/v1/departments';

  async getAll(params?: DepartmentParams): Promise<DepartmentModel[]> {
    return handleAppError(async () => {
      const query = DepartmentMapper.toQuery(params);
      const response = await httpClient.get<ApiResponse<DepartmentResponse[]>>(this.basePath, {
        params: query
      });
      return DepartmentMapper.toDomainList(response.data);
    });
  }

  async getById(id: string): Promise<DepartmentModel> {
    return handleAppError(async () => {
      const response = await httpClient.get<ApiResponse<DepartmentResponse>>(
        `${this.basePath}/${id}`
      );
      return DepartmentMapper.toDomain(response.data);
    });
  }

  async create(input: CreateDepartmentInput): Promise<DepartmentModel> {
    return handleAppError(async () => {
      const payload = DepartmentMapper.toRequest(input);
      const response = await httpClient.post<ApiResponse<DepartmentResponse>>(
        this.basePath,
        payload
      );
      return DepartmentMapper.toDomain(response.data);
    });
  }

  async update(input: UpdateDepartmentInput): Promise<DepartmentModel> {
    return handleAppError(async () => {
      const payload = DepartmentMapper.toRequest(input);
      const response = await httpClient.put<ApiResponse<DepartmentResponse>>(
        `${this.basePath}/${input.id}`,
        payload
      );
      return DepartmentMapper.toDomain(response.data);
    });
  }

  async delete(id: string): Promise<void> {
    return handleAppError(async () => {
      await httpClient.delete(`${this.basePath}/${id}`);
    });
  }
}
