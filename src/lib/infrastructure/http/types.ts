export interface ApiResponse<T> {
	code: number;
	status: 'success';
	message: string;
	data: T;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total_data: number;
	total_pages: number;
}

export interface ApiListResponse<T> {
	code: number;
	status: 'success';
	message: string;
	data: T[];
	meta: PaginationMeta;
}

export interface PaginationQuery {
	page?: number;
	limit?: number;
}

export interface PaginationSortQuery extends PaginationQuery {
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
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
