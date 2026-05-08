import api from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/api.types';
import type { Producto, ProductoRequest } from '../types/producto.types';

export const productosApi = {
  getAll: (page = 0, size = 20) =>
    api
      .get<ApiResponse<PageResponse<Producto>>>('/productos', { params: { page, size } })
      .then((r) => r.data),

  search: (q: string, page = 0, size = 20) =>
    api
      .get<ApiResponse<PageResponse<Producto>>>('/productos/buscar', { params: { q, page, size } })
      .then((r) => r.data),

  getByCategoria: (categoriaId: number, page = 0, size = 20) =>
    api
      .get<ApiResponse<PageResponse<Producto>>>(`/productos/categoria/${categoriaId}`, {
        params: { page, size },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Producto>>(`/productos/${id}`).then((r) => r.data),

  getBajoStock: () =>
    api.get<ApiResponse<Producto[]>>('/productos/bajo-stock').then((r) => r.data),

  create: (data: ProductoRequest) =>
    api.post<ApiResponse<Producto>>('/productos', data).then((r) => r.data),

  update: (id: number, data: ProductoRequest) =>
    api.put<ApiResponse<Producto>>(`/productos/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    api.delete<ApiResponse<void>>(`/productos/${id}`).then((r) => r.data),
};
