export type TipoAlerta = 'STOCK_BAJO' | 'SIN_STOCK' | 'PRECIO_ACTUALIZADO';

export interface Alerta {
  id: number;
  productoId: number;
  productoNombre: string;
  tipo: TipoAlerta;
  mensaje: string;
  leida: boolean;
  fecha: string;
}
