// src/pages/auth/LandingPage.jsx — Premium Redesign
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Sparkles, ArrowRight, ShoppingBag, Store,
  Bike, Clock, ShieldCheck, CheckCircle2, Zap, Star, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import styles from './LandingPage.module.css';

const ROLE_CARDS = [
  {
    id: 'customer',
    icon: '🛍️',
    iconCls: styles.iconCustomer,
    cardCls: styles.roleCardCustomer,
    title: 'For Shoppers',
    desc: 'Browse neighborhood stores, compare real-time prices, and get essentials delivered in minutes.',
    features: ['Real-time price comparison', 'Live order tracking', 'Hyperlocal delivery 15–45 min'],
    href: '/customer',
    linkText: 'Start Shopping',
  },
  {
    id: 'owner',
    icon: '🏪',
    iconCls: styles.iconOwner,
    cardCls: styles.roleCardOwner,
    title: 'For Shop Owners',
    desc: 'Take your local store digital. Manage catalog, accept orders, and track earnings — all in one dashboard.',
    features: ['Kanban order management', 'Inventory & promo tools', 'Recharts analytics'],
    href: '/register?role=owner',
    linkText: 'Register Store',
  },
  {
    id: 'delivery',
    icon: '🛵',
    iconCls: styles.iconDelivery,
    cardCls: styles.roleCardDelivery,
    title: 'For Delivery Partners',
    desc: 'Earn flexible income delivering from stores in your local neighborhood on your own schedule.',
    features: ['Online / offline toggle', 'Live assignment requests', 'Daily earnings dashboard'],
    href: '/register?role=delivery',
    linkText: 'Partner With Us',
  },
];

const STEPS = [
  { n: '01', title: 'Set Delivery Location', desc: 'Choose your address or auto-detect your local shopping cluster in Baner, Aundh, or Hinjewadi.' },
  { n: '02', title: 'Discover Nearby Stores', desc: 'Explore grocery, pharmacy, organic, and retail shops within a 5 km radius.' },
  { n: '03', title: 'Compare Store Prices', desc: 'View identical items side-by-side across all local stores to get the best deal.' },
  { n: '04', title: 'Place Validated Order', desc: 'Real-time stock check with transparent fee breakdown before you pay.' },
  { n: '05', title: 'Store Packs Fresh', desc: 'Your merchant confirms, picks, and freshly packs your items within minutes.' },
  { n: '06', title: 'Doorstep Delivery', desc: 'A local courier delivers directly to your door with GPS tracking and OTP verification.' },
];

const TRUST = [
  { icon: <Clock size={22} />, title: '15 – 45 Min Deliveries', desc: 'From stores right down your street, not distant warehouses or dark stores.' },
  { icon: <CheckCircle2 size={22} />, title: '100% Genuine Products', desc: 'Verified neighbourhood merchants with a real physical store presence.' },
  { icon: <ShieldCheck size={22} />, title: 'Fair & Transparent Fees', desc: 'Zero hidden charges. Itemised tax, delivery fee, and GST receipts.' },
];

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { demoLogin } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/customer/search?q=${encodeURIComponent(query.trim())}` : '/customer');
  };

  const handleDemo = async (role) => {
    await demoLogin(role);
    const routes = { customer: '/customer', owner: '/owner', delivery: '/delivery', admin: '/admin' };
    navigate(routes[role] || '/');
  };

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden />
        <div className={styles.blob1} aria-hidden />
        <div className={styles.blob2} aria-hidden />
        <div className={styles.blob3} aria-hidden />

        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <Sparkles size={12} />
            Hyperlocal Marketplace · Pune, Maharashtra
          </div>

          <h1 className={styles.heroTitle}>
            Your Neighborhood Stores,{' '}
            <span className={styles.gradientPrimary}>Delivered</span>{' '}
            <span className={styles.gradientEmerald}>in Minutes.</span>
          </h1>

          <p className={styles.heroSub}>
            Shop groceries, medicines, electronics &amp; daily essentials from trusted local merchants. Compare prices across stores and get same-street delivery.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className={styles.searchBox}>
            <div className={styles.locationPill}>
              <MapPin size={15} className={styles.locationPin} />
              Baner, Pune
            </div>
            <Search size={17} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search products, brands, or nearby stores..."
              className={styles.searchInput}
            />
            <Button type="submit" variant="primary" size="lg" className={styles.searchBtn}>
              Find Nearby
            </Button>
          </form>

          {/* Demo login pills */}
          <div className={styles.demoBar}>
            <span className={styles.demoLabel}>⚡ INSTANT DEMO —</span>
            <div className={styles.demoList}>
              {[
                { role: 'customer', emoji: '👤', label: 'Customer' },
                { role: 'owner',    emoji: '🏪', label: 'Store Owner' },
                { role: 'delivery', emoji: '🛵', label: 'Delivery Partner' },
                { role: 'admin',    emoji: '⚡', label: 'Platform Admin' },
              ].map(d => (
                <button key={d.role} type="button" onClick={() => handleDemo(d.role)} className={styles.demoPill}>
                  {d.emoji} {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className={styles.statsRow}>
            {[
              { num: '60+', label: 'Local Products' },
              { num: '28', label: 'Partner Stores' },
              { num: '45', label: 'Delivery Partners' },
              { num: '4.8★', label: 'Average Rating' },
            ].map((s, i) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
                {i > 0 && <div className={styles.statDivider} />}
                <div className={styles.stat}>
                  <span className={styles.statNum}>{s.num}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Cards ── */}
      <section className={styles.rolesSection}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <span className={styles.sectionTag}><Star size={11} /> Platform Roles</span>
          <h2 className={styles.sectionTitle}>Built for Every Part of the Ecosystem</h2>
          <p className={styles.sectionSub}>
            NearCart connects customers, neighborhood stores, and delivery partners in one seamless platform.
          </p>
        </div>
        <div className={styles.rolesGrid}>
          {ROLE_CARDS.map(r => (
            <div key={r.id} className={`${styles.roleCard} ${r.cardCls}`}>
              <div className={`${styles.roleIconWrap} ${r.iconCls}`}>{r.icon}</div>
              <h3 className={styles.roleTitle}>{r.title}</h3>
              <p className={styles.roleDesc}>{r.desc}</p>
              <div className={styles.roleFeatures}>
                {r.features.map(f => (
                  <div key={f} className={styles.roleFeature}>
                    <div className={styles.featureDot} />
                    {f}
                  </div>
                ))}
              </div>
              <Link to={r.href} className={styles.roleLink}>
                {r.linkText} <ArrowRight size={15} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.howSection}>
        <div className={styles.howInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}><Zap size={11} /> Simple Process</span>
            <h2 className={styles.sectionTitle} style={{ marginTop: 'var(--space-4)' }}>How NearCart Works</h2>
            <p className={styles.sectionSub}>
              Seamless hyperlocal commerce in 6 straightforward steps — from discovery to doorstep.
            </p>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map(s => (
              <div key={s.n} className={styles.stepCard}>
                <span className={styles.stepNum}>{s.n}</span>
                <h4 className={styles.stepTitle}>{s.title}</h4>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          {TRUST.map(t => (
            <div key={t.title} className={styles.trustCard}>
              <div className={styles.trustIcon}>{t.icon}</div>
              <div className={styles.trustText}>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} aria-hidden />
        <h2 className={styles.ctaTitle}>Ready to Shop Local?</h2>
        <p className={styles.ctaSub}>Join thousands of Pune residents already shopping smarter with NearCart.</p>
        <div className={styles.ctaBtns}>
          <Button as={Link} to="/customer" size="lg" className={styles.ctaBtnWhite}>
            <ShoppingBag size={18} /> Start Shopping
          </Button>
          <Button as={Link} to="/register" size="lg" className={styles.ctaBtnOutline}>
            Register Your Store <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoMark}>🛒</div>
                <span className={styles.footerLogoName}>NearCart</span>
              </div>
              <p className={styles.footerTagline}>
                Hyperlocal marketplace for Pune connecting neighbourhood stores, shoppers, and local couriers.
              </p>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Platform</span>
              <Link to="/customer" className={styles.footerLink}>Browse Stores</Link>
              <Link to="/login" className={styles.footerLink}>Customer Login</Link>
              <Link to="/register?role=owner" className={styles.footerLink}>Register Store</Link>
              <Link to="/register?role=delivery" className={styles.footerLink}>Become Partner</Link>
            </div>
            <div className={styles.footerCol}>
              <span className={styles.footerColTitle}>Support</span>
              <a href="mailto:support@nearcart.in" className={styles.footerLink}>support@nearcart.in</a>
              <span className={styles.footerLink}>+91 1800-000-0001</span>
              <span className={styles.footerLink}>Baner, Pune 411045</span>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2024 NearCart Technologies. All rights reserved. Pune, Maharashtra.</span>
            <span>Hyperlocal Commerce Platform</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
