import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './guards/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { VentasPage } from './pages/VentasPage';
import { ProveedoresPage } from './pages/ProveedoresPage';
import { AlertasPage } from './pages/AlertasPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/ventas" element={<VentasPage />} />
              <Route path="/proveedores" element={<ProveedoresPage />} />
              <Route path="/alertas" element={<AlertasPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
