import { DepartmentUseCase } from '$lib/core/department';
import { DepartmentRepositoryImpl } from './department.repository.impl';
import { DepartmentRepositoryMock } from './department.repository.mock';

let departmentUseCaseInstance: DepartmentUseCase | null = null;

const USE_MOCK = true; // Set false to use real backend API

export function provideDepartmentUseCase(): DepartmentUseCase {
  if (!departmentUseCaseInstance) {
    const repository = USE_MOCK ? new DepartmentRepositoryMock() : new DepartmentRepositoryImpl();

    departmentUseCaseInstance = new DepartmentUseCase(repository);
  }
  return departmentUseCaseInstance;
}
