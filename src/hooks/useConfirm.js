import { useCallback, useRef, useState } from 'react';

/**
 * Promise-based confirm dialog, replacing window.confirm().
 * Usage: const ok = await requestConfirm({ title, message }); if (ok) { ... }
 * Purely in-memory — no storage, resolves/rejects and forgets.
 */
export const useConfirm = () => {
  const [dialogState, setDialogState] = useState(null); // { title, message, confirmLabel, cancelLabel, danger }
  const resolveRef = useRef(null);

  const requestConfirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setDialogState(options);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolveRef.current) resolveRef.current(true);
    setDialogState(null);
  }, []);

  const handleCancel = useCallback(() => {
    if (resolveRef.current) resolveRef.current(false);
    setDialogState(null);
  }, []);

  return { dialogState, requestConfirm, handleConfirm, handleCancel };
};
