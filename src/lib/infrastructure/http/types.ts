export interface ApiResponse<T> {
	code: number;
	status: 'success';
	message: string;
	data: T;
}

export interface ValidationError {
	field: string;
	message: string;
}

export interface ApiErrorResponse {
	code: number;
	status: 'error';
	message: string;
	errors: ValidationError[] | null;
}
