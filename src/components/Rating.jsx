// src/components/Rating.jsx — Star rating display

import { Star } from 'lucide-react';
import styles from './Rating.module.css';

export default function Rating({ value = 0, count, size = 14, showValue = true }) {
  const stars = Math.round(value * 2) / 2; // round to nearest 0.5
  return (
    <span className={styles.wrapper}>
      <span className={styles.stars}>
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            size={size}
            className={`${styles.star} ${i <= stars ? styles.filled : i - 0.5 <= stars ? styles.half : styles.empty}`}
          />
        ))}
      </span>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
      {count !== undefined && <span className={styles.count}>({count})</span>}
    </span>
  );
}
