// src/layouts/PublicLayout.jsx — Premium Landing & Auth Shell
import { Link, Outlet, NavLink } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme.js';
import Button from '../components/Button.jsx';
import styles from './PublicLayout.module.css';

export default function PublicLayout({ children }) {
  const { theme, toggle } = useTheme();
  return (
    <div className={styles.layout}>
      {/* Sticky Glass Navbar */}
      <header className={styles.navbar}>
        <div className={styles.navInner}>
          {/* Brand */}
          <Link to="/" className={styles.brand}>
            <div className={styles.brandMark}>🛒</div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>NearCart</span>
              <span className={styles.brandTag}>Hyperlocal · Pune</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className={styles.navLinks}>
            <Link to="/customer" className={styles.navLink}>Explore Stores</Link>
            <Link to="/login" className={styles.navLink}>Sign In</Link>
          </nav>

          {/* Actions */}
          <div className={styles.navActions}>
            <button className={styles.themeBtn} onClick={toggle} aria-label="Toggle theme" title="Toggle theme">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Button as={Link} to="/register" variant="primary" size="sm">
              <Zap size={14} />
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className={styles.content}>
        {children || <Outlet />}
      </main>
    </div>
  );
}
