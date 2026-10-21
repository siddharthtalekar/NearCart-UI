// src/pages/delivery/DeliveryDashboard.jsx — Premium redesign
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bike, Power, DollarSign, MapPin, Clock, ArrowRight,
  CheckCircle2, Star, Package, Zap, Navigation2, TrendingUp,
} from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import styles from './DeliveryDashboard.module.css';

const EARNINGS_TARGET = 1200;
const TODAY_EARNINGS   = 847;

const ZONES = [
  { name: 'Baner',      level: 'hot',    label: 'High Demand' },
  { name: 'Aundh',      level: 'medium', label: 'Medium' },
  { name: 'Hinjewadi',  level: 'low',    label: 'Low Demand' },
];

const TODAY_HISTORY = [
  { time: '10:15 AM', route: 'Pune Daily Mart → Apt 3B, Baner',       earning: 85 },
  { time: '11:40 AM', route: 'Fresh Organic Hub → Rose Garden Society', earning: 120 },
  { time: '01:05 PM', route: 'Green Bakery → MG Road, Aundh',           earning: 95 },
  { time: '02:30 PM', route: 'Pharma Plus → Pinnacle Towers',            earning: 70 },
];

const DELIVERY_STAGES = ['Picked ✓', 'In Transit', 'Delivered'];

export default function DeliveryDashboard() {
  const [isOnline, setIsOnline]         = useState(true);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [hasNewRequest, setHasNewRequest] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    orderService.getDeliveryOrders('u3').then((data) => {
      setActiveDeliveries(
        data.filter((d) =>
          ['accepted', 'preparing', 'picked_up', 'in_transit'].includes(d.status)
        )
      );
    });
  }, []);

  // Animate progress bar on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setProgressWidth(Math.round((TODAY_EARNINGS / EARNINGS_TARGET) * 100));
    }, 400);
    return () => clearTimeout(t);
  }, []);

  const earningsCount = useCountUp(TODAY_EARNINGS, 1400);
  const tripsRemaining = Math.ceil((EARNINGS_TARGET - TODAY_EARNINGS) / 75);

  const activeOrder = activeDeliveries[0];

  // Determine progress bar color
  const pct = (TODAY_EARNINGS / EARNINGS_TARGET) * 100;
  const barColor =
    pct >= 90 ? '#059669' :
    pct >= 60 ? '#d97706' :
    '#4f46e5';

  return (
    <div className={styles.page}>

      {/* ── 1. Cinematic Online/Offline Hero ── */}
      <div className={`${styles.statusHero} ${isOnline ? styles.online : styles.offline}`}>
        <div className={styles.statusLeft}>
          <div className={`${styles.statusIconWrap} ${isOnline ? styles.online : styles.offline}`}>
            <Bike size={26} />
          </div>
          <div className={styles.statusText}>
            <h2 className={styles.statusTitle}>
              {isOnline ? "You're Live in Baner!" : 'You Are Offline'}
            </h2>
            <p className={styles.statusSub}>
              {isOnline
                ? 'Receiving real-time assignments around Baner & Aundh'
                : 'Toggle online to receive new delivery requests'}
            </p>
            {isOnline && (
              <div className={styles.statusLiveDot}>
                <span className={styles.pulseDot} />
                3 orders pending in your zone
              </div>
            )}
          </div>
        </div>

        <Button
          variant={isOnline ? 'outline' : 'emerald'}
          size="lg"
          onClick={() => setIsOnline(!isOnline)}
          style={
            isOnline
              ? { background: 'rgba(255,255,255,0.18)', color: '#fff', borderColor: 'rgba(255,255,255,0.35)' }
              : {}
          }
        >
          <Power size={18} /> {isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>

      {/* ── 2. Earnings Ticker ── */}
      <div className={styles.earningsCard}>
        <div className={styles.earningsTop}>
          <div>
            <div className={styles.earningsLabel}>Today's Earnings</div>
            <div className={styles.earningsAmount}>₹{earningsCount.toLocaleString('en-IN')}</div>
            <div className={styles.earningsSuffix}>{TODAY_HISTORY.length} trips completed</div>
          </div>
          <div className={styles.earningsTargetInfo}>
            <div className={styles.earningsTargetLabel}>Daily Target</div>
            <div className={styles.earningsTargetValue}>₹{EARNINGS_TARGET.toLocaleString('en-IN')}</div>
            <div className={styles.earningsMotivation}>
              {tripsRemaining > 0
                ? `~${tripsRemaining} more trips to hit target! 🎯`
                : '🎉 Target achieved! Great work!'}
            </div>
          </div>
        </div>

        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressWidth}%`, background: barColor }}
          />
        </div>
        <div className={styles.progressLabels}>
          <span>₹0</span>
          <span style={{ color: barColor, fontWeight: 'var(--font-semibold)' }}>{Math.round(pct)}% of target</span>
          <span>₹{EARNINGS_TARGET.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* ── 3. New Gig Alert ── */}
      {isOnline && hasNewRequest && (
        <div className={styles.gigAlert}>
          <div>
            <div className={styles.gigBadge}>
              <Zap size={10} fill="currentColor" />
              NEW GIG REQUEST
            </div>
            <div className={styles.gigTitle}>Pickup from Pune Daily Mart</div>
            <div className={styles.gigMeta}>
              Drop: Baner Road (2.4 km) • Payout: <strong>₹65.00</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Button variant="ghost" size="sm" onClick={() => setHasNewRequest(false)}>
              Dismiss
            </Button>
            <Link to="/delivery/request">
              <Button variant="accent" size="sm">
                Review (30s) <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── 4. KPI Grid ── */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiEarnings}`} style={{ animationDelay: '0ms' }}>
          <div className={styles.kpiLabel}>Today's Earnings</div>
          <div className={styles.kpiValue} style={{ color: 'var(--color-success)' }}>₹{earningsCount}</div>
          <div className={styles.kpiSub}>↑ Best day this week</div>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiTrips}`} style={{ animationDelay: '60ms' }}>
          <div className={styles.kpiLabel}>Active Trip</div>
          <div className={styles.kpiValue}>
            {activeDeliveries.length > 0 ? '1 Live' : 'None'}
          </div>
          <div className={styles.kpiSub} style={{ color: activeDeliveries.length > 0 ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
            {activeDeliveries.length > 0 ? 'Delivery in progress' : 'Awaiting next order'}
          </div>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiRating}`} style={{ animationDelay: '120ms' }}>
          <div className={styles.kpiLabel}>Customer Rating</div>
          <div className={styles.kpiValue}>4.95 ★</div>
          <div className={styles.kpiSub} style={{ color: 'var(--color-success)' }}>Top courier bonus ✓</div>
        </div>
      </div>

      {/* ── 5. Zone Heatmap ── */}
      <Card>
        <CardHeader title="Zone Demand Heatmap" subtitle="Real-time order density in your area" />
        <CardBody>
          <div className={styles.zoneChips}>
            {ZONES.map((z) => (
              <div key={z.name} className={`${styles.zoneChip} ${styles[z.level]}`}>
                <span className={styles.zoneDot} />
                <strong>{z.name}</strong>
                <span>({z.label})</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* ── 6. Active Delivery Card ── */}
      {activeOrder && (
        <div className={styles.activeCard}>
          <div className={styles.activeCardTop}>
            <div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Current Active Trip • Order #{activeOrder.id?.slice(-4)}
              </div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
                {activeOrder.storeName || 'Pune Daily Mart'}
              </h3>
            </div>
            <div className={styles.liveChip}>
              <span className={styles.pulseDot} style={{ background: 'var(--color-error)' }} />
              LIVE
            </div>
          </div>

          {/* Stage track */}
          <div className={styles.stageTrack}>
            <div className={`${styles.stage} ${styles.done}`}><CheckCircle2 size={12} /> Picked ✓</div>
            <div className={styles.stageArrow} />
            <div className={`${styles.stage} ${styles.current}`}><Navigation2 size={12} /> In Transit</div>
            <div className={styles.stageArrow} />
            <div className={`${styles.stage} ${styles.future}`}><CheckCircle2 size={12} /> Delivered</div>
          </div>

          <div className={styles.routeInfo}>
            <div className={styles.routePoint}>
              <span className={styles.routePointLabel}>Pickup</span>
              <span className={styles.routePointValue}>{activeOrder.storeName || 'Pune Daily Mart'}</span>
            </div>
            <div style={{ color: 'var(--color-border)', alignSelf: 'center' }}>→</div>
            <div className={styles.routePoint}>
              <span className={styles.routePointLabel}>Drop</span>
              <span className={styles.routePointValue}>{activeOrder.deliveryAddress || 'Baner Road, Flat 4B'}</span>
            </div>
          </div>

          <Link to="/delivery/active">
            <Button variant="primary" size="md">
              <Navigation2 size={16} /> Open Navigation &amp; Steps <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      )}

      {/* ── 7. Today's Delivery Timeline ── */}
      <Card>
        <CardHeader
          title="Today's Completed Deliveries"
          subtitle={`${TODAY_HISTORY.length} trips · ₹${TODAY_HISTORY.reduce((s, t) => s + t.earning, 0)} earned`}
          action={
            <Link to="/delivery/history">
              <Button variant="ghost" size="sm">Full History <ArrowRight size={13} /></Button>
            </Link>
          }
        />
        <CardBody>
          <div className={styles.timeline}>
            {TODAY_HISTORY.map((item, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.timelineDot}>
                  <CheckCircle2 size={14} />
                </div>
                <div className={styles.timelineTime}>{item.time}</div>
                <div className={styles.timelineText}>{item.route}</div>
                <div className={styles.timelineEarning}>+₹{item.earning}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
