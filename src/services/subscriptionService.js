// src/services/subscriptionService.js — Customer Daily Auto Product Booking Service
import { storage, genId } from '../utils/helpers.js';
import { mockProducts } from '../data/products.js';
import { mockStores } from '../data/stores.js';

const STORAGE_KEY = 'nc_daily_subscriptions';

// Initial pre-populated subscriptions for realistic immediate experience
const INITIAL_SUBSCRIPTIONS = [
  {
    id: 'sub-1',
    productId: 'p15',
    productName: 'Amul Taaza Milk',
    brand: 'Amul',
    variant: 'Toned',
    size: '500 ml Pouch',
    price: 27,
    quantity: 2,
    storeId: 's6',
    storeName: 'Amul Milk Dairy & Sweets',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80',
    frequency: 'daily', // 'daily' | 'alternate' | 'weekdays' | 'custom'
    customDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlot: 'early_morning', // 'early_morning' (6:00 - 7:30 AM) | 'morning' (7:30 - 9:00 AM) | 'evening' (6:00 - 8:00 PM)
    timeSlotLabel: 'Early Morning (6:00 AM - 7:30 AM)',
    startDate: new Date().toISOString().split('T')[0],
    nextDeliveryDate: getNextDeliveryDateString(1),
    status: 'active', // 'active' | 'paused'
    deliveryAddress: 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    deliveryInstructions: 'Ring bell once and leave in milk bag outside door',
    paymentMethod: 'UPI AutoPay (State Bank of India)',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    totalDeliveriesCompleted: 14,
  },
  {
    id: 'sub-2',
    productId: 'p35',
    productName: 'Brown Whole Wheat Bread',
    brand: 'The Baker’s Dozen',
    variant: '100% Whole Wheat',
    size: '400 g',
    price: 55,
    quantity: 1,
    storeId: 's4',
    storeName: "The Baker's Dozen",
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80',
    frequency: 'alternate',
    customDays: ['Mon', 'Wed', 'Fri', 'Sun'],
    timeSlot: 'morning',
    timeSlotLabel: 'Morning (7:30 AM - 9:00 AM)',
    startDate: new Date().toISOString().split('T')[0],
    nextDeliveryDate: getNextDeliveryDateString(1),
    status: 'active',
    deliveryAddress: 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    deliveryInstructions: 'Hand over to security if not answering',
    paymentMethod: 'NearCart Wallet (Auto-debit)',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    totalDeliveriesCompleted: 6,
  },
];

function getNextDeliveryDateString(daysAhead = 1) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export const subscriptionService = {
  getSubscriptions: () => {
    let subs = storage.get(STORAGE_KEY);
    if (!subs || !Array.isArray(subs) || subs.length === 0) {
      storage.set(STORAGE_KEY, INITIAL_SUBSCRIPTIONS);
      return INITIAL_SUBSCRIPTIONS;
    }
    return subs;
  },

  createSubscription: ({
    productId,
    storeId,
    productName,
    brand,
    variant,
    size,
    price,
    quantity = 1,
    image,
    frequency = 'daily',
    customDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    timeSlot = 'early_morning',
    startDate,
    deliveryAddress = 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    deliveryInstructions = 'Ring bell and leave at doorstep',
    paymentMethod = 'UPI AutoPay',
  }) => {
    const subs = subscriptionService.getSubscriptions();
    
    // Resolve store name
    const store = mockStores.find((s) => s.id === storeId);
    const storeName = store ? store.name : 'Local Verified Store';

    // Resolve slot label
    let timeSlotLabel = 'Early Morning (6:00 AM - 7:30 AM)';
    if (timeSlot === 'morning') timeSlotLabel = 'Morning (7:30 AM - 9:00 AM)';
    if (timeSlot === 'evening') timeSlotLabel = 'Evening (6:00 PM - 8:00 PM)';

    const newSub = {
      id: genId('sub'),
      productId,
      productName: productName || 'Daily Essential',
      brand: brand || '',
      variant: variant || '',
      size: size || '',
      price: price || 30,
      quantity: Number(quantity) || 1,
      storeId: storeId || 's6',
      storeName,
      image: image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80',
      frequency,
      customDays,
      timeSlot,
      timeSlotLabel,
      startDate: startDate || new Date().toISOString().split('T')[0],
      nextDeliveryDate: getNextDeliveryDateString(1),
      status: 'active',
      deliveryAddress,
      deliveryInstructions,
      paymentMethod,
      createdAt: new Date().toISOString(),
      totalDeliveriesCompleted: 0,
    };

    const updated = [newSub, ...subs];
    storage.set(STORAGE_KEY, updated);
    return newSub;
  },

  toggleStatus: (id) => {
    const subs = subscriptionService.getSubscriptions();
    const updated = subs.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          status: s.status === 'active' ? 'paused' : 'active',
        };
      }
      return s;
    });
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  updateQuantity: (id, newQty) => {
    if (newQty < 1) return subscriptionService.deleteSubscription(id);
    const subs = subscriptionService.getSubscriptions();
    const updated = subs.map((s) => (s.id === id ? { ...s, quantity: newQty } : s));
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  skipTomorrow: (id) => {
    const subs = subscriptionService.getSubscriptions();
    const updated = subs.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          nextDeliveryDate: getNextDeliveryDateString(2),
          lastSkippedAt: new Date().toISOString(),
        };
      }
      return s;
    });
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  deleteSubscription: (id) => {
    const subs = subscriptionService.getSubscriptions();
    const updated = subs.filter((s) => s.id !== id);
    storage.set(STORAGE_KEY, updated);
    return updated;
  },

  // Generates upcoming 7-day calendar schedule
  getUpcomingSchedule: () => {
    const subs = subscriptionService.getSubscriptions().filter((s) => s.status === 'active');
    const schedule = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = days[d.getDay()];
      const formattedDate = d.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      // Filter subs for this day
      const itemsForDay = subs.filter((sub) => {
        if (sub.frequency === 'daily') return true;
        if (sub.frequency === 'weekdays') return d.getDay() >= 1 && d.getDay() <= 5;
        if (sub.frequency === 'alternate') return i % 2 === 0;
        if (sub.frequency === 'custom') return sub.customDays?.includes(dayName);
        return true;
      });

      schedule.push({
        date: dateStr,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : formattedDate,
        dayName,
        isToday: i === 0,
        isTomorrow: i === 1,
        items: itemsForDay,
        totalItemsCount: itemsForDay.reduce((acc, item) => acc + item.quantity, 0),
        estimatedCost: itemsForDay.reduce((acc, item) => acc + item.price * item.quantity, 0),
      });
    }

    return schedule;
  },
};
