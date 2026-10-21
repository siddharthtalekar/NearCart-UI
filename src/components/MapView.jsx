// src/components/MapView.jsx — Map placeholder (wrappable for real map SDK)

import { MapPin, Navigation } from 'lucide-react';
import styles from './MapView.module.css';

/**
 * MapView placeholder — replace internals with Leaflet/Google Maps/Mapbox.
 * Props are the same contract a real map would need.
 */
export default function MapView({
  lat, lng, height = 240, pins = [], movingPin = null, showRoute = false, label, className = ''
}) {
  return (
    <div className={`${styles.map} ${className}`} style={{ height }} aria-label="Map view placeholder">
      {/* Decorative grid */}
      <div className={styles.grid} />

      {/* Simulated roads */}
      <svg className={styles.roads} viewBox="0 0 400 240" preserveAspectRatio="none">
        <line x1="0" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
        <line x1="200" y1="0"  x2="200" y2="240" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
        <line x1="0" y1="60"  x2="280" y2="180" stroke="rgba(255,255,255,0.1)"  strokeWidth="3" />
        <line x1="120" y1="0" x2="320" y2="240" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      </svg>

      {/* Static pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className={`${styles.pin} ${pin.type === 'store' ? styles.storePin : ''}`}
          style={{ left: `${20 + i * 18}%`, top: `${30 + (i % 3) * 20}%` }}
          title={pin.label}
        >
          <MapPin size={20} />
          {pin.label && <span className={styles.pinLabel}>{pin.label}</span>}
        </div>
      ))}

      {/* Moving pin (delivery) */}
      {movingPin && (
        <div className={`${styles.pin} ${styles.movingPin}`} style={{ left: '55%', top: '45%' }}>
          <Navigation size={20} />
        </div>
      )}

      {/* Center user pin */}
      <div className={`${styles.pin} ${styles.userPin}`} style={{ left: '50%', top: '50%' }}>
        <div className={styles.userDot} />
        <div className={styles.userPulse} />
      </div>

      {/* Label overlay */}
      <div className={styles.label}>
        <MapPin size={12} />
        {label || `${lat?.toFixed(4)}, ${lng?.toFixed(4)}`}
      </div>

      {/* Map provider note */}
      <div className={styles.placeholder}>Map placeholder — integrate Mapbox/Google Maps here</div>
    </div>
  );
}
