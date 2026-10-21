// src/components/EmptyState.jsx

import styles from './EmptyState.module.css';
import Button from './Button.jsx';

export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className={styles.wrapper}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      {action && actionLabel && (
        <Button variant="primary" size="md" onClick={action} style={{ marginTop: 'var(--space-4)' }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
