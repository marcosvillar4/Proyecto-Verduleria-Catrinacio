import { useEffect, useState } from 'react';
import { ventasApi } from '../api/ventas.api';
import { productosApi } from '../api/productos.api';
import { useAuth } from '../context/AuthContext';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import type { Venta, MetodoPago, DetalleVentaRequest } from '../types/venta.types';
import type { Producto } from '../types/producto.types';

const METODOS: MetodoPago[] = ['EFECTIVO', 'DEBITO', 'CREDITO', 'TRANSFERENCIA', 'MERCADOPAGO'];

interface LineItem {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export function VentasPage() {
  const { isAdmin } = useAuth();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('EFECTIVO');
  const [ticket, setTicket] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ productoId: 0, cantidad: 1, precioUnitario: 0 }]);

  const load = async (p = 0) => {
    setLoading(true);
    try {
      const res = await ventasApi.getAll(p);
      setVentas(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(page); }, [page]);
  useEffect(() => {
    productosApi.getAll(0, 200).then((r) => setProductos(r.data?.content ?? []));
  }, []);

  const openCreate = () => {
    setItems([{ productoId: 0, cantidad: 1, precioUnitario: 0 }]);
    setMetodoPago('EFECTIVO');
    setTicket('');
    setFormError('');
    setModalOpen(true);
  };

  const updateItem = (idx: number, field: keyof LineItem, value: number) => {
    setItems((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      if (field === 'productoId') {
        const prod = productos.find((p) => p.id === value);
        next[idx].precioUnitario = prod?.precioVenta ?? 0;
      }
      return next;
    });
  };

  const addItem = () => setItems((p) => [...p, { productoId: 0, cantidad: 1, precioUnitario: 0 }]);
  const removeItem = (idx: number) => setItems((p) => p.filter((_, i) => i !== idx));

  const total = items.reduce((sum, it) => sum + it.precioUnitario * it.cantidad, 0);

  const submitVenta = async () => {
    const detalles: DetalleVentaRequest[] = items.filter((it) => it.productoId > 0).map((it) => ({
      productoId: it.productoId,
      cantidad: it.cantidad,
    }));
    if (detalles.length === 0) { setFormError('Agregá al menos un producto'); return; }
    setSaving(true);
    setFormError('');
    try {
      await ventasApi.create({ metodoPago, numeroTicket: ticket || undefined, detalles });
      setModalOpen(false);
      load(0);
      setPage(0);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Error al registrar la venta');
    } finally {
      setSaving(false);
    }
  };

  const anularVenta = async (id: number) => {
    if (!confirm('¿Anular esta venta?')) return;
    await ventasApi.anular(id);
    load(page);
  };

  const columns: Column<Venta>[] = [
    { key: 'numeroTicket', label: 'Ticket' },
    { key: 'fecha', label: 'Fecha', render: (v) => new Date(v.fecha).toLocaleString('es-AR') },
    { key: 'usuarioNombre', label: 'Vendedor' },
    { key: 'total', label: 'Total', render: (v) => `$${Number(v.total).toFixed(2)}` },
    { key: 'metodoPago', label: 'Pago' },
    {
      key: 'estado',
      label: 'Estado',
      render: (v) => <Badge color={v.estado === 'COMPLETADA' ? 'green' : 'red'} text={v.estado} />,
    },
    ...(isAdmin
      ? [{
          key: 'anular',
          label: '',
          render: (v: Venta) =>
            v.estado === 'COMPLETADA' ? (
              <Button size="sm" variant="danger" onClick={() => anularVenta(v.id)}>Anular</Button>
            ) : null,
        }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Ventas</h2>
        <Button onClick={openCreate}>+ Nueva Venta</Button>
      </div>

      <Table columns={columns} data={ventas} loading={loading} rowKey={(v) => v.id} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>← Anterior</Button>
          <span className="text-gray-600">Página {page + 1} de {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>Siguiente →</Button>
        </div>
      )}

      <Modal open={modalOpen} title="Nueva Venta" onClose={() => setModalOpen(false)} width="max-w-2xl">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
              >
                {METODOS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">N° Ticket (opcional)</label>
              <input
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="TK-001"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Producto</th>
                  <th className="px-3 py-2 text-left">Cantidad</th>
                  <th className="px-3 py-2 text-left">Precio Unit.</th>
                  <th className="px-3 py-2 text-left">Subtotal</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-t border-gray-100">
                    <td className="px-3 py-2">
                      <select
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        value={item.productoId}
                        onChange={(e) => updateItem(idx, 'productoId', Number(e.target.value))}
                      >
                        <option value={0}>Seleccionar...</option>
                        {productos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} (stock: {p.stockActual} {p.unidadMedida})
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
                        value={item.cantidad}
                        onChange={(e) => updateItem(idx, 'cantidad', Number(e.target.value))}
                      />
                    </td>
                    <td className="px-3 py-2 text-gray-600">${item.precioUnitario.toFixed(2)}</td>
                    <td className="px-3 py-2 font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                    <td className="px-3 py-2">
                      {items.length > 1 && (
                        <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 text-lg">×</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" size="sm" type="button" onClick={addItem}>+ Agregar ítem</Button>
            <span className="text-lg font-bold text-gray-800">Total: ${total.toFixed(2)}</span>
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <ModalFooter onCancel={() => setModalOpen(false)} onConfirm={submitVenta} loading={saving} confirmLabel="Registrar Venta" />
        </div>
      </Modal>
    </div>
  );
}
