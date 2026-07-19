import { RolesUseCase } from '$lib/core/roles';
import { RolesRepositoryImpl } from './roles.repository.impl';
import { RolesRepositoryMock } from './roles.repository.mock';

const USE_MOCK = true;

let useCaseInstance: RolesUseCase | null = null;

export function provideRolesUseCase(): RolesUseCase {
  if (!useCaseInstance) {
    const repository = USE_MOCK ? new RolesRepositoryMock() : new RolesRepositoryImpl();
    useCaseInstance = new RolesUseCase(repository);
  }
  return useCaseInstance;
}
