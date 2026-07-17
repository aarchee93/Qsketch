import { useState, useEffect } from 'react';

/**
 * Toast Notification Component
 * Displays temporary notifications (success, error, info)
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-white border-black text-black',
    error: 'bg-white border-black text-black',
    info: 'bg-white border-black text-black',
    warning: 'bg-white border-black text-black',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 max-w-sm p-4 border-2 rounded-lg shadow-lg animate-slide-in z-50 ${bgColor}`}
      role="alert"
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold">{icon}</span>
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
};

/**
 * Toast Manager Hook
 * Manages multiple toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toasts, showToast, removeToast };
};

/**
 * Toast Container Component
 * Renders all active toasts
 */
export const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Toast;
