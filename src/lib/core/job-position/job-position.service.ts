import type {
	JobPositionModel,
	UpdateJobPositionInput,
	JobPositionStatus
} from './job-position.model';

export interface JobPositionFilterCriteria {
	search?: string;
	status?: JobPositionStatus | 'all';
}

export interface JobPositionStats {
	total: number;
	active: number;
	activePercentage: number;
}

export class JobPositionService {
	static toInput(model: JobPositionModel): UpdateJobPositionInput {
		return {
			id: model.id,
			name: model.name,
			departmentId: model.departmentId,
			jobTitleId: model.jobTitleId,
			parentId: model.parentId,
			headcountQuota: model.headcountQuota,
			description: model.description,
			status: model.status
		};
	}

	static filter(
		positions: JobPositionModel[],
		criteria: JobPositionFilterCriteria
	): JobPositionModel[] {
		const search = criteria.search?.trim().toLowerCase() ?? '';
		const status = criteria.status ?? 'all';

		return positions.filter((position) => {
			const matchStatus = status === 'all' || position.status === status;
			const matchSearch = search === '' || position.name.toLowerCase().includes(search);
			return matchStatus && matchSearch;
		});
	}

	static getStats(positions: JobPositionModel[]): JobPositionStats {
		const total = positions.length;
		const active = positions.filter((position) => position.status === 'active').length;
		const activePercentage = total === 0 ? 0 : Math.round((active / total) * 100);
		return { total, active, activePercentage };
	}

	static buildTree(
		positions: JobPositionModel[]
	): (JobPositionModel & { children?: JobPositionModel[] })[] {
		const nodeById = new Map<string, JobPositionModel & { children?: JobPositionModel[] }>(
			positions.map((position) => [position.id, { ...position, children: [] }])
		);
		const roots: (JobPositionModel & { children?: JobPositionModel[] })[] = [];

		for (const position of nodeById.values()) {
			if (position.parentId && nodeById.has(position.parentId)) {
				nodeById.get(position.parentId)!.children!.push(position);
			} else {
				roots.push(position);
			}
		}

		return roots;
	}

	static getAssignableParents(
		positions: JobPositionModel[],
		excludeId?: string
	): JobPositionModel[] {
		if (!excludeId) {
			return positions;
		}

		const excludedIds: string[] = [excludeId];
		let changed = true;
		while (changed) {
			changed = false;
			for (const position of positions) {
				if (
					position.parentId &&
					excludedIds.includes(position.parentId) &&
					!excludedIds.includes(position.id)
				) {
					excludedIds.push(position.id);
					changed = true;
				}
			}
		}

		return positions.filter((position) => !excludedIds.includes(position.id));
	}
}
