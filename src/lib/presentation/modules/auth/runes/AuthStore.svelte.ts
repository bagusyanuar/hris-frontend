import type { AuthUseCase, AuthUserModel, LoginInput } from '$lib/core/auth';

export class AuthStore {
	user = $state<AuthUserModel | null>(null);
	isLoading = $state(false);
	error = $state<string | null>(null);
	
	isAuthenticated = $derived(this.user !== null);

	constructor(private useCase: AuthUseCase) {}

	async login(credentials: LoginInput) {
		this.isLoading = true;
		this.error = null;

		try {
			const user = await this.useCase.login(credentials);
			this.user = user;
			
			// Normally you would save token to localStorage/cookie here
			return true;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'An error occurred during login';
			return false;
		} finally {
			this.isLoading = false;
		}
	}

	async logout() {
		this.isLoading = true;
		try {
			await this.useCase.logout();
			this.user = null;
		} finally {
			this.isLoading = false;
		}
	}
}
