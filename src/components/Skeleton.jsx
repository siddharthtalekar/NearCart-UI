// src/components/Skeleton.jsx — Loading skeleton screens

import styles from './Skeleton.module.css';

export function Skeleton({ width, height, borderRadius, className = '' }) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton height={160} borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
      <div className={styles.body}>
        <Skeleton height={18} width="70%" />
        <Skeleton height={14} width="50%" />
        <Skeleton height={14} width="60%" />
        <div className={styles.row}>
          <Skeleton height={28} width="80px" />
          <Skeleton height={28} width="80px" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.listItem}>
          <Skeleton width={48} height={48} borderRadius="var(--radius-md)" />
          <div className={styles.listBody}>
            <Skeleton height={16} width="60%" />
            <Skeleton height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonProductCard() {
  return (
    <div className={styles.productCard}>
      <Skeleton height={140} borderRadius="var(--radius-md)" />
      <div className={styles.body}>
        <Skeleton height={14} width="80%" />
        <Skeleton height={12} width="50%" />
        <Skeleton height={20} width="40%" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className={styles.text}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export default Skeleton;

