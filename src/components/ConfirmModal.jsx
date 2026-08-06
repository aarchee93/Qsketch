import { useEffect, useRef } from 'react';
import SketchButton from './SketchButton';

/**
 * Custom confirm dialog to replace window.confirm(), styled to match the
 * app's doodle aesthetic instead of a jarring native browser popup.
 * Rendered from dialogState produced by useConfirm().
 */
const ConfirmModal = ({ dialogState, onConfirm, onCancel }) => {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (dialogState && confirmBtnRef.current) {
      confirmBtnRef.current.focus();
    }
  }, [dialogState]);

  useEffect(() => {
    if (!dialogState) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [dialogState, onConfirm, onCancel]);

  if (!dialogState) return null;

  const {
    title = 'Are you sure?',
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    danger = false,
  } = dialogState;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in cursor-pointer"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="bg-white border-4 border-black rounded-xl p-6 shadow-[8px_8px_0_0_#000000] max-w-sm w-full animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-modal-title" className="text-xl font-extrabold mb-3">
          {title}
        </h3>
        {message && (
          <p id="confirm-modal-message" className="text-sm mb-6 whitespace-pre-line">
            {message}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <SketchButton onClick={onCancel} variant="outlined">
            {cancelLabel}
          </SketchButton>
          <SketchButton
            ref={confirmBtnRef}
            onClick={onConfirm}
            variant={danger ? 'inverted' : 'default'}
            className="font-extrabold"
          >
            {confirmLabel}
          </SketchButton>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
