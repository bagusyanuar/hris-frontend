import { DepartmentUseCase } from '$lib/core/department';
import { DepartmentRepositoryImpl } from './department.repository.impl';

let departmentUseCaseInstance: DepartmentUseCase | null = null;

export function provideDepartmentUseCase(): DepartmentUseCase {
	if (!departmentUseCaseInstance) {
		const repository = new DepartmentRepositoryImpl();
		departmentUseCaseInstance = new DepartmentUseCase(repository);
	}
	return departmentUseCaseInstance;
}
