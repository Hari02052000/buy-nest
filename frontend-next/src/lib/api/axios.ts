import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { env } from '@/lib/env';

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export function unwrap<T>(response: AxiosResponse<{ success: boolean; message?: string; data: T }>): T {
  return response.data.data;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = (data && typeof data === 'object' && 'message' in data && typeof (data as { message?: string }).message === 'string')
      ? (data as { message: string }).message
      : error.message || 'An unexpected error occurred';

    throw new ApiError(message, status, data);
  }
);

export default api;
