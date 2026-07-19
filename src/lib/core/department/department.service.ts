import type { CreateDepartmentInput, DepartmentModel, DepartmentStatus } from './department.model';

export interface DepartmentFilterCriteria {
  search?: string;
  status?: DepartmentStatus | 'all';
}

export interface DepartmentStats {
  total: number;
  active: number;
  activePercentage: number;
}

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

  /** Filters departments by search term (name/code) and status. */
  static filter(
    departments: DepartmentModel[],
    criteria: DepartmentFilterCriteria
  ): DepartmentModel[] {
    const search = criteria.search?.trim().toLowerCase() ?? '';
    const status = criteria.status ?? 'all';

    return departments.filter((department) => {
      const matchStatus = status === 'all' || department.status === status;
      const matchSearch =
        search === '' ||
        department.name.toLowerCase().includes(search) ||
        department.code.toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });
  }

  /** Aggregate counts used by the directory header (total / active / active %). */
  static getStats(departments: DepartmentModel[]): DepartmentStats {
    const total = departments.length;
    const active = departments.filter((department) => department.status === 'active').length;
    const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);
    return { total, active, activePercentage };
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
