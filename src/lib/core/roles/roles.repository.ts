import type { PaginatedResult } from '$lib/core/shared';
import type { RoleModel, CreateRoleInput, UpdateRoleInput, RoleParams } from './roles.model';

export interface IRolesRepository {
  getAll(params: RoleParams): Promise<PaginatedResult<RoleModel>>;
  getById(id: string): Promise<RoleModel | null>;
  create(input: CreateRoleInput): Promise<RoleModel>;
  update(input: UpdateRoleInput): Promise<RoleModel>;
  delete(id: string): Promise<boolean>;
}
