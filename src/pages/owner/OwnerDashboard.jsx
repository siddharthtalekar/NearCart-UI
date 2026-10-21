// src/pages/owner/OwnerDashboard.jsx — Premium redesign with CSS modules
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, DollarSign, AlertTriangle, Clock,
  TrendingUp, ArrowRight, Package, Star, CheckCircle2,
  RotateCcw, Zap, ChevronRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { orderService } from '../../services/orderService.js';
import { storeService } from '../../services/storeService.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import styles from './OwnerDashboard.module.css';

const SALES_DATA = [
  { day: 'Mon', revenue: 4200, orders: 14 },
  { day: 'Tue', revenue: 5800, orders: 19 },
  { day: 'Wed', revenue: 5100, orders: 17 },
  { day: 'Thu', revenue: 7400, orders: 25 },
  { day: 'Fri', revenue: 9200, orders: 31 },
  { day: 'Sat', revenue: 14500, orders: 48 },
  { day: 'Sun', revenue: 12800, orders: 42 },
];

const TOP_PRODUCTS = [
  { name: 'Amul Taaza Milk 500ml', sales: 142, revenue: 3834 },
  { name: 'Aashirvaad Chakki Atta 5kg', sales: 68, revenue: 18360 },
  { name: 'Tata Salt Vaccum Evaporated 1kg', sales: 94, revenue: 2632 },
  { name: 'Fortune Sunflower Oil 1L', sales: 52, revenue: 8580 },
];

// Sparkline bar data (7 days normalized heights in %)
const SPARKLINE_REV  = [28, 38, 33, 50, 62, 100, 88];
const SPARKLINE_ORD  = [29, 40, 35, 52, 65, 100, 88];
const SPARKLINE_PEND = [10, 20, 15, 30, 25, 40, 60];
const SPARKLINE_STOCK= [80, 70, 60, 50, 40, 30, 20];

const KANBAN_STATUS = [
  { key: 'placed',    label: 'Placed',    cls: styles.placed,    icon: '🆕' },
  { key: 'accepted',  label: 'Accepted',  cls: styles.accepted,  icon: '✅' },
  { key: 'preparing', label: 'Packing',   cls: styles.preparing, icon: '📦' },
  { key: 'ready',     label: 'Ready',     cls: styles.ready,     icon: '🛵' },
];

const STORE_HEALTH_FACTORS = [
  { label: 'Avg Rating',        pct: 92 },
  { label: 'Accept Rate',       pct: 97 },
  { label: 'Response Time',     pct: 85 },
  { label: 'Stock Coverage',    pct: 74 },
];

// Health score as a ring
function HealthRing({ score = 87 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const [dash, setDash] = useState(circ);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDash(circ - (score / 100) * circ);
    }, 300);
    return () => clearTimeout(timer);
  }, [score, circ]);

  const color = score >= 80 ? '#059669' : score >= 60 ? '#d97706' : '#e11d48';

  return (
    <div className={styles.healthRingWrapper}>
      <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="120" height="120" className={styles.healthRingSvg}>
          <circle className={styles.healthRingBg} cx="60" cy="60" r={r} />
          <circle
            className={styles.healthRingFill}
            cx="60" cy="60" r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={dash}
          />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div className={styles.healthScore}>{score}</div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)' }}>/100</div>
        </div>
      </div>
      <div className={styles.healthLabel}>Store Health Score</div>
      <div className={styles.healthFactors}>
        {STORE_HEALTH_FACTORS.map((f) => (
          <div key={f.label} className={styles.healthFactor}>
            <span>{f.label}</span>
            <div className={styles.healthFactorBar}>
              <div className={styles.healthFactorFill} style={{ width: `${f.pct}%` }} />
            </div>
            <span style={{ fontWeight: 'var(--font-semibold)', color: 'var(--color-text-primary)' }}>{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated sparkline bars
function Sparkline({ data, className }) {
  return (
    <div className={styles.sparkline}>
      {data.map((h, i) => (
        <div
          key={i}
          className={`${styles.sparkBar} ${i === data.length - 1 ? styles.today : ''} ${className}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

export default function OwnerDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const storeId = 's1';

  useEffect(() => {
    orderService.getStoreOrders(storeId).then(setOrders);
    storeService.getOwnerProducts(storeId).then(setProducts);
  }, [storeId]);

  const pendingOrders  = orders.filter((o) => ['placed', 'accepted'].includes(o.status));
  const lowStockProducts = products.filter((p) => p.stock <= 5);

  // Animated counters
  const revCount  = useCountUp(14520);
  const ordCount  = useCountUp(48);
  const pendCount = useCountUp(pendingOrders.length);
  const lowCount  = useCountUp(lowStockProducts.length);

  // Group orders by kanban status
  const kanbanGroups = KANBAN_STATUS.reduce((acc, s) => {
    acc[s.key] = orders.filter((o) => o.status === s.key).slice(0, 3);
    return acc;
  }, {});

  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Store Manager Dashboard</h1>
          <p className={styles.pageSubtitle}>Pune Daily Mart • Baner Road Branch</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/owner/orders">
            <Button variant="primary" size="sm">
              <ShoppingBag size={14} /> Incoming Orders ({pendingOrders.length})
            </Button>
          </Link>
          <Link to="/owner/products">
            <Button variant="outline" size="sm">
              <Package size={14} /> Manage Catalog
            </Button>
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className={styles.kpiGrid}>
        {/* Revenue */}
        <div className={`${styles.kpiCard} ${styles.kpiRevenue}`} style={{ animationDelay: '0ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Today's Gross Sales</span>
            <div className={`${styles.kpiIconBox} ${styles.revenue}`}>
              <DollarSign size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>₹{revCount.toLocaleString('en-IN')}</div>
          <div className={`${styles.kpiDelta} ${styles.up}`}>↑ +18% vs yesterday</div>
          <Sparkline data={SPARKLINE_REV} />
        </div>

        {/* Orders */}
        <div className={`${styles.kpiCard} ${styles.kpiOrders}`} style={{ animationDelay: '60ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Orders Today</span>
            <div className={`${styles.kpiIconBox} ${styles.orders}`}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{ordCount} Orders</div>
          <div className={`${styles.kpiDelta} ${styles.info}`}>98% Fulfillment Rate</div>
          <Sparkline data={SPARKLINE_ORD} />
        </div>

        {/* Pending */}
        <div className={`${styles.kpiCard} ${styles.kpiPending}`} style={{ animationDelay: '120ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Pending Action</span>
            <div className={`${styles.kpiIconBox} ${styles.pending}`}>
              <Clock size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{pendCount} New</div>
          <div className={`${styles.kpiDelta} ${styles.warn}`}>Awaiting packing</div>
          <Sparkline data={SPARKLINE_PEND} />
        </div>

        {/* Low Stock */}
        <div className={`${styles.kpiCard} ${styles.kpiAlert}`} style={{ animationDelay: '180ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Low Stock Warnings</span>
            <div className={`${styles.kpiIconBox} ${styles.alert}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className={styles.kpiValue}>{lowCount} Items</div>
          <div className={`${styles.kpiDelta} ${styles.down}`}>Requires restocking</div>
          <Sparkline data={SPARKLINE_STOCK} />
        </div>
      </div>

      {/* ── Main Content Grid ── */}
      <div className={styles.mainGrid}>

        {/* LEFT: Charts */}
        <div className={styles.chartsSection}>

          {/* Weekly Revenue Chart */}
          <Card>
            <CardHeader
              title={
                <span className={styles.cardHeaderWithDelta}>
                  Weekly Sales Revenue (₹)
                  <span className={styles.chartDelta}>↑ +₹2,100 vs last week</span>
                </span>
              }
              subtitle="Daily localized customer demand — Baner cluster"
            />
            <CardBody>
              <div style={{ height: '260px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_DATA}>
                    <defs>
                      <linearGradient id="ownerRevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="day" stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="var(--color-text-tertiary)" tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                      contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#ownerRevGrad)"
                      dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader title="Top Performing Products" subtitle="Units sold this week" />
            <CardBody>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOP_PRODUCTS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-text-tertiary)" tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" width={145} tick={{ fontSize: 11 }} stroke="var(--color-text-secondary)" />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }} />
                    <Bar dataKey="sales" fill="var(--color-accent-500)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Low Stock Table */}
          <Card>
            <CardHeader
              title="Inventory Restock Alerts"
              subtitle="Products with 5 or fewer items remaining"
              action={
                <Link to="/owner/products">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight size={14} />
                  </Button>
                </Link>
              }
            />
            <CardBody style={{ padding: 0 }}>
              <div>
                {lowStockProducts.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                    ✅ No low-stock items right now!
                  </div>
                ) : lowStockProducts.map((p) => (
                  <div key={p.id} className={styles.stockRow}>
                    <div>
                      <div className={styles.stockName}>{p.name}</div>
                      <div className={styles.stockMeta}>{p.brand} • {p.size}</div>
                    </div>
                    <div className={styles.stockRight}>
                      <Badge variant="error">Stock: {p.stock} left</Badge>
                      <span className={styles.stockPrice}>{formatCurrency(p.price)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT: Kanban + Alerts + Health Ring */}
        <div className={styles.kanbanPanel}>

          {/* Mini Kanban */}
          <Card>
            <CardHeader
              title="Orders Kanban"
              subtitle="Live board snapshot"
              action={
                <Link to="/owner/orders">
                  <Button variant="ghost-primary" size="sm">Full Board <ChevronRight size={13} /></Button>
                </Link>
              }
            />
            <CardBody>
              <div className={styles.kanbanGrid}>
                {KANBAN_STATUS.map((s) => {
                  const items = kanbanGroups[s.key] || [];
                  return (
                    <div
                      key={s.key}
                      className={styles.kanbanCol}
                      onClick={() => navigate('/owner/orders')}
                      title={`View ${s.label} orders`}
                    >
                      <div className={styles.kanbanColHeader}>
                        <span className={`${styles.kanbanCount} ${s.cls}`}>{items.length}</span>
                        <span>{s.label}</span>
                      </div>
                      <div className={styles.kanbanItems}>
                        {items.length === 0 ? (
                          <span className={styles.kanbanEmpty}>None</span>
                        ) : items.map((o) => (
                          <div key={o.id} className={styles.kanbanItem}>
                            #{o.id?.slice(-4) || '—'} · ₹{o.total || '—'}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Alerts & Action Center */}
          <Card>
            <CardHeader title="Action Center" subtitle="Items needing your attention" />
            <CardBody>
              <div className={styles.alertList}>
                {pendingOrders.length > 0 && (
                  <div className={`${styles.alertItem} ${styles.red}`}>
                    <span className={styles.alertIcon}><AlertTriangle size={16} color="var(--color-error)" /></span>
                    <div className={styles.alertText}>
                      <div className={styles.alertTitle}>{pendingOrders.length} orders unacknowledged</div>
                      <div className={styles.alertMeta}>Some pending &gt;10 min — review now</div>
                    </div>
                    <Link to="/owner/orders" className={styles.alertAction}>Accept</Link>
                  </div>
                )}

                {lowStockProducts.slice(0, 2).map((p) => (
                  <div key={p.id} className={`${styles.alertItem} ${styles.yellow}`}>
                    <span className={styles.alertIcon}><Package size={16} color="var(--color-warning)" /></span>
                    <div className={styles.alertText}>
                      <div className={styles.alertTitle}>{p.name}</div>
                      <div className={styles.alertMeta}>{p.stock} units left — restock soon</div>
                    </div>
                    <Link to="/owner/products" className={styles.alertAction}>Restock</Link>
                  </div>
                ))}

                <div className={`${styles.alertItem} ${styles.green}`}>
                  <span className={styles.alertIcon}><Star size={16} color="var(--color-success)" /></span>
                  <div className={styles.alertText}>
                    <div className={styles.alertTitle}>New 5★ review received</div>
                    <div className={styles.alertMeta}>"Fast delivery, fresh items!" — Priya K.</div>
                  </div>
                  <Link to="/owner/reviews" className={styles.alertAction}>View</Link>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Store Health Ring */}
          <Card>
            <CardHeader title="Store Health Score" subtitle="Based on rating, speed & stock" />
            <CardBody>
              <HealthRing score={87} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
