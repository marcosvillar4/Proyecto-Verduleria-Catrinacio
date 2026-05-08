import api from './axiosInstance';
import type { ApiResponse, PageResponse } from '../types/api.types';
import type { Venta, VentaRequest } from '../types/venta.types';

export const ventasApi = {
  getAll: (page = 0, size = 20) =>
    api
      .get<ApiResponse<PageResponse<Venta>>>('/ventas', { params: { page, size } })
      .then((r) => r.data),

  getById: (id: number) =>
    api.get<ApiResponse<Venta>>(`/ventas/${id}`).then((r) => r.data),

  create: (data: VentaRequest) =>
    api.post<ApiResponse<Venta>>('/ventas', data).then((r) => r.data),

  anular: (id: number) =>
    api.put<ApiResponse<Venta>>(`/ventas/${id}/anular`).then((r) => r.data),
};
