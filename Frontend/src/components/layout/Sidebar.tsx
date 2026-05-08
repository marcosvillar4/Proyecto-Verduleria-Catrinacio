import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/productos', label: 'Productos', icon: '🥦' },
  { to: '/categorias', label: 'Categorías', icon: '🏷️' },
  { to: '/ventas', label: 'Ventas', icon: '🧾' },
  { to: '/proveedores', label: 'Proveedores', icon: '🚚' },
  { to: '/alertas', label: 'Alertas', icon: '🔔' },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-shrink-0 flex-col bg-gray-800 text-white">
      <div className="px-5 py-6">
        <p className="text-xs uppercase tracking-widest text-gray-400">Verdulería</p>
        <h1 className="mt-1 text-lg font-bold text-white">Catrinacio</h1>
      </div>
      <nav className="flex-1 px-3">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium mb-1 transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
