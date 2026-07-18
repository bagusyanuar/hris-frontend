import type { CreateDepartmentInput, DepartmentModel, DepartmentParams } from '$lib/core/department';
import type { DepartmentRequest, DepartmentResponse, DepartmentQuery } from './department.schema';

export class DepartmentMapper {
	static toDomain(response: DepartmentResponse): DepartmentModel {
		return {
			id: response.id,
			code: response.code,
			name: response.name,
			parentId: response.parent_id,
			description: response.description,
			status: response.status,
			managerName: response.manager_name,
			managerAvatar: response.manager_avatar,
			employeeCount: response.employee_count
		};
	}

	static toDomainList(responses: DepartmentResponse[]): DepartmentModel[] {
		return responses.map((response) => DepartmentMapper.toDomain(response));
	}

	static toRequest(input: CreateDepartmentInput): DepartmentRequest {
		return {
			code: input.code,
			name: input.name,
			parent_id: input.parentId,
			description: input.description,
			status: input.status
		};
	}

	static toQuery(params?: DepartmentParams): DepartmentQuery {
		if (!params) return {};

		return {
			...(params.search?.trim() && { search: params.search.trim() }),
			...(params.status && params.status !== 'all' && { status: params.status })
		};
	}
}
