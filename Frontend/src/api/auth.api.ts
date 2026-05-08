import api from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data),
};
