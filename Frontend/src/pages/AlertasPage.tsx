import { useEffect, useState } from 'react';
import { alertasApi } from '../api/alertas.api';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Alerta, TipoAlerta } from '../types/alerta.types';

const tipoColor: Record<TipoAlerta, 'red' | 'orange' | 'blue'> = {
  SIN_STOCK: 'red',
  STOCK_BAJO: 'orange',
  PRECIO_ACTUALIZADO: 'blue',
};

export function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await alertasApi.getAll();
      setAlertas(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const marcarLeida = async (id: number) => {
    await alertasApi.marcarLeida(id);
    load();
  };

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
    {
      key: 'leida',
      label: 'Estado',
      render: (a) => <Badge color={a.leida ? 'green' : 'orange'} text={a.leida ? 'Leída' : 'Sin leer'} />,
    },
    {
      key: 'actions',
      label: '',
      render: (a) =>
        !a.leida ? (
          <Button size="sm" variant="ghost" onClick={() => marcarLeida(a.id)}>
            Marcar leída
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-gray-800">Alertas</h2>
      <Table columns={columns} data={alertas} loading={loading} rowKey={(a) => a.id} />
    </div>
  );
}
