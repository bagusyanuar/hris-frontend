/**
 * Base class for all domain/application errors in the HRIS system.
 * Agnostic of transport layer (HTTP, WebSocket, etc.).
 */
export class AppError extends Error {
	public readonly code: string;
	public readonly details?: Record<string, unknown>;

	constructor(message: string, code = 'INTERNAL_ERROR', details?: Record<string, unknown>) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.details = details;

		// Maintain proper stack trace in V8 engines (like Chrome/Node)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
	}
}

/**
 * Thrown when a requested resource is not found (maps to HTTP 404).
 */
export class NotFoundError extends AppError {
	constructor(message = 'Resource not found', code = 'NOT_FOUND', details?: Record<string, unknown>) {
		super(message, code, details);
	}
}

/**
 * Thrown when validation fails (maps to HTTP 422 or client-side validation).
 */
export interface ValidationErrorDetail {
	field: string;
	message: string;
}

export class ValidationError extends AppError {
	constructor(
		message = 'Validation failed',
		public readonly errors: ValidationErrorDetail[] = [],
		code = 'VALIDATION_FAILED'
	) {
		super(message, code, { errors });
	}
}

/**
 * Thrown when credentials are invalid or missing (maps to HTTP 401).
 */
export class UnauthorizedError extends AppError {
	constructor(message = 'Unauthorized access', code = 'UNAUTHORIZED', details?: Record<string, unknown>) {
		super(message, code, details);
	}
}

/**
 * Thrown when a user does not have permission for an action (maps to HTTP 403).
 */
export class ForbiddenError extends AppError {
	constructor(message = 'Access forbidden', code = 'FORBIDDEN', details?: Record<string, unknown>) {
		super(message, code, details);
	}
}

/**
 * Thrown when server/database encounters an unhandled error (maps to HTTP 500).
 */
export class UnexpectedError extends AppError {
	constructor(message = 'An unexpected error occurred', code = 'UNEXPECTED_ERROR', details?: Record<string, unknown>) {
		super(message, code, details);
	}
}

/**
 * Thrown when the backend server cannot be reached due to network issues.
 */
export class NetworkError extends AppError {
	constructor(message = 'Network connection issue', code = 'NETWORK_ERROR', details?: Record<string, unknown>) {
		super(message, code, details);
	}
}
