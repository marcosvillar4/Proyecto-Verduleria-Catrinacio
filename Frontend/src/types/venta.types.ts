export type MetodoPago = 'EFECTIVO' | 'DEBITO' | 'CREDITO' | 'TRANSFERENCIA' | 'MERCADOPAGO';
export type EstadoVenta = 'COMPLETADA' | 'ANULADA';

export interface DetalleVenta {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: number;
  usuarioNombre: string;
  fecha: string;
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoVenta;
  numeroTicket: string;
  detalles: DetalleVenta[];
}

export interface DetalleVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface VentaRequest {
  metodoPago: MetodoPago;
  numeroTicket?: string;
  detalles: DetalleVentaRequest[];
}
