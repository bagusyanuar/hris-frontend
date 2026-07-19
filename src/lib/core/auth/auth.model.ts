export interface AuthUserModel {
  id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
