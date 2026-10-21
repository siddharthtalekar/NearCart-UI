// src/components/QuantityStepper.jsx — Quantity +/- control

import { Minus, Plus } from 'lucide-react';
import styles from './QuantityStepper.module.css';

export default function QuantityStepper({ value, min = 0, max, onChange, size = 'md' }) {
  const dec = () => { if (value > min) onChange(value - 1); };
  const inc = () => { if (!max || value < max) onChange(value + 1); };
  const atMax = max && value >= max;
  const atMin = value <= min;

  return (
    <div className={`${styles.stepper} ${styles[size]}`}>
      <button
        className={styles.btn}
        onClick={dec}
        disabled={atMin}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 14} />
      </button>
      <span className={styles.value}>{value}</span>
      <button
        className={styles.btn}
        onClick={inc}
        disabled={atMax}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 14} />
      </button>
    </div>
  );
}
