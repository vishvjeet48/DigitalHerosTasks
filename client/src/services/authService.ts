import api from './api';
import { ApiResponse } from '../types/lead';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      username,
      password,
    });
    return response.data.data!;
  },

  getMe: async (): Promise<{ username: string }> => {
    const response = await api.get<ApiResponse<{ admin: { username: string } }>>('/auth/me');
    return response.data.data!.admin;
  },
};
