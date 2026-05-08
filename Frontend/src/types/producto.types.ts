export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  categoriaId: number;
  categoriaNombre: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductoRequest {
  nombre: string;
  descripcion?: string;
  unidadMedida: string;
  precioCompra: number;
  precioVenta: number;
  stockMinimo?: number;
  categoriaId?: number;
}
