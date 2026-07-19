import type { RoleModel, UpdateRoleInput } from './roles.model';

export class RolesService {
  static toInput(model: RoleModel): UpdateRoleInput {
    return {
      id: model.id,
      name: model.name,
      description: model.description ?? '',
      permissions: model.permissions ?? []
    };
  }
}
