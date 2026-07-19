import { JobTitleUseCase } from '$lib/core/job-title';
import { JobTitleRepositoryImpl } from './job-title.repository.impl';
import { JobTitleRepositoryMock } from './job-title.repository.mock';

const USE_MOCK = true;

let useCaseInstance: JobTitleUseCase | null = null;

export function provideJobTitleUseCase(): JobTitleUseCase {
  if (!useCaseInstance) {
    const repository = USE_MOCK ? new JobTitleRepositoryMock() : new JobTitleRepositoryImpl();
    useCaseInstance = new JobTitleUseCase(repository);
  }
  return useCaseInstance;
}
