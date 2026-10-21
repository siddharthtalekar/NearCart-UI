// src/components/NotificationBell.jsx — Header notification dropdown

import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext.jsx';
import { timeAgo } from '../utils/helpers.js';
import { useNavigate } from 'react-router-dom';
import styles from './NotificationBell.module.css';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const ref = useRef(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = (n) => {
    markRead(n.id);
    if (n.orderId) navigate(`/customer/orders/${n.orderId}`);
    setOpen(false);
  };

  const typeIcon = (type) => {
    if (type === 'order_update') return '📦';
    if (type === 'offer') return '🎉';
    if (type === 'delivery') return '🛵';
    return '🔔';
  };

  const recent = notifications.slice(0, 8);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.bell}
        onClick={() => setOpen(o => !o)}
        aria-label={`${unreadCount} unread notifications`}
        aria-expanded={open}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <span className={styles.title}>Notifications</span>
            {unreadCount > 0 && (
              <button className={styles.markAll} onClick={markAllRead}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className={styles.list}>
            {recent.length === 0 ? (
              <div className={styles.empty}>No notifications yet</div>
            ) : (
              recent.map(n => (
                <div
                  key={n.id}
                  className={`${styles.item} ${!n.isRead ? styles.unread : ''}`}
                  onClick={() => handleClick(n)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleClick(n)}
                >
                  <span className={styles.itemIcon}>{typeIcon(n.type)}</span>
                  <div className={styles.itemBody}>
                    <p className={styles.itemTitle}>{n.title}</p>
                    <p className={styles.itemText}>{n.body}</p>
                    <p className={styles.itemTime}>{timeAgo(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className={styles.dot} />}
                </div>
              ))
            )}
          </div>

          {notifications.length > 8 && (
            <div className={styles.footer}>
              <button onClick={() => { navigate('/notifications'); setOpen(false); }}>
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
