import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { categoriasApi } from '../api/categorias.api';
import { useAuth } from '../context/AuthContext';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { Categoria, CategoriaRequest } from '../types/categoria.types';

export function CategoriasPage() {
  const { isAdmin } = useAuth();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoriaRequest>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await categoriasApi.getAll();
      setCategorias(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({}); setError(''); setModalOpen(true); };
  const openEdit = (c: Categoria) => { setEditing(c); reset({ nombre: c.nombre, descripcion: c.descripcion }); setError(''); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (data: CategoriaRequest) => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await categoriasApi.update(editing.id, data);
      } else {
        await categoriasApi.create(data);
      }
      closeModal();
      load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar esta categoría?')) return;
    await categoriasApi.remove(id);
    load();
  };

  const columns: Column<Categoria>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    {
      key: 'activa',
      label: 'Estado',
      render: (c) => <Badge color={c.activa ? 'green' : 'gray'} text={c.activa ? 'Activa' : 'Inactiva'} />,
    },
    ...(isAdmin
      ? [{
          key: 'actions',
          label: '',
          render: (c: Categoria) => (
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>Editar</Button>
              <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Eliminar</Button>
            </div>
          ),
        }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Categorías</h2>
        {isAdmin && <Button onClick={openCreate}>+ Nueva Categoría</Button>}
      </div>

      <Table columns={columns} data={categorias} loading={loading} rowKey={(c) => c.id} />

      <Modal open={modalOpen} title={editing ? 'Editar Categoría' : 'Nueva Categoría'} onClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nombre"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input label="Descripción" {...register('descripcion')} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ModalFooter onCancel={closeModal} loading={saving} />
        </form>
      </Modal>
    </div>
  );
}
