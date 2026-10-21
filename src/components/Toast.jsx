// src/components/Toast.jsx — Toast notification system

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

const ToastContext = createContext(null);

function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD': return [...state, action.payload];
    case 'REMOVE': return state.filter(t => t.id !== action.payload);
    default: return state;
  }
}

let _toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++_toastId;
    dispatch({ type: 'ADD', payload: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => dispatch({ type: 'REMOVE', payload: id }), []);

  const toast = {
    success: (msg, opts) => addToast({ message: msg, type: 'success', ...opts }),
    error:   (msg, opts) => addToast({ message: msg, type: 'error',   ...opts }),
    warning: (msg, opts) => addToast({ message: msg, type: 'warning', ...opts }),
    info:    (msg, opts) => addToast({ message: msg, type: 'info',    ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.container} role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ id, message, type, onClose }) {
  const icons = {
    success: <CheckCircle size={18} />,
    error:   <XCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info:    <Info size={18} />,
  };

  return (
    <div className={`${styles.toast} ${styles[type]}`} role="alert">
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
