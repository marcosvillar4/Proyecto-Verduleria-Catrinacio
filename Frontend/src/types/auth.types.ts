export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'ADMIN' | 'VENDEDOR';
}

export interface AuthUser {
  token: string;
  userId: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'ADMIN' | 'VENDEDOR';
}
