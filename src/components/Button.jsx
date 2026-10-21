// src/components/Button.jsx
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconOnly = false,
  className = '',
  as: Tag = 'button',
  type = 'button',
  ...props
}) {
  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    loading ? styles.loading : '',
    iconOnly ? styles.iconOnly : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag type={Tag === 'button' ? type : undefined} className={cls} disabled={disabled || loading} {...props}>
      {loading && <span className={styles.loadingSpinner} />}
      {children}
    </Tag>
  );
}
