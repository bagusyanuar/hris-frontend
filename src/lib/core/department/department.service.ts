import type { CreateDepartmentInput, DepartmentModel } from './department.model';

/**
 * Domain Service: operasi domain Departemen yang **murni & stateless** (tanpa I/O,
 * tanpa repository). Dipisah dari `DepartmentUseCase` yang mengurus orkestrasi async
 * + aturan bisnis. Aman dipanggil dari Presentation (page/rune) tanpa menyentuh provider.
 */
export class DepartmentService {
	/** Projects a department into the create/update form input shape (Model -> Input). */
	static toInput(department: DepartmentModel): CreateDepartmentInput {
		return {
			code: department.code,
			name: department.name,
			description: department.description ?? '',
			parentId: department.parentId,
			status: department.status
		};
	}

	/** Nests a flat department list into a Parent-Child tree based on `parentId`. */
	static buildTree(departments: DepartmentModel[]): DepartmentModel[] {
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
	static getAssignableParents(
		departments: DepartmentModel[],
		excludeId?: string
	): DepartmentModel[] {
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
}
