// src/hooks/useCountUp.js — Animated number counter hook
import { useState, useEffect, useRef } from 'react';

/**
 * Animates a number from 0 (or a start value) to `end` over `duration` ms.
 * Returns the current animated value as a number.
 */
export function useCountUp(end, duration = 1200, start = 0) {
  const [count, setCount] = useState(start);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (end === undefined || end === null) return;
    const numEnd = Number(end);
    if (isNaN(numEnd)) return;

    startTimeRef.current = null;

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + (numEnd - start) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, start]);

  return count;
}
