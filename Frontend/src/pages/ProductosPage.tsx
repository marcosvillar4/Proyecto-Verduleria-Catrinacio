import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { productosApi } from '../api/productos.api';
import { categoriasApi } from '../api/categorias.api';
import { useAuth } from '../context/AuthContext';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { Producto, ProductoRequest } from '../types/producto.types';
import type { Categoria } from '../types/categoria.types';

export function ProductosPage() {
  const { isAdmin } = useAuth();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQ, setSearchQ] = useState('');
  const [catFiltro, setCatFiltro] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductoRequest>();

  const load = async (p = 0) => {
    setLoading(true);
    try {
      let res;
      if (searchQ) {
        res = await productosApi.search(searchQ, p);
      } else if (catFiltro) {
        res = await productosApi.getByCategoria(Number(catFiltro), p);
      } else {
        res = await productosApi.getAll(p);
      }
      setProductos(res.data?.content ?? []);
      setTotalPages(res.data?.totalPages ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoriasApi.getAll().then((r) => setCategorias(r.data ?? []));
  }, []);

  useEffect(() => { setPage(0); load(0); }, [searchQ, catFiltro]);
  useEffect(() => { load(page); }, [page]);

  const openCreate = () => { setEditing(null); reset({}); setFormError(''); setModalOpen(true); };
  const openEdit = (p: Producto) => {
    setEditing(p);
    reset({
      nombre: p.nombre,
      descripcion: p.descripcion,
      unidadMedida: p.unidadMedida,
      precioCompra: p.precioCompra,
      precioVenta: p.precioVenta,
      stockMinimo: p.stockMinimo,
      categoriaId: p.categoriaId,
    });
    setFormError('');
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (data: ProductoRequest) => {
    setSaving(true);
    setFormError('');
    try {
      const payload = { ...data, precioCompra: Number(data.precioCompra), precioVenta: Number(data.precioVenta), stockMinimo: Number(data.stockMinimo), categoriaId: data.categoriaId ? Number(data.categoriaId) : undefined };
      if (editing) {
        await productosApi.update(editing.id, payload);
      } else {
        await productosApi.create(payload);
      }
      closeModal();
      load(page);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(msg || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar este producto?')) return;
    await productosApi.remove(id);
    load(page);
  };

  const columns: Column<Producto>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'categoriaNombre', label: 'Categoría' },
    { key: 'unidadMedida', label: 'Unidad' },
    {
      key: 'precioVenta',
      label: 'Precio Venta',
      render: (p) => `$${Number(p.precioVenta).toFixed(2)}`,
    },
    { key: 'stockActual', label: 'Stock' },
    { key: 'stockMinimo', label: 'Stock Mín.' },
    {
      key: 'activo',
      label: 'Estado',
      render: (p) => <Badge color={p.activo ? 'green' : 'gray'} text={p.activo ? 'Activo' : 'Inactivo'} />,
    },
    ...(isAdmin
      ? [{
          key: 'actions',
          label: '',
          render: (p: Producto) => (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(p)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(p.id)}>Eliminar</Button>
            </div>
          ),
        }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Productos</h2>
        {isAdmin && <Button onClick={openCreate}>+ Nuevo Producto</Button>}
      </div>

      <div className="flex gap-3">
        <input
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          placeholder="Buscar producto..."
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={catFiltro}
          onChange={(e) => setCatFiltro(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <Table columns={columns} data={productos} loading={loading} rowKey={(p) => p.id} />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
            ← Anterior
          </Button>
          <span className="text-gray-600">Página {page + 1} de {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            Siguiente →
          </Button>
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Editar Producto' : 'Nuevo Producto'} onClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <Input label="Nombre" error={errors.nombre?.message} {...register('nombre', { required: 'Obligatorio' })} />
          <Input label="Descripción" {...register('descripcion')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Unidad de Medida" placeholder="KG" {...register('unidadMedida', { required: 'Obligatorio' })} />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Categoría</label>
              <select className="rounded-md border border-gray-300 px-3 py-2 text-sm" {...register('categoriaId')}>
                <option value="">Sin categoría</option>
                {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <Input label="Precio Compra" type="number" step="0.01" min="0" {...register('precioCompra', { required: 'Obligatorio' })} />
            <Input label="Precio Venta" type="number" step="0.01" min="0" {...register('precioVenta', { required: 'Obligatorio' })} />
            <Input label="Stock Mínimo" type="number" step="0.01" min="0" {...register('stockMinimo')} />
          </div>
          {formError && <p className="text-sm text-red-600">{formError}</p>}
          <ModalFooter onCancel={closeModal} loading={saving} />
        </form>
      </Modal>
    </div>
  );
}
