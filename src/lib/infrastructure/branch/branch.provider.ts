import { BranchUseCase } from '$lib/core/branch';
import { BranchRepositoryImpl } from './branch.repository.impl';
import { BranchRepositoryMock } from './branch.repository.mock';

const USE_MOCK = true;

let useCaseInstance: BranchUseCase | null = null;

export function provideBranchUseCase(): BranchUseCase {
  if (!useCaseInstance) {
    const repository = USE_MOCK ? new BranchRepositoryMock() : new BranchRepositoryImpl();
    useCaseInstance = new BranchUseCase(repository);
  }
  return useCaseInstance;
}
