import { AxiosError } from 'axios';
import {
  AppError,
  NotFoundError,
  ValidationError as DomainValidationError,
  UnauthorizedError,
  ForbiddenError,
  UnexpectedError,
  NetworkError
} from '$lib/core/errors/app-error';
import type { ApiErrorResponse } from './types';

export class HttpErrorMapper {
  /**
   * Maps any external/HTTP error into a unified domain AppError subclass.
   */
  public static toDomain(error: unknown): AppError {
    // If it is already an AppError, return as-is
    if (error instanceof AppError) {
      return error;
    }

    // Check if it's an Axios error
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;

      // No response (Network / CORS issues)
      if (!axiosError.response) {
        return new NetworkError(
          axiosError.message ||
            'Backend server is unreachable. Please check your internet connection.',
          'NETWORK_ERROR'
        );
      }

      const status = axiosError.response.status;
      const data = axiosError.response.data;
      const message = data?.message || axiosError.message || 'An API error occurred';

      switch (status) {
        case 400:
        case 422: {
          const validationDetails = (data?.errors || []).map((err) => ({
            field: err.field,
            message: err.message
          }));
          return new DomainValidationError(message, validationDetails);
        }
        case 401:
          return new UnauthorizedError(message);
        case 403:
          return new ForbiddenError(message);
        case 404:
          return new NotFoundError(message);
        case 500:
        default:
          return new UnexpectedError(message, `API_ERROR_${status}`);
      }
    }

    // Standard JavaScript/TypeScript Error
    if (error instanceof Error) {
      return new UnexpectedError(error.message);
    }

    // Fallback for unknown types
    return new UnexpectedError('An unknown error occurred');
  }
}

/**
 * Utility helper to wrap infrastructure calls and automatically map errors to AppError
 */
export async function handleAppError<T>(task: () => Promise<T>): Promise<T> {
  try {
    return await task();
  } catch (err) {
    throw HttpErrorMapper.toDomain(err);
  }
}
