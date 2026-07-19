import type {
  IRolesRepository,
  RoleModel,
  CreateRoleInput,
  UpdateRoleInput,
  RoleParams
} from '$lib/core/roles';
import type { PaginatedResult } from '$lib/core/shared';
import type { RoleResponse, RoleListResponse } from './roles.schema';
import { RolesMapper } from './roles.mapper';
import { httpClient } from '$lib/infrastructure/http/client';
import { handleAppError } from '$lib/infrastructure/http/error.mapper';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';
import type { ApiResponse } from '$lib/infrastructure/http/types';

export class RolesRepositoryImpl implements IRolesRepository {
  private readonly basePath = '/v1/roles';

  async getAll(params: RoleParams): Promise<PaginatedResult<RoleModel>> {
    return handleAppError(async () => {
      const query = RolesMapper.toQuery(params);
      const response = await httpClient.get<RoleListResponse>(this.basePath, { params: query });
      return PaginationMapper.toResult(response, RolesMapper.toModel);
    });
  }

  async getById(id: string): Promise<RoleModel | null> {
    return handleAppError(async () => {
      const response = await httpClient.get<ApiResponse<RoleResponse>>(`${this.basePath}/${id}`);
      return RolesMapper.toModel(response.data);
    });
  }

  async create(input: CreateRoleInput): Promise<RoleModel> {
    return handleAppError(async () => {
      const request = RolesMapper.toCreateRequest(input);
      const response = await httpClient.post<ApiResponse<RoleResponse>>(this.basePath, request);
      return RolesMapper.toModel(response.data);
    });
  }

  async update(input: UpdateRoleInput): Promise<RoleModel> {
    return handleAppError(async () => {
      const request = RolesMapper.toUpdateRequest(input);
      const response = await httpClient.put<ApiResponse<RoleResponse>>(
        `${this.basePath}/${input.id}`,
        request
      );
      return RolesMapper.toModel(response.data);
    });
  }

  async delete(id: string): Promise<boolean> {
    return handleAppError(async () => {
      await httpClient.delete(`${this.basePath}/${id}`);
      return true;
    });
  }
}
