// src/pages/customer/HomePage.jsx — Premium redesign: Carousel + Greeting + Trending
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, LayoutGrid, List, Clock, Star, MapPin, Tag,
  ArrowRight, Sparkles, Zap, Check, X, Flame,
  ShieldCheck, Percent, ChevronDown, ChevronUp, ChevronRight,
  ChevronLeft, TrendingUp, Gift, Truck, Repeat, UploadCloud, FileText
} from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import { categories, mockStores } from '../../data/stores.js';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PrescriptionUploadModal from '../../components/PrescriptionUploadModal.jsx';
import { formatCurrency, storage } from '../../utils/helpers.js';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from './HomePage.module.css';

// Gradient palette for stores with null banners based on category
const CATEGORY_GRADIENTS = {
  grocery:     'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
  pharmacy:    'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)',
  bakery:      'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
  electronics: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 50%, #a78bfa 100%)',
  stationery:  'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
  dairy:       'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)',
  fruits:      'linear-gradient(135deg, #4d7c0f 0%, #84cc16 50%, #a3e635 100%)',
  snacks:      'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
  meat:        'linear-gradient(135deg, #b91c1c 0%, #ef4444 50%, #f87171 100%)',
  flowers:     'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
  default:     'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
};

// Hero carousel slides
const HERO_SLIDES = [
  {
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #1e1b4b 100%)',
    accent1: 'rgba(16,185,129,0.28)',
    accent2: 'rgba(245,158,11,0.22)',
    badgeColor: 'rgba(16,185,129,0.25)',
    badgeBorder: 'rgba(16,185,129,0.4)',
    badgeText: '#a7f3d0',
    badge: '⚡ Pune Hyperlocal Launch Offer',
    title: 'Get 50% Flat Off on Your First Order',
    subtitle: 'Use promo coupon at checkout. Valid for all kirana, pharmacy & bakery orders in Baner!',
    coupon: 'WELCOME50',
    cta: 'Explore Deals',
    ctaPath: '/customer/search?offers=true',
    icon: <Percent size={28} />,
  },
  {
    gradient: 'linear-gradient(135deg, #059669 0%, #047857 60%, #065f46 100%)',
    accent1: 'rgba(52,211,153,0.25)',
    accent2: 'rgba(16,185,129,0.15)',
    badgeColor: 'rgba(52,211,153,0.25)',
    badgeBorder: 'rgba(52,211,153,0.4)',
    badgeText: '#a7f3d0',
    badge: '🚚 Free Delivery Offer',
    title: 'Free Delivery on Orders Above ₹299',
    subtitle: 'Shop from 28+ verified neighborhood stores in Baner, Aundh & Hinjewadi. No extra charges.',
    coupon: 'FREEDEL',
    cta: 'Shop Now',
    ctaPath: '/customer/search',
    icon: <Truck size={28} />,
  },
  {
    gradient: 'linear-gradient(135deg, #db2777 0%, #9d174d 60%, #831843 100%)',
    accent1: 'rgba(251,113,133,0.25)',
    accent2: 'rgba(245,158,11,0.20)',
    badgeColor: 'rgba(251,113,133,0.25)',
    badgeBorder: 'rgba(251,113,133,0.4)',
    badgeText: '#fce7f3',
    badge: '🏪 Store of the Week',
    title: 'Fresh Organic Hub is Trending Near You!',
    subtitle: 'Rated 4.9★ by 200+ happy customers. Farm-fresh produce delivered in under 20 minutes.',
    coupon: 'FRESH20',
    cta: 'Visit Store',
    ctaPath: '/customer/store/s2',
    icon: <Gift size={28} />,
  },
];

// Trending products data
const TRENDING_ITEMS = [
  { emoji: '🥛', name: 'Amul Milk',    price: '₹28',    q: 'Amul+Milk' },
  { emoji: '🧅', name: 'Onions',       price: '₹32/kg', q: 'Onions' },
  { emoji: '💊', name: 'Dolo 650',     price: '₹18',    q: 'Dolo' },
  { emoji: '🍞', name: 'Fresh Bread',  price: '₹35',    q: 'Bread' },
  { emoji: '🥚', name: 'Eggs (12)',    price: '₹84',    q: 'Eggs' },
  { emoji: '🌾', name: 'Aashirvaad Atta','price': '₹270', q: 'Atta' },
  { emoji: '🛢️', name: 'Sunflower Oil','price': '₹165',  q: 'Oil' },
  { emoji: '🍌', name: 'Bananas',      price: '₹40/dz', q: 'Bananas' },
  { emoji: '🫙', name: 'Tata Salt',    price: '₹28',    q: 'Salt' },
  { emoji: '🧴', name: 'Dettol 200ml', price: '₹75',    q: 'Dettol' },
];

// Greeting based on time of day
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', emoji: '☀️', sub: 'Ready to restock your kitchen?' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️', sub: 'Check today\'s best deals from nearby stores.' };
  if (h < 21) return { text: 'Good evening', emoji: '🌇', sub: 'Dinner plans? Order in minutes!' };
  return { text: 'Good night', emoji: '🌙', sub: 'Check tonight\'s late deals from nearby stores.' };
}

// Hero Carousel component
function HeroCarousel({ slides }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4500);
  }, [slides.length]);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const goTo = (idx) => {
    setCurrent(idx);
    resetTimer();
  };

  const navigate = useNavigate();
  const slide = slides[current];

  return (
    <div className={styles.carouselWrapper}>
      <div
        className={styles.carouselTrack}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className={styles.carouselSlide}>
            <section
              className={styles.heroBanner}
              style={{
                background: s.gradient,
                borderRadius: 0,
                boxShadow: 'none',
              }}
            >
              {/* ambient glows via pseudo-elements already in CSS */}
              <div
                style={{
                  position: 'absolute', top: '-60px', right: '-40px',
                  width: '280px', height: '280px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${s.accent1} 0%, transparent 70%)`,
                  filter: 'blur(40px)', pointerEvents: 'none',
                }}
              />
              <div
                style={{
                  position: 'absolute', bottom: '-50px', left: '20%',
                  width: '200px', height: '200px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${s.accent2} 0%, transparent 70%)`,
                  filter: 'blur(35px)', pointerEvents: 'none',
                }}
              />

              <div className={styles.heroLeft}>
                <div className={styles.heroIconBox}>{s.icon}</div>
                <div className={styles.heroContent}>
                  <div
                    className={styles.heroBadge}
                    style={{ background: s.badgeColor, borderColor: s.badgeBorder, color: s.badgeText }}
                  >
                    {s.badge}
                  </div>
                  <h2 className={styles.heroTitle}>{s.title}</h2>
                  <p className={styles.heroSubtitle}>
                    {s.subtitle.includes('coupon') || s.coupon ? (
                      <>
                        {s.subtitle} <span className={styles.couponTag}>{s.coupon}</span>
                      </>
                    ) : s.subtitle}
                  </p>
                </div>
              </div>

              <div className={styles.heroRight}>
                <button
                  type="button"
                  className={styles.heroCtaBtn}
                  onClick={() => navigate(s.ctaPath)}
                >
                  {s.cta} <ArrowRight size={15} />
                </button>
              </div>
            </section>
          </div>
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        type="button"
        className={`${styles.carouselArrow} ${styles.prev}`}
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        className={`${styles.carouselArrow} ${styles.next}`}
        onClick={() => goTo((current + 1) % slides.length)}
        aria-label="Next slide"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className={styles.carouselDots}>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.carouselDot} ${i === current ? styles.active : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuth();
  const [stores, setStores]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [viewMode, setViewMode]       = useState('grid');
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('');
  const [sortBy, setSortBy]           = useState('distance');
  const [activeFilters, setActiveFilters] = useState({
    fastDelivery: false,
    topRated: false,
    freeDelivery: false,
    openNow: false,
  });
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  const navigate = useNavigate();
  const greeting = getGreeting();

  // Get user first name
  const userName = user?.name?.split(' ')[0] || 'there';
  const userInitials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const visibleCategories = useMemo(() => {
    if (showAllCategories) return categories;
    return categories.slice(0, 6);
  }, [showAllCategories]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    mockStores.forEach((st) => {
      counts[st.category] = (counts[st.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Fetch stores
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    storeService
      .getNearbyStores({ search, category, sortBy })
      .then((data) => {
        if (mounted) {
          let filtered = data;
          if (activeFilters.fastDelivery) filtered = filtered.filter((s) => (s.avgEtaMinutes || 25) <= 25);
          if (activeFilters.topRated)    filtered = filtered.filter((s) => s.rating >= 4.5);
          if (activeFilters.freeDelivery)filtered = filtered.filter((s) => s.deliveryFee === 0);
          if (activeFilters.openNow)     filtered = filtered.filter((s) => s.isOpen);
          setStores(filtered);
          setLoading(false);
        }
      })
      .catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [search, category, sortBy, activeFilters]);

  const toggleFilter = (key) => setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  const selectedCategoryObj = categories.find((c) => c.id === category);

  return (
    <div className={styles.container}>

      {/* ── 0. PERSONALIZED GREETING STRIP ── */}
      <div className={styles.greetingStrip}>
        <div className={styles.greetingLeft}>
          <div className={styles.greetingAvatar}>{userInitials}</div>
          <div className={styles.greetingText}>
            <h2 className={styles.greetingHello}>
              {greeting.text}, <span>{userName}</span>! {greeting.emoji}
            </h2>
            <p className={styles.greetingSub}>{greeting.sub}</p>
          </div>
        </div>
        <div className={styles.greetingRight}>
          <span className={styles.loyaltyBadge}>
            🌟 +15 loyalty points earned
          </span>
        </div>
      </div>

      {/* ── 1. HERO CAROUSEL ── */}
      <HeroCarousel slides={HERO_SLIDES} />

      {/* ── 2. TRENDING NEAR YOU ── */}
      <div className={styles.trendingSection}>
        <div className={styles.trendingHeader}>
          <h3 className={styles.trendingTitle}>
            <Flame size={17} className={styles.trendingTitleIcon} />
            Trending Near You
          </h3>
          <Link
            to="/customer/search"
            style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 'var(--font-semibold)' }}
          >
            See All →
          </Link>
        </div>
        <div className={styles.trendingScrollRow}>
          {TRENDING_ITEMS.map((item, i) => (
            <Link
              key={item.q}
              to={`/customer/search?q=${encodeURIComponent(item.q)}`}
              className={styles.trendingPill}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className={styles.trendingPillEmoji}>{item.emoji}</span>
              <span>{item.name}</span>
              <span className={styles.trendingPillPrice}>{item.price}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 2B. DAILY AUTO PRODUCT BOOKING STRIP ── */}
      <div className={styles.autoBookingFeatureStrip}>
        <div className={styles.abLeft}>
          <div className={styles.abIconBox}>🥛</div>
          <div className={styles.abText}>
            <div className={styles.abBadgeRow}>
              <span className={styles.abBadge}>DAILY AUTO-BOOKING</span>
              <span className={styles.abSubBadge}>7:00 AM Morning Drop</span>
            </div>
            <h4 className={styles.abTitle}>Never run out of Milk, Bread or Daily Eggs!</h4>
            <p className={styles.abSubtitle}>
              Set daily or alternate days auto-booking once. Local Pune dairies &amp; kiranas deliver fresh items to your doorstep automatically.
            </p>
          </div>
        </div>

        <div className={styles.abRight}>
          <Button
            variant="primary"
            onClick={() => navigate('/customer/auto-booking')}
          >
            <Repeat size={15} /> Set Up Daily Auto-Booking
          </Button>
        </div>
      </div>

      {/* ── 3. CATEGORY EXPLORER ── */}
      <section className={styles.categorySection}>
        <div className={styles.categorySectionHeader}>
          <div className={styles.catHeaderLeft}>
            <div className={styles.catHeaderTitleRow}>
              <Sparkles size={18} className={styles.catIcon} />
              <h3 className={styles.catSectionTitle}>Explore by Category</h3>
            </div>
            <p className={styles.catSectionSubtitle}>
              Direct delivery from genuine neighborhood shops &amp; verified merchants in Pune
            </p>
          </div>

          <div className={styles.catHeaderRight}>
            {category && selectedCategoryObj && (
              <div className={styles.activeFilterBadge}>
                <span>Filtering: {selectedCategoryObj.label}</span>
                <button
                  type="button"
                  className={styles.clearFilterBtn}
                  onClick={() => setCategory('')}
                  title="Clear Category Filter"
                >
                  <X size={11} strokeWidth={3} />
                </button>
              </div>
            )}

            <button
              type="button"
              className={styles.seeAllBtn}
              onClick={() => setShowAllCategories(!showAllCategories)}
              title={showAllCategories ? 'Collapse to single row' : 'See all categories'}
            >
              <span>{showAllCategories ? 'Show Less' : `See All (${categories.length})`}</span>
              {showAllCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        <div className={showAllCategories ? styles.categoryGridExpanded : styles.categorySingleRow}>
          {/* All Stores */}
          <div
            className={`${styles.categoryCard} ${category === '' ? styles.categoryCardActive : ''}`}
            onClick={() => setCategory('')}
            role="button"
            tabIndex={0}
            title="View all stores"
          >
            <div className={styles.catEmojiCircle} style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--color-primary)' }}>
              🏪
            </div>
            <span className={styles.catLabel}>All Stores</span>
            <span className={styles.catCount}>{mockStores.length} Stores</span>
            {category === '' && <div className={styles.categoryActiveCheck}><Check size={9} strokeWidth={3} /></div>}
          </div>

          {visibleCategories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = category === cat.id;
            return (
              <div
                key={cat.id}
                className={`${styles.categoryCard} ${isSelected ? styles.categoryCardActive : ''}`}
                style={isSelected ? { borderColor: cat.color, boxShadow: `0 4px 16px ${cat.color}33` } : undefined}
                onClick={() => setCategory(isSelected ? '' : cat.id)}
                role="button"
                tabIndex={0}
                title={`Filter by ${cat.label}`}
              >
                <div
                  className={styles.catEmojiCircle}
                  style={{ backgroundColor: `${cat.color}18`, borderColor: `${cat.color}30` }}
                >
                  {cat.icon}
                </div>
                <span className={styles.catLabel}>{cat.label}</span>
                <span className={styles.catCount}>
                  {count > 0 ? `${count} ${count === 1 ? 'Store' : 'Stores'}` : 'Local Hub'}
                </span>
                {isSelected && (
                  <div className={styles.categoryActiveCheck} style={{ backgroundColor: cat.color }}>
                    <Check size={9} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}

          {!showAllCategories && categories.length > 6 && (
            <div
              className={`${styles.categoryCard} ${styles.seeMoreCard}`}
              onClick={() => setShowAllCategories(true)}
              role="button"
              tabIndex={0}
              title="See all categories"
            >
              <div className={styles.seeMoreIconCircle}><ChevronRight size={20} /></div>
              <span className={styles.catLabel}>See All</span>
              <span className={styles.catCount}>+{categories.length - 6} more</span>
            </div>
          )}
        </div>

        {/* Quick Filter Chips */}
        <div className={styles.quickFiltersRow}>
          <span className={styles.quickFilterLabel}>Quick Filters:</span>

          <button
            type="button"
            className={`${styles.quickFilterChip} ${activeFilters.fastDelivery ? styles.quickFilterChipActive : ''}`}
            onClick={() => toggleFilter('fastDelivery')}
          >
            <Zap size={13} style={{ color: 'var(--color-amber-500)' }} />
            <span>Under 25 Mins</span>
          </button>

          <button
            type="button"
            className={`${styles.quickFilterChip} ${activeFilters.topRated ? styles.quickFilterChipActive : ''}`}
            onClick={() => toggleFilter('topRated')}
          >
            <Star size={13} style={{ fill: '#f59e0b', color: '#f59e0b' }} />
            <span>Top Rated (4.5+)</span>
          </button>

          <button
            type="button"
            className={`${styles.quickFilterChip} ${activeFilters.freeDelivery ? styles.quickFilterChipActive : ''}`}
            onClick={() => toggleFilter('freeDelivery')}
          >
            <Tag size={13} style={{ color: 'var(--color-emerald-500)' }} />
            <span>Free Delivery</span>
          </button>

          <button
            type="button"
            className={`${styles.quickFilterChip} ${activeFilters.openNow ? styles.quickFilterChipActive : ''}`}
            onClick={() => toggleFilter('openNow')}
          >
            <Clock size={13} style={{ color: 'var(--color-primary)' }} />
            <span>Open Now Only</span>
          </button>
        </div>
      </section>

      {/* ── 3B. PHARMACY DOCTOR'S PRESCRIPTION LIST BANNER ── */}
      {category === 'pharmacy' && (
        <div className={styles.pharmacyHomeBanner}>
          <div className={styles.phLeft}>
            <div className={styles.phEmoji}>📋</div>
            <div className={styles.phText}>
              <div className={styles.phBadgeRow}>
                <span className={styles.phBadge}>PHARMACY PRESCRIPTION SERVICE</span>
                <span className={styles.phSubBadge}>15-Min Doorstep Drop</span>
              </div>
              <h4 className={styles.phTitle}>Order Medicines from Doctor's Handwritten or Printed List</h4>
              <p className={styles.phSub}>
                Upload a photo of your prescription. Registered chemists at MediCare &amp; QuickMed verify medicines, batch numbers &amp; deliver to your doorstep.
              </p>
            </div>
          </div>
          <div className={styles.phActions}>
            <Button
              variant="emerald"
              onClick={() => setIsRxModalOpen(true)}
            >
              <UploadCloud size={16} /> Upload Doctor's List Image
            </Button>
            <Link to="/customer/pharmacy-prescription" className={styles.phLink}>
              View Prescription Tracker →
            </Link>
          </div>
        </div>
      )}

      {/* ── 4. TOOLBAR ── */}
      <div className={styles.toolbar}>
        <div className={styles.storeCountHeader}>
          <h3 className={styles.sectionHeading}>
            {selectedCategoryObj ? `${selectedCategoryObj.label} Stores` : 'Nearby Stores in Baner'}
          </h3>
          <span className={styles.storeCounter}>
            {stores.length} {stores.length === 1 ? 'store available' : 'stores available'}
          </span>
        </div>

        <div className={styles.toolbarActions}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
            aria-label="Sort stores"
          >
            <option value="distance">Nearest Distance First</option>
            <option value="rating">Highest Rated First</option>
            <option value="delivery_fee">Lowest Delivery Fee</option>
          </select>

          <div className={styles.viewToggle}>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`${styles.toggleBtn} ${viewMode === 'list' ? styles.activeToggle : ''}`}
              title="List View"
              aria-label="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. STORE LISTINGS (upgraded cards) ── */}
      {loading ? (
        <div className={viewMode === 'grid' ? styles.storeGrid : styles.storeList}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} style={{ height: '270px', borderRadius: 'var(--radius-2xl)', overflow: 'hidden' }}>
              <Skeleton height="100%" />
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <EmptyState
          icon={<Search size={44} />}
          title="No matching stores found"
          description="Try selecting a different category or clearing your active filters."
          actionText="View All Stores"
          onAction={() => {
            setCategory('');
            setSearch('');
            setActiveFilters({ fastDelivery: false, topRated: false, freeDelivery: false, openNow: false });
          }}
        />
      ) : (
        <div className={viewMode === 'grid' ? styles.storeGrid : styles.storeList}>
          {stores.map((store, idx) => {
            const catObj     = categories.find((c) => c.id === store.category);
            const categoryLabel = catObj?.label || store.category;
            const categoryIcon  = catObj?.icon  || '🏪';
            const gradientBg    = CATEGORY_GRADIENTS[store.category] || CATEGORY_GRADIENTS.default;
            const areaName      = store.address?.split(',')[1]?.trim() || store.address?.split(',')[0]?.trim() || 'Baner';
            const etaMinutes    = store.avgEtaMinutes || store.deliveryEtaMin || 25;
            const isFast        = etaMinutes <= 20;
            const isVerified    = store.rating >= 4.7;

            return (
              <Link
                key={store.id}
                to={`/customer/store/${store.id}`}
                className={viewMode === 'grid' ? styles.storeCard : styles.storeRow}
                style={{ animationDelay: `${idx * 30}ms` }}
              >
                {/* Store Visual Banner */}
                <div className={styles.bannerWrapper}>
                  {store.banner ? (
                    <img
                      src={store.banner}
                      alt={store.name}
                      className={styles.storeBannerImg}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.bannerFallback} style={{ background: gradientBg }}>
                      <div className={styles.fallbackIconBox}><span>{categoryIcon}</span></div>
                      <span className={styles.fallbackStoreInitial}>{store.name}</span>
                    </div>
                  )}

                  {/* Open status badge with pulsing dot */}
                  <div className={styles.statusBadgeWrap}>
                    {store.isOpen ? (
                      <Badge variant="success" size="xs">
                        <span className={styles.openPulseDot} />
                        Open Now
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="xs" dot>Closed</Badge>
                    )}
                  </div>

                  {/* Distance badge */}
                  <div className={styles.distanceBadge}>
                    <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />
                    {store.distanceKm || 0.8} km
                  </div>

                  {/* Fast delivery badge */}
                  {isFast && (
                    <div className={styles.fastBadge}>
                      <Zap size={10} fill="currentColor" />
                      ⚡ {etaMinutes} min
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className={styles.cardDetails}>
                  <div className={styles.cardHeaderRow}>
                    <h4 className={styles.storeName}>
                      {store.name}
                      {isVerified && (
                        <span className={styles.verifiedBadge}>
                          <ShieldCheck size={9} /> Verified
                        </span>
                      )}
                    </h4>
                    <div className={styles.ratingBadge}>
                      <Star size={11} fill="currentColor" />
                      <span>{store.rating ? store.rating.toFixed(1) : '4.5'}</span>
                    </div>
                  </div>

                  <p className={styles.storeMetaInfo}>
                    {categoryLabel} · {areaName}
                  </p>

                  <div className={styles.cardFooter}>
                    <div className={styles.etaInfo}>
                      <Clock size={13} />
                      <span>{etaMinutes} mins</span>
                    </div>

                    <div className={styles.feeInfo}>
                      {store.deliveryFee === 0 ? (
                        <span className={styles.freeDeliveryBadge}>FREE Delivery</span>
                      ) : (
                        <span>₹{store.deliveryFee} delivery</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Prescription Upload Modal */}
      {isRxModalOpen && (
        <PrescriptionUploadModal
          isOpen={isRxModalOpen}
          onClose={() => setIsRxModalOpen(false)}
        />
      )}
    </div>
  );
}
