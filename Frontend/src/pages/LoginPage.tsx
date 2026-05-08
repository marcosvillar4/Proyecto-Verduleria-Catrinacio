import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { LoginRequest } from '../types/auth.types';

export function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.success) {
        login(res.data);
      } else {
        setError(res.message || 'Error al iniciar sesión');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-md">
        <div className="mb-6 text-center">
          <p className="text-3xl">🥦</p>
          <h1 className="mt-2 text-xl font-bold text-gray-800">Verdulería Catrinacio</h1>
          <p className="text-sm text-gray-500">Ingresá con tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@verduleria.com"
            error={errors.email?.message}
            {...register('email', { required: 'El email es obligatorio' })}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'La contraseña es obligatoria' })}
          />

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <Button type="submit" loading={loading} className="mt-2 w-full justify-center">
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
