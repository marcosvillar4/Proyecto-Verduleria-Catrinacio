import { useEffect, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  width?: string;
}

export function Modal({ open, title, onClose, children, width = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full ${width} rounded-xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export function ModalFooter({
  onCancel,
  onConfirm,
  loading,
  confirmLabel = 'Guardar',
  confirmVariant = 'primary',
}: {
  onCancel: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
}) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
      <Button variant="secondary" onClick={onCancel} type="button">
        Cancelar
      </Button>
      <Button variant={confirmVariant} type={onConfirm ? 'button' : 'submit'} onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  );
}
