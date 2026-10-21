// src/components/Modal.jsx — Modal dialog component

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Button from './Button.jsx';
import styles from './Modal.module.css';

/**
 * Accessible modal dialog.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {string} [props.title]
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 */
export default function Modal({ isOpen, onClose, title, children, size = 'md', hideClose = false }) {
  const dialogRef = useRef(null);

  // Focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current;
    if (el) el.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className={`${styles.modal} ${styles[size]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        ref={dialogRef}
        tabIndex={-1}
      >
        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>{title}</h2>
            {!hideClose && (
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
                <X size={20} />
              </button>
            )}
          </div>
        )}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

/** Confirmation modal helper */
export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', confirmVariant = 'danger', isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        <Button variant={confirmVariant} size="sm" loading={isLoading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
