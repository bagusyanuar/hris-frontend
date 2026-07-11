import type { AuthUserModel, IAuthRepository, LoginInput } from '$lib/core/auth';
import type { LoginResponse } from './auth.schema';
import { AuthMapper } from './auth.mapper';

export class AuthRepositoryImpl implements IAuthRepository {
	async login(credentials: LoginInput): Promise<AuthUserModel> {
		// Mengubah format domain input ke request payload API
		const requestPayload = AuthMapper.toRequest(credentials);

		// Mensimulasikan pemanggilan API dengan delay
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (requestPayload.email === 'admin@hris.com' && requestPayload.password === 'password123') {
					// Simulasi response data snake_case dari API Backend
					const apiResponse: LoginResponse = {
						user_id: '1',
						full_name: 'Admin HRIS',
						email_address: 'admin@hris.com',
						user_role: 'admin',
						access_token: 'mock-jwt-token-xyz'
					};
					
					// Melakukan mapping data ke format Domain Model di Core Layer
					resolve(AuthMapper.toDomain(apiResponse));
				} else {
					reject(new Error('Email atau password salah'));
				}
			}, 1000);
		});
	}

	async logout(): Promise<void> {
		return new Promise((resolve) => {
			setTimeout(() => resolve(), 500);
		});
	}
}
