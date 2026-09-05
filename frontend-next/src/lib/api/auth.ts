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

export async function getCurrentAdmin(): Promise<unknown> {
  try {
    const response = await api.get('/auth/admin/me');
    return unwrap(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Failed to fetch admin profile');
    }
    throw error;
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await api.post('/auth/admin/logout');
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message || 'Logout failed');
    }
    throw error;
  }
}
