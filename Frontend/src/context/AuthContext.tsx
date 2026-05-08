import { createContext, useContext, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AuthResponse, AuthUser } from '../types/auth.types';

interface AuthContextValue {
  user: AuthUser | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadUserFromStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadUserFromStorage);
  const navigate = useNavigate();

  const login = (data: AuthResponse) => {
    const authUser: AuthUser = {
      token: data.token,
      userId: data.id,
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      rol: data.rol,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));
    setUser(authUser);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.rol === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
