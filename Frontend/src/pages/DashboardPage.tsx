import { useEffect, useState } from 'react';
import { productosApi } from '../api/productos.api';
import { ventasApi } from '../api/ventas.api';
import { alertasApi } from '../api/alertas.api';
import { Card } from '../components/ui/Card';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Alerta } from '../types/alerta.types';

const tipoColor = { STOCK_BAJO: 'orange', SIN_STOCK: 'red', PRECIO_ACTUALIZADO: 'blue' } as const;

const columns: Column<Alerta>[] = [
  { key: 'productoNombre', label: 'Producto' },
  {
    key: 'tipo',
    label: 'Tipo',
    render: (a) => <Badge color={tipoColor[a.tipo]} text={a.tipo.replace('_', ' ')} />,
  },
  { key: 'mensaje', label: 'Mensaje' },
  {
    key: 'fecha',
    label: 'Fecha',
    render: (a) => new Date(a.fecha).toLocaleString('es-AR'),
  },
];

export function DashboardPage() {
  const [stats, setStats] = useState({ productos: 0, bajoStock: 0, ventas: 0, alertas: 0 });
  const [unread, setUnread] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prod, bajo, vtas, alts] = await Promise.all([
        productosApi.getAll(0, 1),
        productosApi.getBajoStock(),
        ventasApi.getAll(0, 1),
        alertasApi.getNoLeidas(),
      ]);
      setStats({
        productos: prod.data?.totalElements ?? 0,
        bajoStock: bajo.data?.length ?? 0,
        ventas: vtas.data?.totalElements ?? 0,
        alertas: alts.data?.length ?? 0,
      });
      setUnread(alts.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const marcarLeida = async (id: number) => {
    await alertasApi.marcarLeida(id);
    loadData();
  };

  const alertColumns: Column<Alerta>[] = [
    ...columns,
    {
      key: 'id',
      label: '',
      render: (a) => (
        <Button size="sm" variant="ghost" onClick={() => marcarLeida(a.id)}>
          Marcar leída
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card title="Total Productos" value={stats.productos} color="green" />
        <Card title="Bajo Stock" value={stats.bajoStock} color="orange" />
        <Card title="Total Ventas" value={stats.ventas} color="blue" />
        <Card title="Alertas sin leer" value={stats.alertas} color="red" />
      </div>

      <div>
        <h3 className="mb-3 text-base font-medium text-gray-700">Alertas pendientes</h3>
        <Table columns={alertColumns} data={unread} loading={loading} rowKey={(a) => a.id} />
      </div>
    </div>
  );
}
