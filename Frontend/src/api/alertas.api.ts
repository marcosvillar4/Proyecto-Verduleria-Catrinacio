import api from './axiosInstance';
import type { ApiResponse } from '../types/api.types';
import type { Alerta } from '../types/alerta.types';

export const alertasApi = {
  getAll: () =>
    api.get<ApiResponse<Alerta[]>>('/alertas').then((r) => r.data),

  getNoLeidas: () =>
    api.get<ApiResponse<Alerta[]>>('/alertas/no-leidas').then((r) => r.data),

  marcarLeida: (id: number) =>
    api.put<ApiResponse<Alerta>>(`/alertas/${id}/leer`).then((r) => r.data),
};
