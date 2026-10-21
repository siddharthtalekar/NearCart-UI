// src/components/Tabs.jsx
import styles from './Tabs.module.css';

export function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`${styles.tabsContainer} ${className}`} role="tablist">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span className={`${styles.badge} ${isActive ? styles.badgeActive : ''}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
