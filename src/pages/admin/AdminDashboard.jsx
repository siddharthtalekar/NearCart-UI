// src/pages/admin/AdminDashboard.jsx — Premium redesign
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Store, ShoppingBag, DollarSign,
  ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import { useCountUp } from '../../hooks/useCountUp.js';
import styles from './AdminDashboard.module.css';

const GMV_DATA = [
  { month: 'May', gmv: 420000, prev: 320000 },
  { month: 'Jun', gmv: 580000, prev: 440000 },
  { month: 'Jul', gmv: 710000, prev: 550000 },
  { month: 'Aug', gmv: 890000, prev: 680000 },
  { month: 'Sep', gmv: 1140000, prev: 890000 },
  { month: 'Oct', gmv: 1480000, prev: 1140000 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'store',   icon: '🏪', text: 'New store "Green Valley Bakery" submitted approval request', time: '10m ago', alert: false },
  { id: 2, type: 'dispute', icon: '⚖️', text: 'Customer raised dispute on Order #ORD-2610-142', time: '25m ago', alert: false },
  { id: 3, type: 'fraud',   icon: '🚨', text: 'Velocity alert: 4 rapid orders from IP 192.168.1.4', time: '1h ago', alert: true },
  { id: 4, type: 'partner', icon: '🛵', text: 'Courier Rahul Verma uploaded DL for KYC review', time: '2h ago', alert: false },
];

const TOP_STORES = [
  { name: 'Pune Daily Mart',     gmv: 420000, pct: 100 },
  { name: 'Fresh Organic Hub',   gmv: 380000, pct: 90 },
  { name: 'Green Valley Bakery', gmv: 210000, pct: 50 },
  { name: 'Pharma Plus',         gmv: 175000, pct: 42 },
  { name: 'City Electronics',    gmv: 120000, pct: 29 },
];

const RANK_EMOJIS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

const PENDING_APPROVALS = [
  { id: 'a1', icon: '🏪', name: 'Green Valley Bakery', meta: 'Store KYC • Submitted 10m ago' },
  { id: 'a2', icon: '🛵', name: 'Rahul Verma',         meta: 'Courier DL upload • 2h ago' },
  { id: 'a3', icon: '🏪', name: 'City Stationery Hub', meta: 'Store KYC • Submitted 1d ago' },
];

const CLUSTERS = [
  { name: 'Baner / Balewadi Cluster',  variant: 'success', label: 'Operational (99.2%)' },
  { name: 'Aundh / University Cluster', variant: 'success', label: 'Operational (98.8%)' },
  { name: 'Hinjewadi IT Phase 1-3',     variant: 'warning', label: 'High Courier Demand' },
  { name: 'Kothrud Local Zone',         variant: 'neutral', label: 'Launching Next Week' },
];

const HEALTH_PILLS = [
  { label: 'API',          status: 'ok',    text: 'Healthy' },
  { label: 'Payments',     status: 'ok',    text: 'Healthy' },
  { label: '3 KYC Pending',status: 'warn',  text: '' },
  { label: '1 Dispute',    status: 'alert', text: 'Active' },
];

export default function AdminDashboard() {
  const [approvals, setApprovals] = useState(PENDING_APPROVALS);
  const [leaderWidths, setLeaderWidths] = useState(TOP_STORES.map(() => 0));

  // Animate leaderboard bars on mount
  useEffect(() => {
    const t = setTimeout(() => {
      setLeaderWidths(TOP_STORES.map((s) => s.pct));
    }, 500);
    return () => clearTimeout(t);
  }, []);

  // Animated counters
  const gmvCount     = useCountUp(148, 1400);
  const ordersCount  = useCountUp(4250, 1400);
  const storesCount  = useCountUp(28, 800);
  const couriersCount= useCountUp(45, 800);

  const handleApprove = (id) => setApprovals((prev) => prev.filter((a) => a.id !== id));
  const handleReject  = (id) => setApprovals((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className={styles.page}>

      {/* ── Page Header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Platform Overview &amp; Metrics</h1>
          <p className={styles.pageSubtitle}>Pune Hyperlocal Marketplace Operations</p>
        </div>
        <Link to="/admin/approvals">
          <Button variant="primary" size="sm">
            Pending Approvals ({approvals.length}) <ArrowRight size={14} />
          </Button>
        </Link>
      </div>

      {/* ── Platform Health Status Bar ── */}
      <div className={styles.healthBar}>
        <span className={styles.healthBarLabel}>Platform Status:</span>
        {HEALTH_PILLS.map((p, i) => (
          <div key={i}>
            {i > 0 && <span className={styles.healthDivider} />}
            <div className={`${styles.healthPill} ${styles[p.status]}`}>
              <span className={styles.healthPillDot} />
              {p.label}{p.text ? `: ${p.text}` : ''}
            </div>
          </div>
        ))}
      </div>

      {/* ── KPI Cards ── */}
      <div className={styles.kpiGrid}>
        <div className={`${styles.kpiCard} ${styles.kpiGmv}`} style={{ animationDelay: '0ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Total GMV (Oct)</span>
            <div className={`${styles.kpiIconBox} ${styles.gmv}`}><DollarSign size={18} /></div>
          </div>
          <div className={styles.kpiValue}>₹{gmvCount} L</div>
          <div className={`${styles.kpiDelta} ${styles.up}`}>↑ +29.8% month over month</div>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiOrders}`} style={{ animationDelay: '60ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Monthly Orders</span>
            <div className={`${styles.kpiIconBox} ${styles.orders}`}><ShoppingBag size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{ordersCount.toLocaleString('en-IN')}</div>
          <div className={`${styles.kpiDelta} ${styles.info}`}>98.4% delivered successfully</div>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiStores}`} style={{ animationDelay: '120ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Active Stores</span>
            <div className={`${styles.kpiIconBox} ${styles.stores}`}><Store size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{storesCount}</div>
          <div className={`${styles.kpiDelta} ${styles.warn}`}>3 awaiting KYC approval</div>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiCouriers}`} style={{ animationDelay: '180ms' }}>
          <div className={styles.kpiTop}>
            <span className={styles.kpiLabel}>Active Couriers</span>
            <div className={`${styles.kpiIconBox} ${styles.couriers}`}><Users size={18} /></div>
          </div>
          <div className={styles.kpiValue}>{couriersCount}</div>
          <div className={`${styles.kpiDelta} ${styles.muted}`}>Baner · Aundh · Hinjewadi</div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className={styles.mainGrid}>

        {/* LEFT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* GMV Chart */}
          <Card>
            <CardHeader
              title={
                <span className={styles.chartHeaderRow}>
                  Gross Merchandise Volume (GMV)
                  <span className={styles.momBadge}>↑ +29.8% MoM</span>
                </span>
              }
              subtitle="Monthly sales vs prior month comparison"
            />
            <CardBody>
              <div style={{ height: '280px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GMV_DATA}>
                    <defs>
                      <linearGradient id="adminGmvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="adminPrevGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10b981" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
                    <YAxis stroke="var(--color-text-tertiary)" tickFormatter={(v) => `₹${v / 100000}L`} tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(v, name) => [`₹${v.toLocaleString('en-IN')}`, name === 'gmv' ? 'This Month' : 'Last Month']}
                      contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    />
                    <Area type="monotone" dataKey="prev" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#adminPrevGrad)" dot={false} />
                    <Area type="monotone" dataKey="gmv"  stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#adminGmvGrad)" dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          {/* Activity Feed */}
          <Card>
            <CardHeader title="Real-Time Platform Events" subtitle="Live stream of merchant & customer actions" />
            <CardBody style={{ padding: 0 }}>
              <div className={styles.feedList}>
                {RECENT_ACTIVITY.map((act, i) => (
                  <div
                    key={act.id}
                    className={styles.feedItem}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className={`${styles.feedIconBox} ${styles[act.type]}`}>
                      {act.icon}
                    </div>
                    <span className={`${styles.feedText} ${act.alert ? styles.alert : ''}`}>
                      {act.text}
                    </span>
                    <span className={styles.feedTime}>{act.time}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Top Stores Leaderboard */}
          <Card>
            <CardHeader title="Top Performing Stores" subtitle="GMV ranking this month" />
            <CardBody>
              <div className={styles.leaderboard}>
                {TOP_STORES.map((s, i) => (
                  <div key={s.name} className={styles.leaderRow}>
                    <span className={styles.leaderRank}>{RANK_EMOJIS[i]}</span>
                    <div className={styles.leaderInfo}>
                      <div className={styles.leaderName}>{s.name}</div>
                      <div className={styles.leaderBarWrap}>
                        <div className={styles.leaderBar}>
                          <div
                            className={styles.leaderBarFill}
                            style={{ width: `${leaderWidths[i]}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className={styles.leaderGmv}>₹{(s.gmv / 100000).toFixed(1)}L</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

          {/* Quick Approvals */}
          <Card>
            <CardHeader
              title="Pending Approvals"
              subtitle="Quick approve / reject KYC requests"
              action={
                <Link to="/admin/approvals">
                  <Button variant="ghost" size="sm">View All <ArrowRight size={13} /></Button>
                </Link>
              }
            />
            <CardBody>
              {approvals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-5)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  ✅ All caught up — no pending approvals!
                </div>
              ) : (
                <div className={styles.approvalList}>
                  {approvals.map((a) => (
                    <div key={a.id} className={styles.approvalItem}>
                      <div className={styles.approvalIcon}>{a.icon}</div>
                      <div className={styles.approvalInfo}>
                        <div className={styles.approvalName}>{a.name}</div>
                        <div className={styles.approvalMeta}>{a.meta}</div>
                      </div>
                      <div className={styles.approvalActions}>
                        <button className={styles.approveBtn} onClick={() => handleApprove(a.id)}>✓</button>
                        <button className={styles.rejectBtn}  onClick={() => handleReject(a.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Hyperlocal Cluster Status */}
          <Card>
            <CardHeader title="Hyperlocal Cluster Status" subtitle="Pune Zone Operations" />
            <CardBody>
              <div className={styles.clusterList}>
                {CLUSTERS.map((c) => (
                  <div key={c.name} className={styles.clusterRow}>
                    <span className={styles.clusterName}>{c.name}</span>
                    <Badge variant={c.variant}>{c.label}</Badge>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
