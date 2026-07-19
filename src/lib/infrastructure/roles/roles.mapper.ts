import type { RoleModel, CreateRoleInput, UpdateRoleInput, RoleParams } from '$lib/core/roles';
import type { RoleResponse, RoleQuery, CreateRoleRequest, UpdateRoleRequest } from './roles.schema';
import { PaginationMapper } from '$lib/infrastructure/http/pagination.mapper';

export class RolesMapper {
  static toModel(response: RoleResponse): RoleModel {
    return {
      id: response.id,
      name: response.name,
      description: response.description,
      permissions: response.permissions,
      createdAt: response.created_at,
      updatedAt: response.updated_at
    };
  }

  static toQuery(params: RoleParams): RoleQuery {
    return {
      ...PaginationMapper.toQuery(params),
      ...(params.search && { search: params.search })
    };
  }

  static toCreateRequest(input: CreateRoleInput): CreateRoleRequest {
    return {
      name: input.name,
      description: input.description ?? undefined,
      permissions: input.permissions
    };
  }

  static toUpdateRequest(input: UpdateRoleInput): UpdateRoleRequest {
    return this.toCreateRequest(input);
  }
}
