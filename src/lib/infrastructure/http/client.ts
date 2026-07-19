import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios';
import { TokenStorage } from '../storage/token.storage';
import { RuntimeConfig } from '../config/runtime.config';
import type { ApiResponse, ApiErrorResponse } from './types';

// Buat instance Axios tanpa baseURL keras (diberikan dinamis di interceptor)
const axiosInstance: AxiosInstance = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Queue untuk menampung request yang tertunda selama proses refresh token berlangsung
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Otomatis sisipkan Bearer Token & Base URL dinamis
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Set dynamic baseURL dari runtime config
    config.baseURL = RuntimeConfig.apiBaseUrl;

    const token = TokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Tangani standard response & refresh token flow
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Jika error response tidak ada (Network Error, dsb)
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const errorData = error.response.data as ApiErrorResponse;

    // 1. Tangani Refresh Token jika Unauthorized (401) dan request bukan ke endpoint refresh itu sendiri
    if (status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh')) {
      if (originalRequest._retry) {
        // Jika request sudah dicoba sekali setelah refresh dan masih 401, bersihkan storage & logout
        TokenStorage.clearAccessToken();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hris:logout'));
        }
        return Promise.reject(errorData || error);
      }

      if (isRefreshing) {
        // Jika sedang proses refresh, masukkan request saat ini ke antrean
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(axiosInstance(originalRequest));
            },
            reject: (err: unknown) => {
              reject(err);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request refresh token ke BE dengan withCredentials: true agar cookie terkirim
        const refreshResponse = await axiosInstance.post<ApiResponse<{ access_token: string }>>(
          '/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.data.access_token;
        TokenStorage.setAccessToken(newAccessToken);

        // Jalankan ulang request yang mengantre
        processQueue(null, newAccessToken);

        // Jalankan ulang request original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal, batalkan antrean, bersihkan token, dan trigger logout event
        processQueue(refreshError, null);
        TokenStorage.clearAccessToken();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hris:logout'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Kembalikan error dengan payload data standar dari BE jika tersedia
    return Promise.reject(errorData || error);
  }
);

class HttpClientWrapper {
  constructor(private instance: AxiosInstance) {}

  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.request<T>(config);
    return res.data;
  }

  /** Returns full AxiosResponse — use when you need headers, status code, etc. */
  public async requestRaw<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<T>(url, config);
    return res.data;
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.post<T>(url, data, config);
    return res.data;
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.put<T>(url, data, config);
    return res.data;
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.patch<T>(url, data, config);
    return res.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<T>(url, config);
    return res.data;
  }
}

export const httpClient = new HttpClientWrapper(axiosInstance);
