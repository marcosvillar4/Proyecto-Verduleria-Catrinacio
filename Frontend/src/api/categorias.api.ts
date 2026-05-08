import api from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type { Categoria, CategoriaRequest } from '../types/categoria.types';

export const categoriasApi = {
  getAll: () =>
    api.get<ApiResponse<Categoria[]>>('/categorias').then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Categoria>>(`/categorias/${id}`).then((r) => r.data),

  create: (data: CategoriaRequest) =>
    api.post<ApiResponse<Categoria>>('/categorias', data).then((r) => r.data),

  update: (id: number, data: CategoriaRequest) =>
    api.put<ApiResponse<Categoria>>(`/categorias/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete<ApiResponse<void>>(`/categorias/${id}`).then((r) => r.data),
};
