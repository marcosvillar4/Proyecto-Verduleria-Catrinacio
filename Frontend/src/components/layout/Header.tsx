import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlerts } from '../../hooks/useAlerts';
import { Button } from '../ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const { count } = useAlerts();

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
      <p className="text-sm text-gray-600">
        Hola, <span className="font-semibold text-gray-800">{user?.nombre}</span>
        {user?.rol === 'ADMIN' && (
          <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 font-medium">
            Admin
          </span>
        )}
      </p>
      <div className="flex items-center gap-4">
        <Link to="/alertas" className="relative text-gray-600 hover:text-gray-800">
          <span className="text-xl">🔔</span>
          {count > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {count > 9 ? '9+' : count}
            </span>
          )}
        </Link>
        <Button variant="ghost" size="sm" onClick={logout}>
          Salir
        </Button>
      </div>
    </header>
  );
}
