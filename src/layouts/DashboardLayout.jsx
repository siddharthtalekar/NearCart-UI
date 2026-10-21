// src/layouts/DashboardLayout.jsx — Pure Desktop Sidebar Shell for Merchant, Delivery & Admin
import { useState } from 'react';
import { NavLink, useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogOut,
  Store,
  Bike,
  ShieldCheck,
  Zap,
  Activity,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import NotificationBell from '../components/NotificationBell.jsx';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ navItems, brandLabel, brandIcon = '🛒' }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Contextual info for the role
  const getContextWidget = () => {
    if (brandLabel === 'Owner') {
      return {
        icon: <Store size={15} style={{ color: 'var(--color-primary-600)' }} />,
        label: 'ACTIVE STORE',
        value: user?.storeName || 'Fresh Basket (Baner)',
      };
    }
    if (brandLabel === 'Delivery') {
      return {
        icon: <Bike size={15} style={{ color: 'var(--color-amber-600)' }} />,
        label: 'DISPATCH FLEET',
        value: 'Zone: Baner-Aundh (3km)',
      };
    }
    return {
      icon: <ShieldCheck size={15} style={{ color: 'var(--color-emerald-600)' }} />,
      label: 'SYSTEM HEALTH',
      value: 'Pune Hub · 99.9% Uptime',
    };
  };

  const contextData = getContextWidget();

  const getStatusText = () => {
    if (brandLabel === 'Owner') return 'Store Live';
    if (brandLabel === 'Delivery') return 'On Duty';
    return 'Active';
  };

  return (
    <div className={styles.layout}>
      {/* ─────────────────────────────────────────────────────────────
          PURE DESKTOP SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Brand Header */}
        <div className={styles.sidebarBrand}>
          <Link to="/" className={styles.brandLink}>
            <div className={styles.brandMark}>{brandIcon}</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>NearCart</span>
              <span className={styles.brandBadge}>{brandLabel} Portal</span>
            </div>
          </Link>

          <div className={styles.statusPill} title="Live hyperlocal operational status">
            <span className={styles.statusDot} />
            <span>{getStatusText()}</span>
          </div>
        </div>

        {/* Role Context Widget */}
        <div className={styles.roleContextWidget}>
          <div className={styles.contextIconBox}>{contextData.icon}</div>
          <div className={styles.contextInfo}>
            <span className={styles.contextLabel}>{contextData.label}</span>
            <span className={styles.contextValue}>{contextData.value}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          {navItems.map((item) =>
            item.divider ? (
              <div key={item.key || item.label} className={styles.navDivider}>
                {item.label}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
              </NavLink>
            )
          )}
        </nav>

        {/* Sidebar Footer with User Card & Theme Toggle */}
        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || brandLabel?.[0] || 'U'}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || `${brandLabel} Partner`}</span>
              <span className={styles.userRole}>{user?.role || brandLabel}</span>
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>

          <div className={styles.footerControls}>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggle}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <span className={styles.supportText}>v2.4 Desktop</span>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (WITH TOP UTILITY BAR)
          ───────────────────────────────────────────────────────────── */}
      <div className={styles.main}>
        {/* Top Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.portalTitle}>NearCart {brandLabel} Management</span>
            <span className={styles.portalTag}>Pune City Operations</span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.liveSlaBadge}>
              <Zap size={13} style={{ fill: 'currentColor' }} />
              <span>Telemetry Active</span>
            </div>

            <NotificationBell />

            <button
              type="button"
              className={styles.iconBtn}
              onClick={toggle}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
