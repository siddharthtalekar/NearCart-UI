// src/pages/auth/AuthPage.jsx — Pure Desktop Split-Screen Auth
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Bike,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Check,
  Sparkles,
  ArrowLeft,
  Briefcase,
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../hooks/useTheme.js';
import Button from '../../components/Button.jsx';
import { Input, Select } from '../../components/Input.jsx';
import styles from './AuthPage.module.css';

// ── Role Specific Convincing Content & Configurations ──
const ROLE_DATA = {
  customer: {
    key: 'customer',
    title: 'Customer',
    badge: 'Hyperlocal Quick Commerce',
    headline: 'Fresh Groceries & Daily Essentials from Local Shops.',
    headlineHighlight: 'Delivered in 15 Minutes.',
    description:
      'Experience the comfort of ordering directly from your trusted neighborhood kiranas, fresh produce stalls, and pharmacies across Pune with real-time GPS tracking and zero surge pricing.',
    icon: ShoppingBag,
    cardClass: styles.customerCard,
    roleClass: styles.customerRole,
    benefits: [
      {
        icon: '⚡',
        title: 'Hyperlocal 15-Min Delivery',
        desc: 'Dispatched from stores within 2-3 km of your doorstep.',
      },
      {
        icon: '🏪',
        title: 'Direct Store Retail Prices',
        desc: 'Zero marked-up prices. Enjoy authentic retail rates and local offers.',
      },
      {
        icon: '📍',
        title: 'Live Precision GPS Tracking',
        desc: 'Follow your rider in real time from store counter to your home.',
      },
      {
        icon: '🛡️',
        title: '100% Freshness Guarantee',
        desc: 'Inspected fresh produce or instant replacement on the spot.',
      },
    ],
    stats: [
      { value: '15 Mins', label: 'Avg Delivery Time' },
      { value: '500+', label: 'Stores in Pune' },
      { value: '4.9 ★', label: 'Customer Rating' },
    ],
    trustText: 'Trusted by 45,000+ happy households in Baner, Kothrud & Viman Nagar',
    demoEmail: 'customer@demo.com',
    demoPassword: 'demo1234',
    formSignInTitle: 'Customer Sign In',
    formSignUpTitle: 'Create Customer Account',
    formSubtitle: 'Order fresh groceries and essentials from stores near you.',
  },

  owner: {
    key: 'owner',
    title: 'Shop Owner',
    badge: 'Merchant Growth Platform',
    headline: 'Transform Your Physical Retail Store into a 24/7 Digital Hub.',
    headlineHighlight: '0% Commission Onboarding.',
    description:
      'Take your local grocery, pharmacy, or specialty shop online. Expand your customer base across Pune, receive instant orders, automate billing, and leverage on-demand delivery couriers.',
    icon: Store,
    cardClass: styles.ownerCard,
    roleClass: styles.ownerRole,
    benefits: [
      {
        icon: '📈',
        title: '0% Platform Commission',
        desc: 'Keep 100% of your retail margins with zero hidden fees.',
      },
      {
        icon: '📦',
        title: 'Real-Time Inventory & Barcode POS',
        desc: 'Effortlessly update items, stock levels, and daily special offers.',
      },
      {
        icon: '🚴',
        title: 'Instant On-Demand Delivery Fleet',
        desc: 'Riders arrive at your store the moment orders are packed.',
      },
      {
        icon: '💳',
        title: 'Guaranteed Daily T+1 Bank Payouts',
        desc: 'Direct bank settlement with automated GST compliance invoices.',
      },
    ],
    stats: [
      { value: '3.2x', label: 'Average Revenue Boost' },
      { value: '0%', label: 'Onboarding Fee' },
      { value: '10,000+', label: 'Active Neighborhood Buyers' },
    ],
    trustText: 'Partnered with 500+ local retail stores & supermarkets across Pune',
    demoEmail: 'owner@demo.com',
    demoPassword: 'demo1234',
    formSignInTitle: 'Store Owner Portal',
    formSignUpTitle: 'Register Your Shop',
    formSubtitle: 'Manage inventory, accept incoming orders, and track your daily revenue.',
  },

  delivery: {
    key: 'delivery',
    title: 'Delivery Partner',
    badge: 'Fleet Partner Network',
    headline: 'Deliver in Your Neighborhood & Earn Daily with Total Freedom.',
    headlineHighlight: 'Short Trips, High Earnings.',
    description:
      'Join Pune’s premier hyperlocal delivery fleet. Pick up from verified neighborhood stores and deliver within a comfortable 2-3 km radius with transparent per-order payouts and instant withdrawals.',
    icon: Bike,
    cardClass: styles.deliveryCard,
    roleClass: styles.deliveryRole,
    benefits: [
      {
        icon: '💰',
        title: 'High Per-Trip Pay + 100% Tips',
        desc: 'Keep every rupee of tips with competitive base rates and surge bonuses.',
      },
      {
        icon: '🗺️',
        title: 'Hyperlocal 2-3 KM Radius Only',
        desc: 'No long exhausting citywide trips. Stay close to your preferred area.',
      },
      {
        icon: '🛡️',
        title: '₹5 Lakh Comprehensive Insurance',
        desc: 'Active accidental and medical cover from your very first delivery.',
      },
      {
        icon: '⚡',
        title: 'Instant UPI Payout Withdrawals',
        desc: 'Cash out your daily earnings directly to Google Pay or PhonePe anytime.',
      },
    ],
    stats: [
      { value: '₹800-₹1.5k', label: 'Daily Earning Potential' },
      { value: '< 3 km', label: 'Avg Delivery Distance' },
      { value: 'Instant', label: 'Daily UPI Settlements' },
    ],
    trustText: 'Over 1,200 verified riders delivering safely across Pune daily',
    demoEmail: 'delivery@demo.com',
    demoPassword: 'demo1234',
    formSignInTitle: 'Rider Partner Login',
    formSignUpTitle: 'Join Delivery Fleet',
    formSubtitle: 'Go online, accept orders, and earn with flexible shifts.',
  },

  admin: {
    key: 'admin',
    title: 'Platform Admin',
    badge: 'System Control Center',
    headline: 'Citywide Hyperlocal Delivery Operations & Governance.',
    headlineHighlight: 'Enterprise Telemetry.',
    description:
      'Master command interface for managing store approvals, delivery partner onboarding, order SLA disputes, and citywide logistics dispatch across Pune.',
    icon: ShieldCheck,
    cardClass: styles.adminCard,
    roleClass: styles.adminRole,
    benefits: [
      {
        icon: '🛡️',
        title: 'Merchant & Rider Verification Desk',
        desc: 'Approve FSSAI certificates, licenses, and store documentation.',
      },
      {
        icon: '📊',
        title: 'Real-Time Fleet & Order Telemetry',
        desc: 'Monitor delivery latency, heatmaps, and platform health.',
      },
      {
        icon: '⚠️',
        title: 'Dispute Resolution & Fraud Prevention',
        desc: 'Instant refund approvals, customer mediation, and security controls.',
      },
    ],
    stats: [
      { value: '99.9%', label: 'Platform Uptime' },
      { value: '18', label: 'Active Pune Zones' },
      { value: '14 ms', label: 'Dispatch Telemetry' },
    ],
    trustText: 'Restricted administrative credentials required for platform access',
    demoEmail: 'admin@demo.com',
    demoPassword: 'demo1234',
    formSignInTitle: 'Platform Administrator',
    formSignUpTitle: 'Admin Access',
    formSubtitle: 'Sign in to access platform management console.',
  },
};

export default function AuthPage({ initialMode = 'login' }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRole = searchParams.get('role');
  
  const initialRoleKey = urlRole && ROLE_DATA[urlRole] ? urlRole : 'customer';
  // Default selected role is customer as requested
  const [role, setRole] = useState(initialRoleKey);
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form state — prefilled with verified role credentials for instant 1-click test
  const [loginEmail, setLoginEmail] = useState(
    ROLE_DATA[initialRoleKey]?.demoEmail || 'customer@demo.com'
  );
  const [loginPassword, setLoginPassword] = useState('demo1234');

  // Register form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    vehicleType: 'Motorcycle / Scooter',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { login, register } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const currentRoleData = ROLE_DATA[role] || ROLE_DATA.customer;

  // Sync mode when URL changes
  useEffect(() => {
    if (location.pathname === '/register') {
      setMode('signup');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setServerError('');
    setErrors({});
    // Pre-populate verified credentials for the newly chosen role
    setLoginEmail(ROLE_DATA[newRole]?.demoEmail || 'customer@demo.com');
    setLoginPassword(ROLE_DATA[newRole]?.demoPassword || 'demo1234');
  };

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setServerError('');
    setErrors({});
    if (newMode === 'login') {
      navigate(`/login?role=${role}`, { replace: true });
    } else {
      navigate(`/register?role=${role}`, { replace: true });
    }
  };

  const handleFillDemo = () => {
    setLoginEmail(currentRoleData.demoEmail);
    setLoginPassword(currentRoleData.demoPassword);
    setServerError('');
  };

  const redirectAfterLogin = (userRole) => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login' && from !== '/register') {
      navigate(from, { replace: true });
      return;
    }
    if (userRole === 'customer') navigate('/customer');
    else if (userRole === 'owner') navigate('/owner');
    else if (userRole === 'delivery') navigate('/delivery');
    else if (userRole === 'admin') navigate('/admin');
    else navigate('/customer');
  };

  const validateLogin = () => {
    const errs = {};
    if (!loginEmail.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = 'Enter a valid email address';
    if (!loginPassword) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignup = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email address';
    if (!formData.phone.trim()) errs.phone = '10-digit mobile number required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
      errs.phone = 'Enter a valid 10-digit phone number';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    if (role === 'owner' && !formData.storeName.trim())
      errs.storeName = 'Store / business name is required';
    if (!formData.agreeTerms)
      errs.agreeTerms = 'You must agree to terms to continue';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateLogin()) return;

    setSubmitting(true);
    try {
      const user = await login(loginEmail, loginPassword);
      redirectAfterLogin(user.role);
    } catch (err) {
      setServerError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateSignup()) return;

    setSubmitting(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        storeName: role === 'owner' ? formData.storeName : undefined,
        vehicleType: role === 'delivery' ? formData.vehicleType : undefined,
      });

      if (role === 'customer') {
        navigate('/customer');
      } else if (role === 'owner') {
        navigate('/owner');
      } else if (role === 'delivery') {
        navigate('/delivery');
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDE: DYNAMIC INFO, CONVINCING TEXT & ROLE-RELATED BACKGROUND
          ───────────────────────────────────────────────────────────── */}
      <div className={`${styles.leftPanel} ${currentRoleData.roleClass}`}>
        {/* Soft Ambient glowing orbs */}
        <div className={styles.ambientOrb1} />
        <div className={styles.ambientOrb2} />

        {/* Top Branding */}
        <div className={styles.leftHeader}>
          <Link to="/" className={styles.brandLink} title="NearCart Home">
            <div className={styles.brandIconWrap}>🛒</div>
            <div className={styles.brandTextGroup}>
              <span className={styles.brandTitle}>NearCart</span>
              <span className={styles.brandSubtitle}>Hyperlocal Network · Pune</span>
            </div>
          </Link>

          <div className={styles.desktopBadge}>
            <Sparkles size={13} style={{ color: 'var(--color-primary)' }} />
            <span>Desktop App</span>
          </div>
        </div>

        {/* Dynamic Hero Info based on Selected Role */}
        <div className={styles.leftContent} key={role}>
          <div className={styles.roleCategoryPill}>
            <span>{currentRoleData.badge}</span>
          </div>

          <h1 className={styles.leftHeadline}>
            {currentRoleData.headline}{' '}
            <span className={styles.leftHeadlineHighlight}>
              {currentRoleData.headlineHighlight}
            </span>
          </h1>

          <p className={styles.leftDescription}>
            {currentRoleData.description}
          </p>

          {/* Benefits Grid */}
          <div className={styles.benefitsList}>
            {currentRoleData.benefits.map((benefit, idx) => (
              <div key={idx} className={styles.benefitItem}>
                <div className={styles.benefitIconWrap}>
                  <span>{benefit.icon}</span>
                </div>
                <div className={styles.benefitContent}>
                  <div className={styles.benefitTitle}>{benefit.title}</div>
                  <div className={styles.benefitDesc}>{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Statistics & Live Pune Social Proof */}
        <div className={styles.leftFooter}>
          <div className={styles.statsGrid}>
            {currentRoleData.stats.map((stat, i) => (
              <div key={i} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.socialTrustPill}>
            <div className={styles.trustAvatars}>
              <div className={`${styles.avatarDot} ${styles.avatarDot1}`}>P</div>
              <div className={`${styles.avatarDot} ${styles.avatarDot2}`}>V</div>
              <div className={`${styles.avatarDot} ${styles.avatarDot3}`}>R</div>
              <div className={`${styles.avatarDot} ${styles.avatarDot4}`}>A</div>
            </div>
            <span>{currentRoleData.trustText}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          RIGHT SIDE: THE FORM & ROLE SELECTOR CONTROLS
          ───────────────────────────────────────────────────────────── */}
      <div className={styles.rightPanel}>
        {/* Top Action Bar */}
        <div className={styles.rightTopBar}>
          <Link to="/" className={styles.backHomeBtn}>
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </Link>

          <div className={styles.topBarRightActions}>
            <button
              type="button"
              className={styles.themeToggleBtn}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>

        {/* Segmented Mode Switcher: Sign In vs Create Account */}
        <div className={styles.modeTabsContainer}>
          <div className={styles.modeTabs}>
            <button
              type="button"
              className={`${styles.modeTab} ${mode === 'login' ? styles.modeTabActive : ''}`}
              onClick={() => handleModeSwitch('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`${styles.modeTab} ${mode === 'signup' ? styles.modeTabActive : ''}`}
              onClick={() => handleModeSwitch('signup')}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={`${styles.formRoleBadge} ${styles[role]}`}>
              <currentRoleData.icon size={12} />
              <span>{currentRoleData.title}</span>
            </div>
            <h2 className={styles.formTitle}>
              {mode === 'login' ? currentRoleData.formSignInTitle : currentRoleData.formSignUpTitle}
            </h2>
            <p className={styles.formSubtitle}>{currentRoleData.formSubtitle}</p>
          </div>

          {serverError && (
            <div className={styles.errorAlert}>
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          {/* ── MODE 1: LOGIN FORM ── */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className={styles.formFields} noValidate>
              <Input
                label="Email Address"
                type="email"
                placeholder={currentRoleData.demoEmail}
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                error={errors.email}
                leftIcon={<Mail size={16} />}
                autoComplete="email"
              />

              <div className={styles.passwordGroup}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  error={errors.password}
                  leftIcon={<Lock size={16} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: 'var(--color-text-tertiary)' }}
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  autoComplete="current-password"
                />

                <div className={styles.passwordMetaRow}>
                  <label className={styles.rememberMeLabel}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember this device</span>
                  </label>

                  <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                className={styles.submitBtn}
              >
                Sign In to {currentRoleData.title} <ArrowRight size={16} />
              </Button>

              {/* Quick 1-Click Demo Credential Auto-fill */}
              <div className={styles.demoFillSection}>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className={styles.demoFillBtn}
                  title="Click to automatically fill verified demo credentials for this role"
                >
                  <Sparkles size={13} style={{ color: 'var(--color-amber-500)' }} />
                  <span>Fill {currentRoleData.title} Demo Credentials</span>
                </button>
              </div>
            </form>
          ) : (
            /* ── MODE 2: SIGNUP FORM ── */
            <form onSubmit={handleSignupSubmit} className={styles.formFields} noValidate>
              <Input
                label="Full Name"
                placeholder={role === 'owner' ? 'Store Manager / Owner Name' : 'Siddharth Patil'}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
                leftIcon={<User size={16} />}
              />

              {role === 'owner' && (
                <Input
                  label="Store / Business Name"
                  placeholder="e.g. Pune Fresh Supermarket"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  error={errors.storeName}
                  leftIcon={<Store size={16} />}
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
                leftIcon={<Mail size={16} />}
              />

              <Input
                label="Mobile Phone Number"
                type="tel"
                placeholder="98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
                leftIcon={<Phone size={16} />}
              />

              {role === 'delivery' && (
                <Select
                  label="Vehicle Type"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                >
                  <option value="Motorcycle / Scooter">Motorcycle / Scooter (Petrol)</option>
                  <option value="Electric Scooter / EV">Electric Two-Wheeler (EV)</option>
                  <option value="Bicycle">Bicycle / Cycle</option>
                </Select>
              )}

              <Input
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                error={errors.password}
                leftIcon={<Lock size={16} />}
              />

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                error={errors.confirmPassword}
                leftIcon={<Lock size={16} />}
              />

              <label className={styles.rememberMeLabel} style={{ marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                />
                <span>I agree to NearCart's Terms of Service & Privacy Policy</span>
              </label>
              {errors.agreeTerms && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-error)' }}>
                  {errors.agreeTerms}
                </span>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                className={styles.submitBtn}
              >
                Create {currentRoleData.title} Account <ArrowRight size={16} />
              </Button>
            </form>
          )}

          {/* ─────────────────────────────────────────────────────────────
              DOWN SIDE OF FORM — PROFESSIONAL ROLE SELECTION OPTION
              "and role selecting option give down side of form for rider and shop owners design preofessionaly"
              ───────────────────────────────────────────────────────────── */}
          <div className={styles.roleSelectorSection}>
            <div className={styles.roleSelectorHeader}>
              <span className={styles.roleSelectorLabel}>SELECT YOUR ROLE / PORTAL</span>
              <span className={styles.roleCurrentIndicator}>
                Active: <strong>{currentRoleData.title}</strong>
              </span>
            </div>

            <div className={styles.roleGrid}>
              {/* Option 1: Customer (Default Selected) */}
              <button
                type="button"
                className={`${styles.roleCardBtn} ${styles.customerCard} ${
                  role === 'customer' ? styles.roleCardBtnActive : ''
                }`}
                onClick={() => handleRoleChange('customer')}
                title="Customer: Buy essentials from local stores"
              >
                <div className={styles.roleIconBadge}>
                  <ShoppingBag size={18} />
                </div>
                <div className={styles.roleCardTitle}>Customer</div>
                <div className={styles.roleCardSubtext}>Order 15-min delivery</div>
                {role === 'customer' && (
                  <div className={styles.activeCheckmark}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Option 2: Shop Owner */}
              <button
                type="button"
                className={`${styles.roleCardBtn} ${styles.ownerCard} ${
                  role === 'owner' ? styles.roleCardBtnActive : ''
                }`}
                onClick={() => handleRoleChange('owner')}
                title="Shop Owner: Sell online and manage orders"
              >
                <div className={styles.roleIconBadge}>
                  <Store size={18} />
                </div>
                <div className={styles.roleCardTitle}>Shop Owner</div>
                <div className={styles.roleCardSubtext}>Manage retail store</div>
                {role === 'owner' && (
                  <div className={styles.activeCheckmark}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>

              {/* Option 3: Delivery Rider */}
              <button
                type="button"
                className={`${styles.roleCardBtn} ${styles.deliveryCard} ${
                  role === 'delivery' ? styles.roleCardBtnActive : ''
                }`}
                onClick={() => handleRoleChange('delivery')}
                title="Delivery Partner: Deliver orders & earn"
              >
                <div className={styles.roleIconBadge}>
                  <Bike size={18} />
                </div>
                <div className={styles.roleCardTitle}>Delivery Rider</div>
                <div className={styles.roleCardSubtext}>Deliver & earn daily</div>
                {role === 'delivery' && (
                  <div className={styles.activeCheckmark}>
                    <Check size={11} strokeWidth={3} />
                  </div>
                )}
              </button>
            </div>

            {/* Bottom Meta Links: Discrete Admin Access & Support */}
            <div className={styles.bottomMetaLinks}>
              <button
                type="button"
                className={styles.adminSwitchLink}
                onClick={() => handleRoleChange(role === 'admin' ? 'customer' : 'admin')}
              >
                {role === 'admin' ? '← Back to Customer' : '⚡ Platform Admin Access'}
              </button>

              <span className={styles.helpLink}>
                Pune 24/7 Support: 1800-NEAR-CART
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
