import api from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type { Proveedor, ProveedorRequest } from '../types/proveedor.types';

export const proveedoresApi = {
  getAll: () =>
    api.get<ApiResponse<Proveedor[]>>('/proveedores').then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Proveedor>>(`/proveedores/${id}`).then((r) => r.data),

  create: (data: ProveedorRequest) =>
    api.post<ApiResponse<Proveedor>>('/proveedores', data).then((r) => r.data),

  update: (id: number, data: ProveedorRequest) =>
    api.put<ApiResponse<Proveedor>>(`/proveedores/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete<ApiResponse<void>>(`/proveedores/${id}`).then((r) => r.data),
};
