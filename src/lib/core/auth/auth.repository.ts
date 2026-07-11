import type { AuthUserModel, LoginInput } from './auth.model';

export interface IAuthRepository {
	login(credentials: LoginInput): Promise<AuthUserModel>;
	logout(): Promise<void>;
}
