import { AppError, ValidationError, type ValidationErrorDetail } from '$lib/core/errors/app-error';
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
		this.validateInput(input);
		return await this.repository.create(input);
	}

	async update(input: UpdateDepartmentInput): Promise<DepartmentModel> {
		this.validateInput(input);
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

	/** Nests a flat department list into a Parent-Child tree based on `parentId`. */
	buildTree(departments: DepartmentModel[]): DepartmentModel[] {
		const nodeById = new Map<string, DepartmentModel>(
			departments.map((department) => [department.id, { ...department, children: [] }])
		);
		const roots: DepartmentModel[] = [];

		for (const department of nodeById.values()) {
			if (department.parentId && nodeById.has(department.parentId)) {
				nodeById.get(department.parentId)!.children!.push(department);
			} else {
				roots.push(department);
			}
		}

		return roots;
	}

	/** Departments eligible to be selected as a parent, excluding itself and its descendants. */
	getAssignableParents(departments: DepartmentModel[], excludeId?: string): DepartmentModel[] {
		if (!excludeId) {
			return departments;
		}

		const excludedIds: string[] = [excludeId];
		let changed = true;
		while (changed) {
			changed = false;
			for (const department of departments) {
				if (
					department.parentId &&
					excludedIds.includes(department.parentId) &&
					!excludedIds.includes(department.id)
				) {
					excludedIds.push(department.id);
					changed = true;
				}
			}
		}

		return departments.filter((department) => !excludedIds.includes(department.id));
	}

	private validateInput(input: CreateDepartmentInput): void {
		const errors: ValidationErrorDetail[] = [];
		if (!input.code.trim()) {
			errors.push({ field: 'code', message: 'Department code is required' });
		}
		if (!input.name.trim()) {
			errors.push({ field: 'name', message: 'Department name is required' });
		}
		if (errors.length > 0) {
			throw new ValidationError('Department validation failed', errors);
		}
	}
}
