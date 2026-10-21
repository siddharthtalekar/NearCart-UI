// src/components/Badge.jsx
import styles from './Badge.module.css';

const VARIANT_DOT = {
  success: styles.successDot,
  warning: styles.warningDot,
  error:   styles.errorDot,
  info:    styles.infoDot,
  neutral: styles.neutralDot,
};

export function Badge({ children, variant = 'neutral', size = 'sm', dot = false, solid, className = '' }) {
  const solidCls = solid ? styles[`solid-${variant}`] : styles[variant];
  const cls = [styles.badge, solidCls, styles[size], className].filter(Boolean).join(' ');
  return (
    <span className={cls}>
      {dot && <span className={`${styles.dot} ${VARIANT_DOT[variant] || ''}`} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    placed:     { variant: 'info',    label: 'Placed' },
    accepted:   { variant: 'info',    label: 'Accepted' },
    preparing:  { variant: 'warning', label: 'Preparing' },
    picked_up:  { variant: 'warning', label: 'Picked Up' },
    in_transit: { variant: 'warning', label: 'In Transit' },
    delivered:  { variant: 'success', label: 'Delivered' },
    cancelled:  { variant: 'error',   label: 'Cancelled' },
    pending:    { variant: 'warning', label: 'Pending' },
    approved:   { variant: 'success', label: 'Approved' },
    rejected:   { variant: 'error',   label: 'Rejected' },
    online:     { variant: 'success', label: 'Online' },
    offline:    { variant: 'neutral', label: 'Offline' },
    open:       { variant: 'success', label: 'Open Now' },
    closed:     { variant: 'neutral', label: 'Closed' },
  };
  const s = map[status] || { variant: 'neutral', label: status };
  return (
    <span className={`${styles.status} ${styles[s.variant]}`}>
      <span className={`${styles.dot} ${VARIANT_DOT[s.variant]}`} />
      {s.label}
    </span>
  );
}

// Default export for convenience
export default Badge;
