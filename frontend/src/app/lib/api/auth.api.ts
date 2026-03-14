import { api } from '../api-client';
import type { Profile } from '../api-types';

export const authApi = {
  signUp(data: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    org_name?: string;
    org_type?: 'procuring_entity' | 'vendor';
  }) {
    return api.post<{ message: string; userId: string }>('/api/auth/sign-up', data);
  },

  signIn(email: string, password: string) {
    return api.post<{ user: Profile; session: { token: string; expiresAt: string } }>(
      '/api/auth/sign-in', { email, password }
    );
  },

  signOut() {
    return api.post<{ success: true }>('/api/auth/sign-out');
  },

  getProfile() {
    return api.get<Profile>('/api/auth/profile');
  },
};
