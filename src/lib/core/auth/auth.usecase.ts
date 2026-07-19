import type { AuthUserModel, LoginInput } from './auth.model';
import type { IAuthRepository } from './auth.repository';

export class AuthUseCase {
  constructor(private repository: IAuthRepository) {}

  async login(credentials: LoginInput): Promise<AuthUserModel> {
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    return await this.repository.login(credentials);
  }

  async logout(): Promise<void> {
    await this.repository.logout();
  }
}
