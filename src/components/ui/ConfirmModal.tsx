import { Fragment, useRef } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmButtonClass?: string;
  isSubmitting?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmButtonClass = 'bg-primary-600 hover:bg-primary-700',
  isSubmitting = false,
  onConfirm,
  onCancel
}: ConfirmModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  return (
    <Fragment>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
        <div
          ref={modalRef}
          className="relative bg-white rounded-lg w-full max-w-md mx-4 shadow-xl"
        >
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{message}</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-white rounded-md ${confirmButtonClass} ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={onConfirm}
                disabled={isSubmitting}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmModal;