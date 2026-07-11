import type { AuthUserModel, LoginInput } from '$lib/core/auth';
import type { LoginRequest, LoginResponse } from './auth.schema';

export class AuthMapper {
	// Memetakan Response API (Infra) ke Domain Model (Core)
	static toDomain(response: LoginResponse): AuthUserModel {
		return {
			id: response.user_id,
			name: response.full_name,
			email: response.email_address,
			role: response.user_role,
			token: response.access_token
		};
	}

	// Memetakan Domain Input (Core) ke Request API (Infra) jika diperlukan
	static toRequest(input: LoginInput): LoginRequest {
		return {
			email: input.email,
			password: input.password
		};
	}
}
