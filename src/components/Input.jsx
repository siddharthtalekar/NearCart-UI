// src/components/Input.jsx — Form input components
import styles from './Input.module.css';

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`${styles.group} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={styles.wrapper}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          id={inputId}
          className={`${styles.input} ${error ? styles.hasError : ''} ${
            leftIcon ? styles.withIconLeft : ''
          } ${rightIcon ? styles.withIconRight : ''}`}
          {...props}
        />
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  fullWidth = true,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`${styles.group} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`${styles.textarea} ${error ? styles.hasError : ''}`}
        {...props}
      />
      {error && <p className={styles.errorMsg}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  fullWidth = true,
  children,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`${styles.group} ${fullWidth ? styles.fullWidth : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          <span>{label}</span>
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <select
        id={inputId}
        className={`${styles.select} ${error ? styles.hasError : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
