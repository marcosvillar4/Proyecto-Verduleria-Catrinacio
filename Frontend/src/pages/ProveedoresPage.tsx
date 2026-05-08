import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { proveedoresApi } from '../api/proveedores.api';
import { useAuth } from '../context/AuthContext';
import { Table, type Column } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal, ModalFooter } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { Proveedor, ProveedorRequest } from '../types/proveedor.types';

export function ProveedoresPage() {
  const { isAdmin } = useAuth();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Proveedor | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProveedorRequest>();

  const load = async () => {
    setLoading(true);
    try {
      const res = await proveedoresApi.getAll();
      setProveedores(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); reset({}); setError(''); setModalOpen(true); };
  const openEdit = (p: Proveedor) => {
    setEditing(p);
    reset({ nombre: p.nombre, contacto: p.contacto, telefono: p.telefono, email: p.email, direccion: p.direccion });
    setError('');
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const onSubmit = async (data: ProveedorRequest) => {
    setSaving(true);
    setError('');
    try {
      if (editing) {
        await proveedoresApi.update(editing.id, data);
      } else {
        await proveedoresApi.create(data);
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
    if (!confirm('¿Desactivar este proveedor?')) return;
    await proveedoresApi.remove(id);
    load();
  };

  const columns: Column<Proveedor>[] = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'contacto', label: 'Contacto' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'email', label: 'Email' },
    {
      key: 'activo',
      label: 'Estado',
      render: (p) => <Badge color={p.activo ? 'green' : 'gray'} text={p.activo ? 'Activo' : 'Inactivo'} />,
    },
    ...(isAdmin
      ? [{
          key: 'actions',
          label: '',
          render: (p: Proveedor) => (
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
        <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
        {isAdmin && <Button onClick={openCreate}>+ Nuevo Proveedor</Button>}
      </div>

      <Table columns={columns} data={proveedores} loading={loading} rowKey={(p) => p.id} />

      <Modal open={modalOpen} title={editing ? 'Editar Proveedor' : 'Nuevo Proveedor'} onClose={closeModal}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input label="Nombre" error={errors.nombre?.message} {...register('nombre', { required: 'El nombre es obligatorio' })} />
          <Input label="Contacto" {...register('contacto')} />
          <Input label="Teléfono" {...register('telefono')} />
          <Input label="Email" type="email" {...register('email')} />
          <Input label="Dirección" {...register('direccion')} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <ModalFooter onCancel={closeModal} loading={saving} />
        </form>
      </Modal>
    </div>
  );
}
