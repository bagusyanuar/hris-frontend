import { AppError, ValidationError } from '$lib/core/errors/app-error';
import type {
  CreateDepartmentInput,
  DepartmentModel,
  DepartmentParams,
  UpdateDepartmentInput
} from './department.model';
import type { IDepartmentRepository } from './department.repository';

export class DepartmentUseCase {
  constructor(private repository: IDepartmentRepository) {}

  async getAll(params?: DepartmentParams): Promise<DepartmentModel[]> {
    return await this.repository.getAll(params);
  }

  async getById(id: string): Promise<DepartmentModel> {
    return await this.repository.getById(id);
  }

  async create(input: CreateDepartmentInput): Promise<DepartmentModel> {
    return await this.repository.create(input);
  }

  async update(input: UpdateDepartmentInput): Promise<DepartmentModel> {
    if (input.parentId === input.id) {
      throw new ValidationError('Invalid parent department', [
        { field: 'parentId', message: 'A department cannot be its own parent' }
      ]);
    }
    return await this.repository.update(input);
  }

  async delete(id: string): Promise<void> {
    const all = await this.repository.getAll();
    const hasChildren = all.some((department) => department.parentId === id);
    if (hasChildren) {
      throw new AppError(
        'Cannot delete a department that still has sub-departments',
        'DEPARTMENT_HAS_CHILDREN'
      );
    }
    await this.repository.delete(id);
  }
}
