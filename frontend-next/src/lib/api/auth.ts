import api, { unwrap, ApiError } from './axios';

export async function adminLogin(email: string, password: string): Promise<unknown> {
  try {
    const response = await api.post('/auth/admin/login', { email, password });
    return unwrap(response);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.message || 'Login failed');
    }
    throw error;
  }
}
