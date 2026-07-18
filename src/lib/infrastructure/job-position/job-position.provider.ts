import { JobPositionUseCase } from '$lib/core/job-position';
import { JobPositionRepositoryImpl } from './job-position.repository.impl';
import { JobPositionRepositoryMock } from './job-position.repository.mock';

const USE_MOCK = true;

let useCaseInstance: JobPositionUseCase | null = null;

export function provideJobPositionUseCase(): JobPositionUseCase {
	if (!useCaseInstance) {
		const repository = USE_MOCK ? new JobPositionRepositoryMock() : new JobPositionRepositoryImpl();
		useCaseInstance = new JobPositionUseCase(repository);
	}
	return useCaseInstance;
}
