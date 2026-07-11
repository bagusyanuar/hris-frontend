// Representasi struktur data dari Backend API (biasanya snake_case)

export interface LoginResponse {
	user_id: string;
	full_name: string;
	email_address: string;
	user_role: string;
	access_token: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}
