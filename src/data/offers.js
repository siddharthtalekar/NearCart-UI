// src/data/offers.js — Promotional offers

export const mockOffers = [
  {
    id: 'offer-1', storeId: 's1', name: '10% Off on First Order', code: 'FIRST10',
    type: 'percentage', value: 10, minOrder: 200,
    products: [], // applies to all products
    startDate: '2024-01-01', endDate: '2024-12-31',
    isActive: true, usageLimit: 1, usageCount: 0,
    description: 'Get 10% off on your first order from Fresh Basket.',
  },
  {
    id: 'offer-2', storeId: 's3', name: '10% Off on Bakery Items', code: 'SWEET10',
    type: 'percentage', value: 10, minOrder: 300,
    products: [], startDate: '2024-06-01', endDate: '2024-07-31',
    isActive: true, usageLimit: null, usageCount: 45,
    description: '10% off on all bakery items above ₹300.',
  },
  {
    id: 'offer-3', storeId: 's6', name: '₹25 Off on Dairy', code: 'DAIRY25',
    type: 'flat', value: 25, minOrder: 150,
    products: [], startDate: '2024-06-01', endDate: '2024-06-30',
    isActive: true, usageLimit: null, usageCount: 123,
    description: 'Flat ₹25 off on dairy orders above ₹150.',
  },
  {
    id: 'offer-4', storeId: 's2', name: 'Buy 2 Get 1 Free on Crocin', code: 'CROCIN3',
    type: 'buy_x_get_y', value: 1, buyQty: 2, getQty: 1, minOrder: 0,
    products: ['p24', 'p25'], startDate: '2024-06-01', endDate: '2024-06-15',
    isActive: false, usageLimit: null, usageCount: 34,
    description: 'Buy 2 strips of Crocin, get 1 free.',
  },
  {
    id: 'offer-5', storeId: 's9', name: '₹50 Off on Orders above ₹500', code: 'NB50',
    type: 'flat', value: 50, minOrder: 500,
    products: [], startDate: '2024-05-01', endDate: '2024-12-31',
    isActive: true, usageLimit: null, usageCount: 78,
    description: '₹50 flat off on orders above ₹500 at Nature\'s Basket.',
  },
  {
    id: 'offer-6', storeId: 's8', name: '15% Off on Snacks', code: 'SNACK15',
    type: 'percentage', value: 15, minOrder: 250,
    products: [], startDate: '2024-06-10', endDate: '2024-06-20',
    isActive: true, usageLimit: null, usageCount: 19,
    description: '15% off on all snacks above ₹250.',
  },
  {
    id: 'offer-7', storeId: 's7', name: '₹20 Off on Fresh Vegetables', code: 'FRESH20',
    type: 'flat', value: 20, minOrder: 100,
    products: [], startDate: '2024-06-01', endDate: '2024-06-30',
    isActive: true, usageLimit: null, usageCount: 55,
    description: '₹20 off on fresh vegetables above ₹100.',
  },
];

export const mockNotifications = [
  {
    id: 'n1', userId: 'u1', type: 'order_update', title: 'Order Out for Delivery!',
    body: 'Your order ORD-2406-006 from Green Valley is out for delivery. ETA: 15 mins.',
    orderId: 'ORD-2406-006', isRead: false, createdAt: '2024-06-12T08:45:00Z',
  },
  {
    id: 'n2', userId: 'u1', type: 'order_update', title: 'Order Accepted',
    body: 'Sweet Crumbs Bakery has accepted your order ORD-2406-002. They are baking your items!',
    orderId: 'ORD-2406-002', isRead: false, createdAt: '2024-06-11T08:04:00Z',
  },
  {
    id: 'n3', userId: 'u1', type: 'order_update', title: 'Order Delivered ✓',
    body: 'Your order ORD-2406-001 from Fresh Basket has been delivered. Enjoy!',
    orderId: 'ORD-2406-001', isRead: true, createdAt: '2024-06-10T09:55:00Z',
  },
  {
    id: 'n4', userId: 'u1', type: 'offer', title: '🎉 Offer: 15% Off on Snacks',
    body: 'Snack Attack is offering 15% off this weekend. Use code SNACK15.',
    orderId: null, isRead: true, createdAt: '2024-06-10T10:00:00Z',
  },
  {
    id: 'n5', userId: 'u1', type: 'order_update', title: 'Order Rejected',
    body: 'Unfortunately, your order ORD-2406-004 from Amul Dairy was rejected. Reason: Paneer out of stock.',
    orderId: 'ORD-2406-004', isRead: true, createdAt: '2024-06-08T07:12:00Z',
  },
  {
    id: 'n6', userId: 'u2', type: 'order_update', title: 'New Order Received!',
    body: 'You have a new order #ORD-2406-011 from Priya Sharma. Please accept or reject.',
    orderId: 'ORD-2406-011', isRead: false, createdAt: '2024-06-12T12:00:00Z',
  },
  {
    id: 'n7', userId: 'u3', type: 'delivery', title: 'New Delivery Assignment',
    body: 'A new delivery assignment is available near Baner. Payout: ₹45.',
    orderId: 'ORD-2406-006', isRead: false, createdAt: '2024-06-12T08:30:00Z',
  },
  {
    id: 'n8', userId: 'u4', type: 'admin', title: 'New Store Approval Pending',
    body: 'Gourmet Kitchen has submitted a registration request. Please review.',
    orderId: null, isRead: false, createdAt: '2024-06-15T09:00:00Z',
  },
];

// Platform settings
export const platformSettings = {
  deliveryFeeDefault: 25,
  platformFeeDefault: 5,
  taxPercentage: 5,
  maxDeliveryRadiusKm: 10,
  defaultDeliveryRadiusKm: 5,
  paymentMethods: {
    cod: true,
    online: true,
    wallet: false,
  },
  supportPhone: '+91 1800-000-0001',
  supportEmail: 'support@nearcart.in',
};
