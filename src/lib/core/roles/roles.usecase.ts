import type { PaginatedResult } from '$lib/core/shared';
import type { IRolesRepository } from './roles.repository';
import type { RoleModel, CreateRoleInput, UpdateRoleInput, RoleParams } from './roles.model';

export class RolesUseCase {
  constructor(private readonly repository: IRolesRepository) {}

  async getAll(params: RoleParams): Promise<PaginatedResult<RoleModel>> {
    return this.repository.getAll(params);
  }

  async getById(id: string): Promise<RoleModel | null> {
    return this.repository.getById(id);
  }

  async create(input: CreateRoleInput): Promise<RoleModel> {
    return this.repository.create(input);
  }

  async update(input: UpdateRoleInput): Promise<RoleModel> {
    return this.repository.update(input);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
}
