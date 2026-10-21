// src/pages/auth/NotificationsPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Package, Tag, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext.jsx';
import Button from '../../components/Button.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatDate } from '../../utils/helpers.js';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'order_status':
        return <Package size={20} color="var(--color-primary)" />;
      case 'offer':
        return <Tag size={20} color="var(--color-accent)" />;
      case 'dispute':
        return <AlertCircle size={20} color="var(--color-error)" />;
      default:
        return <Info size={20} color="var(--color-info)" />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>Notifications</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Real-time order stage updates, offers, and alerts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck size={16} /> Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 size={16} /> Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '20px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            borderBottom: filter === 'all' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: filter === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: filter === 'all' ? 'var(--font-semibold)' : 'var(--font-normal)',
          }}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 16px',
            borderBottom: filter === 'unread' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: filter === 'unread' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            fontWeight: filter === 'unread' ? 'var(--font-semibold)' : 'var(--font-normal)',
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Bell size={48} />}
          title={filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          description="We will notify you here when your orders change status or new local deals arrive."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: item.isRead ? 'var(--color-surface)' : 'var(--color-primary-50)',
                border: '1px solid var(--color-border)',
                transition: 'background var(--transition-fast)',
                cursor: 'pointer',
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon(item.type)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: item.isRead ? 'var(--font-medium)' : 'var(--font-bold)', color: 'var(--color-text-primary)' }}>
                    {item.title}
                  </h4>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
                  {item.message}
                </p>
                {item.link && (
                  <Link
                    to={item.link}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-primary)',
                      marginTop: '8px',
                      fontWeight: 'var(--font-semibold)',
                    }}
                  >
                    View Details <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
