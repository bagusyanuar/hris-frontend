import { CompanyUseCase } from '$lib/core/company';
import { CompanyRepositoryImpl } from './company.repository.impl';
import { CompanyRepositoryMock } from './company.repository.mock';

const USE_MOCK = true;

let useCaseInstance: CompanyUseCase | null = null;

export function provideCompanyUseCase(): CompanyUseCase {
  if (!useCaseInstance) {
    const repository = USE_MOCK ? new CompanyRepositoryMock() : new CompanyRepositoryImpl();
    useCaseInstance = new CompanyUseCase(repository);
  }
  return useCaseInstance;
}
