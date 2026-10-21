// src/components/Card.jsx
import styles from './Card.module.css';

export default function Card({ children, hoverable, flat, elevated, glass, style, className = '', ...props }) {
  const cls = [
    styles.card,
    hoverable ? styles.hoverable : '',
    flat ? styles.flat : '',
    elevated ? styles.elevated : '',
    glass ? styles.glass : '',
    className,
  ].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...props}>{children}</div>;
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`${styles.cardHeader} ${className}`}>
      <div className={styles.cardHeaderText}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, noPad, style, className = '' }) {
  return (
    <div className={`${noPad ? styles.cardBodyNoPad : styles.cardBody} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return <div className={`${styles.cardFooter} ${className}`}>{children}</div>;
}
