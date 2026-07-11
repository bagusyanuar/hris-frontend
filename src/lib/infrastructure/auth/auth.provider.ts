import { AuthUseCase } from '$lib/core/auth';
import { AuthStore } from '$lib/presentation/modules/auth/runes/AuthStore.svelte';
import { AuthRepositoryImpl } from './auth.repository.impl';

let authUseCaseInstance: AuthUseCase | null = null;
let authStoreInstance: AuthStore | null = null;

export function provideAuthUseCase(): AuthUseCase {
	if (!authUseCaseInstance) {
		const repository = new AuthRepositoryImpl();
		authUseCaseInstance = new AuthUseCase(repository);
	}
	return authUseCaseInstance;
}

export function provideAuthStore(): AuthStore {
	if (!authStoreInstance) {
		const useCase = provideAuthUseCase();
		authStoreInstance = new AuthStore(useCase);
	}
	return authStoreInstance;
}
