// src/layouts/CustomerLayout.jsx — Pure Desktop App Shell with Left Sidebar Menu
import { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  Store,
  Search,
  ShoppingCart,
  Package,
  User,
  MapPin,
  Tag,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
  Bell,
  Repeat,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useTheme } from '../hooks/useTheme.js';
import NotificationBell from '../components/NotificationBell.jsx';
import { subscriptionService } from '../services/subscriptionService.js';
import { formatCurrency, storage } from '../utils/helpers.js';
import styles from './CustomerLayout.module.css';

export default function CustomerLayout() {
  const { user, logout } = useAuth();
  const { itemCount, subtotal } = useCart();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [globalSearch, setGlobalSearch] = useState('');

  const currentAddress = storage.get('nc_delivery_location') || {
    label: 'Baner Road, Pune 411045',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/customer/search?q=${encodeURIComponent(globalSearch.trim())}`);
    }
  };

  return (
    <div className={styles.layout}>
      {/* ─────────────────────────────────────────────────────────────
          PURE DESKTOP LEFT SIDEBAR
          ───────────────────────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        {/* Brand Header */}
        <div className={styles.sidebarBrand}>
          <Link to="/customer" className={styles.brandLink}>
            <div className={styles.brandLogo}>🛒</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>NearCart</span>
              <span className={styles.brandTagline}>Hyperlocal · Pune</span>
            </div>
          </Link>

          <div className={styles.statusPill} title="Hyperlocal delivery active in Pune">
            <span className={styles.statusDot} />
            <span>15m</span>
          </div>
        </div>

        {/* Location Selector Card */}
        <Link
          to="/customer/location"
          className={styles.locationWidget}
          title="Click to change your delivery location"
        >
          <div className={styles.locationIconBox}>
            <MapPin size={15} />
          </div>
          <div className={styles.locationInfo}>
            <span className={styles.locationLabel}>Deliver to</span>
            <span className={styles.locationText}>{currentAddress.label}</span>
          </div>
          <span className={styles.locationArrow}>›</span>
        </Link>

        {/* Navigation Sections */}
        <div className={styles.navSection}>
          {/* Group 1: Shopping & Discovery */}
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>DISCOVER</span>

            <NavLink
              to="/customer"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><Store size={17} /></span>
              <span className={styles.navItemLabel}>Explore Stores</span>
            </NavLink>

            <NavLink
              to="/customer/search"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><Search size={17} /></span>
              <span className={styles.navItemLabel}>Product Catalog</span>
            </NavLink>

            <NavLink
              to="/customer/search?offers=true"
              className={({ isActive }) =>
                `${styles.navItem} ${
                  location.search.includes('offers') ? styles.navItemActive : ''
                }`
              }
            >
              <span className={styles.navItemIcon}><Tag size={17} /></span>
              <span className={styles.navItemLabel}>Deals & Offers</span>
              <span className={styles.navBadge}>Hot</span>
            </NavLink>

            <NavLink
              to="/customer/pharmacy-prescription"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><FileText size={17} /></span>
              <span className={styles.navItemLabel}>Upload Prescription</span>
              <span className={styles.rxBadge}>Rx 15m</span>
            </NavLink>
          </div>

          {/* Group 2: Orders & Activity */}
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>MY ACTIVITY</span>

            <NavLink
              to="/customer/auto-booking"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><Repeat size={17} /></span>
              <span className={styles.navItemLabel}>Daily Auto-Booking</span>
              <span className={styles.autoBookingBadge}>Daily</span>
            </NavLink>

            <NavLink
              to="/customer/cart"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><ShoppingCart size={17} /></span>
              <span className={styles.navItemLabel}>My Cart</span>
              {itemCount > 0 ? (
                <span className={styles.cartPillBadge}>
                  {itemCount} · {formatCurrency(subtotal)}
                </span>
              ) : null}
            </NavLink>

            <NavLink
              to="/customer/orders"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><Package size={17} /></span>
              <span className={styles.navItemLabel}>Order History</span>
            </NavLink>

            <NavLink
              to="/customer/location"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><MapPin size={17} /></span>
              <span className={styles.navItemLabel}>Delivery Zones</span>
            </NavLink>
          </div>

          {/* Group 3: Account */}
          <div className={styles.navGroup}>
            <span className={styles.navGroupTitle}>ACCOUNT</span>

            <NavLink
              to="/customer/profile"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><User size={17} /></span>
              <span className={styles.navItemLabel}>Profile & Settings</span>
            </NavLink>

            <NavLink
              to="/notifications"
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <span className={styles.navItemIcon}><Bell size={17} /></span>
              <span className={styles.navItemLabel}>Notifications</span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Footer with User Card & Theme Switcher */}
        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>{user?.name || 'Priya Sharma'}</span>
              <span className={styles.userRole}>Shopper · Baner</span>
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
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <span className={styles.supportText}>v2.4 Desktop</span>
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CONTENT AREA (WITH TOP UTILITY BAR)
          ───────────────────────────────────────────────────────────── */}
      <div className={styles.mainWrapper}>
        {/* Top Utility Bar */}
        <header className={styles.topBar}>
          <form onSubmit={handleSearchSubmit} className={styles.topBarSearch}>
            <Search size={16} className={styles.topBarSearchIcon} />
            <input
              type="text"
              placeholder="Search local stores, groceries, medicines, snacks..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className={styles.topBarSearchInput}
            />
          </form>

          <div className={styles.topBarRight}>
            <div className={styles.promiseBadge}>
              <Zap size={14} style={{ fill: 'currentColor' }} />
              <span>15-Min Delivery Guarantee</span>
            </div>

            <NotificationBell />

            {/* Quick Cart Action Button */}
            <Link to="/customer/cart" className={styles.topBarCartBtn} title="View Cart">
              <ShoppingCart size={15} />
              <span>{itemCount > 0 ? formatCurrency(subtotal) : 'Cart'}</span>
              {itemCount > 0 && (
                <span className={styles.cartCountBubble}>{itemCount}</span>
              )}
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
