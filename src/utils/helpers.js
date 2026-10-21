// src/utils/helpers.js — Utility functions

/** Simulate async API delay */
export const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

/** Format Indian Rupee */
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
export const formatCurrency = formatINR;

/** Format date/time */
export const formatDate = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
export const formatDateTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
};
export const formatTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};
export const timeAgo = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/** Generate unique id */
export const genId = (prefix = 'id') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Generate idempotency key */
export const genIdempotencyKey = () => `idem-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

/** Clamp a number */
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/** Debounce */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/** Get status label */
export const STATUS_LABELS = {
  placed:     'Order Placed',
  accepted:   'Accepted',
  preparing:  'Preparing',
  picked_up:  'Picked Up',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  rejected:   'Rejected',
  cancelled:  'Cancelled',
  failed:     'Failed',
  pending:    'Pending',
  approved:   'Approved',
  new:        'New',
  ready:      'Ready for Pickup',
  completed:  'Completed',
};

export const getStatusLabel = (status) => STATUS_LABELS[status] || status;

/** Order status flow */
export const ORDER_FLOW = ['placed', 'accepted', 'preparing', 'picked_up', 'in_transit', 'delivered'];

export const isTerminalStatus = (s) => ['delivered', 'rejected', 'cancelled', 'failed'].includes(s);

/** Truncate text */
export const truncate = (str, n = 80) => (str && str.length > n ? `${str.slice(0, n)}...` : str);

/** Calculate offer discount */
export const calcOfferDiscount = (subtotal, offer) => {
  if (!offer) return 0;
  if (subtotal < offer.minOrder) return 0;
  if (offer.type === 'percentage') return Math.round(subtotal * offer.value / 100);
  if (offer.type === 'flat') return Math.min(offer.value, subtotal);
  return 0;
};

/** Storage helper with try/catch */
export const storage = {
  get: (key, fallback = null) => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key); } catch {}
  },
};

/** Get color for category */
export const CATEGORY_COLORS = {
  grocery:     '#10b981',
  pharmacy:    '#3b82f6',
  bakery:      '#f97316',
  electronics: '#8b5cf6',
  stationery:  '#06b6d4',
  dairy:       '#6366f1',
  fruits:      '#84cc16',
  snacks:      '#ec4899',
  meat:        '#ef4444',
  flowers:     '#f43f5e',
};

export const getCategoryColor = (cat) => CATEGORY_COLORS[cat] || '#9ca3af';

/** Format distance */
export const formatDistance = (km) => km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`;

/** Check if product is in stock */
export const isInStock = (product) => product.stock > 0;

/** Get product display name */
export const getProductDisplayName = (p) => `${p.name}${p.size ? ` (${p.size})` : ''}${p.variant ? ` – ${p.variant}` : ''}`;
