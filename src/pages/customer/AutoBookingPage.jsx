// src/pages/customer/AutoBookingPage.jsx — Customer Daily Auto Product Booking Management Dashboard
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Repeat,
  Zap,
  Plus,
  Play,
  Pause,
  SkipForward,
  Trash2,
  CheckCircle,
  AlertCircle,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Store,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import AutoBookingModal from '../../components/AutoBookingModal.jsx';
import { subscriptionService } from '../../services/subscriptionService.js';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './AutoBookingPage.module.css';

// Popular daily essentials for quick subscription setup
const POPULAR_DAILY_ITEMS = [
  {
    id: 'p15',
    name: 'Amul Taaza Toned Milk',
    brand: 'Amul',
    size: '500 ml Pouch',
    price: 27,
    storeId: 's6',
    storeName: 'Amul Milk Dairy & Sweets',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80',
    tag: 'Daily Morning',
    defaultQty: 2,
  },
  {
    id: 'p16',
    name: 'Amul Gold Full Cream Milk',
    brand: 'Amul',
    size: '500 ml Pouch',
    price: 33,
    storeId: 's6',
    storeName: 'Amul Milk Dairy & Sweets',
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?w=300&q=80',
    tag: 'Rich & Creamy',
    defaultQty: 1,
  },
  {
    id: 'p35',
    name: 'Whole Wheat Brown Bread',
    brand: "The Baker's Dozen",
    size: '400 g',
    price: 55,
    storeId: 's4',
    storeName: "The Baker's Dozen",
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
    tag: 'Freshly Baked',
    defaultQty: 1,
  },
  {
    id: 'p36',
    name: 'Farm Fresh White Eggs',
    brand: 'Fresh Farm',
    size: 'Pack of 6',
    price: 48,
    storeId: 's1',
    storeName: 'Fresh Basket Supermarket',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=300&q=80',
    tag: 'Protein Rich',
    defaultQty: 1,
  },
  {
    id: 'p18',
    name: 'Fresh Malai Paneer',
    brand: 'Amul',
    size: '200 g Pack',
    price: 75,
    storeId: 's6',
    storeName: 'Amul Milk Dairy & Sweets',
    image: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=300&q=80',
    tag: 'Soft & Fresh',
    defaultQty: 1,
  },
  {
    id: 'p24',
    name: 'Crocin Advance 500mg Strip',
    brand: 'Crocin',
    size: '15 Tablets',
    price: 20,
    storeId: 's2',
    storeName: 'MediCare Pharmacy',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80',
    tag: 'Daily Health Care',
    defaultQty: 1,
  },
];

export default function AutoBookingPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'subscriptions' | 'schedule' | 'catalog'
  const [modalProduct, setModalProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const loadData = () => {
    const subs = subscriptionService.getSubscriptions();
    setSubscriptions(subs);
    setUpcomingSchedule(subscriptionService.getUpcomingSchedule());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleToggleStatus = (id) => {
    subscriptionService.toggleStatus(id);
    loadData();
    showToast('Subscription status updated successfully.');
  };

  const handleQuantityChange = (id, newQty) => {
    subscriptionService.updateQuantity(id, newQty);
    loadData();
    showToast(`Quantity updated to ${newQty}.`);
  };

  const handleSkipTomorrow = (id) => {
    subscriptionService.skipTomorrow(id);
    loadData();
    showToast("Tomorrow's delivery skipped. Next delivery moved to day after.");
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to cancel this daily auto-booking?')) {
      subscriptionService.deleteSubscription(id);
      loadData();
      showToast('Daily auto-booking cancelled.');
    }
  };

  const handleOpenSubscribe = (item) => {
    setModalProduct(item);
    setIsModalOpen(true);
  };

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;
  const totalDailyDrops = subscriptions
    .filter((s) => s.status === 'active' && s.frequency === 'daily')
    .reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toastNotice}>
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTitleRow}>
            <div className={styles.headerIconBox}>
              <Repeat size={24} />
            </div>
            <div>
              <h1 className={styles.title}>Daily Auto Product Booking</h1>
              <p className={styles.subtitle}>
                Auto-scheduled morning deliveries for milk, bakery, daily eggs &amp; essentials directly from Pune neighborhood stores
              </p>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="primary"
            onClick={() => handleOpenSubscribe(POPULAR_DAILY_ITEMS[0])}
          >
            <Plus size={16} /> New Auto-Booking
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)' }}>
            <CalendarCheck size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Active Subscriptions</span>
            <span className={styles.metricValue}>{activeCount} Items</span>
            <span className={styles.metricSub}>Scheduled &amp; Auto-Delivered</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'var(--color-emerald-50)', color: 'var(--color-emerald-600)' }}>
            <Clock size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Next Delivery Window</span>
            <span className={styles.metricValue}>Tomorrow 6:00 AM</span>
            <span className={styles.metricSub}>Early Morning Doorstep Drop</span>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricIconWrap} style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#d97706' }}>
            <ShieldCheck size={20} />
          </div>
          <div className={styles.metricData}>
            <span className={styles.metricLabel}>Auto-Pay Protection</span>
            <span className={styles.metricValue}>UPI AutoPay Active</span>
            <span className={styles.metricSub}>Billed only upon doorstep delivery</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabsHeader}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'subscriptions' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('subscriptions')}
        >
          <Repeat size={16} />
          <span>My Auto-Bookings ({subscriptions.length})</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'schedule' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <Calendar size={16} />
          <span>7-Day Delivery Timeline</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'catalog' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('catalog')}
        >
          <Sparkles size={16} />
          <span>Popular Daily Essentials</span>
        </button>
      </div>

      {/* TAB 1: SUBSCRIPTIONS LIST */}
      {activeTab === 'subscriptions' && (
        <div className={styles.tabContent}>
          {subscriptions.length === 0 ? (
            <div className={styles.emptyStateCard}>
              <div className={styles.emptyIconCircle}>🥛</div>
              <h3>No Active Auto-Bookings Yet</h3>
              <p>Set up recurring morning delivery for fresh milk, bread, or groceries and never worry about ordering daily again.</p>
              <Button
                variant="primary"
                onClick={() => handleOpenSubscribe(POPULAR_DAILY_ITEMS[0])}
                style={{ marginTop: '14px' }}
              >
                Browse Daily Essentials
              </Button>
            </div>
          ) : (
            <div className={styles.subscriptionsGrid}>
              {subscriptions.map((sub) => {
                const isActive = sub.status === 'active';
                const itemTotal = sub.price * sub.quantity;

                return (
                  <div
                    key={sub.id}
                    className={`${styles.subCard} ${!isActive ? styles.subCardPaused : ''}`}
                  >
                    {/* Card Top Strip */}
                    <div className={styles.cardHeader}>
                      <div className={styles.badgeGroup}>
                        <Badge variant={isActive ? 'success' : 'neutral'} size="sm">
                          {isActive ? '● Auto-Delivering' : '⏸ Paused'}
                        </Badge>
                        <span className={styles.frequencyBadge}>
                          {sub.frequency === 'daily'
                            ? 'Every Day'
                            : sub.frequency === 'alternate'
                            ? 'Alternate Days'
                            : sub.frequency === 'weekdays'
                            ? 'Mon - Fri'
                            : 'Custom Days'}
                        </span>
                      </div>

                      <div className={styles.headerControls}>
                        <button
                          type="button"
                          className={`${styles.pauseToggleBtn} ${isActive ? styles.pauseBtn : styles.resumeBtn}`}
                          onClick={() => handleToggleStatus(sub.id)}
                          title={isActive ? 'Pause deliveries' : 'Resume deliveries'}
                        >
                          {isActive ? <Pause size={14} /> : <Play size={14} />}
                          <span>{isActive ? 'Pause' : 'Resume'}</span>
                        </button>

                        <button
                          type="button"
                          className={styles.deleteSubBtn}
                          onClick={() => handleDelete(sub.id)}
                          title="Cancel subscription"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Product Body */}
                    <div className={styles.cardBody}>
                      <img
                        src={sub.image}
                        alt={sub.productName}
                        className={styles.subItemImg}
                      />
                      <div className={styles.subItemDetails}>
                        <span className={styles.subItemBrand}>{sub.brand}</span>
                        <h3 className={styles.subItemName}>{sub.productName}</h3>
                        <p className={styles.subItemSpecs}>
                          {sub.size} {sub.variant && `• ${sub.variant}`}
                        </p>
                        <div className={styles.storeRow}>
                          <Store size={13} />
                          <span>{sub.storeName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Schedule Details */}
                    <div className={styles.scheduleInfoBox}>
                      <div className={styles.infoRow}>
                        <div className={styles.infoLabelCol}>
                          <Clock size={14} />
                          <span>Delivery Slot:</span>
                        </div>
                        <span className={styles.infoValueCol}>{sub.timeSlotLabel}</span>
                      </div>

                      <div className={styles.infoRow}>
                        <div className={styles.infoLabelCol}>
                          <Calendar size={14} />
                          <span>Next Scheduled Drop:</span>
                        </div>
                        <span className={styles.infoValueColHighlight}>
                          {sub.nextDeliveryDate}
                        </span>
                      </div>

                      <div className={styles.infoRow}>
                        <div className={styles.infoLabelCol}>
                          <MapPin size={14} />
                          <span>Deliver To:</span>
                        </div>
                        <span className={styles.infoValueCol} title={sub.deliveryAddress}>
                          {sub.deliveryAddress.split(',')[0]}...
                        </span>
                      </div>
                    </div>

                    {/* Footer with Quantity & Skip Tomorrow */}
                    <div className={styles.cardFooter}>
                      <div className={styles.qtyControl}>
                        <span className={styles.qtyLabel}>Quantity:</span>
                        <div className={styles.stepperInline}>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => handleQuantityChange(sub.id, sub.quantity - 1)}
                            disabled={sub.quantity <= 1}
                          >
                            -
                          </button>
                          <span className={styles.stepVal}>{sub.quantity}</span>
                          <button
                            type="button"
                            className={styles.stepBtn}
                            onClick={() => handleQuantityChange(sub.id, sub.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className={styles.calculatedPrice}>
                          {formatCurrency(itemTotal)} / drop
                        </span>
                      </div>

                      {isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSkipTomorrow(sub.id)}
                          className={styles.skipBtn}
                          title="Going away tomorrow? Skip just tomorrow's delivery"
                        >
                          <SkipForward size={14} /> Skip Tomorrow
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 7-DAY DELIVERY SCHEDULE */}
      {activeTab === 'schedule' && (
        <div className={styles.scheduleTabContent}>
          <div className={styles.scheduleIntro}>
            <h3>Upcoming 7-Day Auto-Delivery Calendar</h3>
            <p>Here is what our hyperlocal delivery partners will bring to your doorstep over the next week.</p>
          </div>

          <div className={styles.timelineList}>
            {upcomingSchedule.map((dayPlan) => (
              <div
                key={dayPlan.date}
                className={`${styles.timelineDayCard} ${dayPlan.isToday ? styles.timelineToday : ''} ${dayPlan.isTomorrow ? styles.timelineTomorrow : ''}`}
              >
                <div className={styles.timelineDateCol}>
                  <span className={styles.timelineDayName}>{dayPlan.dayName}</span>
                  <span className={styles.timelineDateLabel}>{dayPlan.label}</span>
                  {dayPlan.isTomorrow && <span className={styles.nextPill}>Next Drop</span>}
                </div>

                <div className={styles.timelineItemsCol}>
                  {dayPlan.items.length === 0 ? (
                    <span className={styles.noDeliveriesText}>No scheduled deliveries for this day.</span>
                  ) : (
                    <div className={styles.dayItemsRow}>
                      {dayPlan.items.map((it) => (
                        <div key={it.id} className={styles.dayItemChip}>
                          <img src={it.image} alt={it.productName} className={styles.chipImg} />
                          <div className={styles.chipText}>
                            <strong>{it.quantity}x {it.productName}</strong>
                            <span>{it.timeSlotLabel.split('(')[0]} · {it.storeName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.timelineCostCol}>
                  <span className={styles.dayCostLabel}>Est. Total</span>
                  <span className={styles.dayCostValue}>{formatCurrency(dayPlan.estimatedCost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POPULAR DAILY ESSENTIALS */}
      {activeTab === 'catalog' && (
        <div className={styles.catalogTabContent}>
          <div className={styles.catalogHeader}>
            <div>
              <h3>Daily Essentials Frequently Booked on Schedule</h3>
              <p>One-click recurring booking for Pune households. Free daily doorstep drop.</p>
            </div>
          </div>

          <div className={styles.catalogGrid}>
            {POPULAR_DAILY_ITEMS.map((item) => (
              <div key={item.id} className={styles.catalogCard}>
                <div className={styles.catalogImgWrap}>
                  <img src={item.image} alt={item.name} className={styles.catalogImg} />
                  <span className={styles.catalogTag}>{item.tag}</span>
                </div>

                <div className={styles.catalogBody}>
                  <span className={styles.catalogBrand}>{item.brand}</span>
                  <h4 className={styles.catalogName}>{item.name}</h4>
                  <span className={styles.catalogSize}>{item.size}</span>
                  <div className={styles.catalogStoreRow}>
                    <Store size={12} />
                    <span>{item.storeName}</span>
                  </div>

                  <div className={styles.catalogFooter}>
                    <span className={styles.catalogPrice}>{formatCurrency(item.price)}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenSubscribe(item)}
                    >
                      <Repeat size={14} /> Auto-Book
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reusable Modal for setting Daily Auto-Booking */}
      {isModalOpen && modalProduct && (
        <AutoBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={modalProduct}
          onSuccess={() => {
            loadData();
            showToast('Daily auto-booking activated!');
          }}
        />
      )}
    </div>
  );
}
