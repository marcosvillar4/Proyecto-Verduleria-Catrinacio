export interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  createdAt: string;
}

export interface ProveedorRequest {
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
}
