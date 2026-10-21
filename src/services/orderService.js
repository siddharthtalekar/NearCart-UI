// src/services/orderService.js — Order management service layer

import { mockOrders, mockDisputes } from '../data/orders.js';
import { delay, genId, genIdempotencyKey } from '../utils/helpers.js';

let orders = [...mockOrders];
let disputes = [...mockDisputes];

export const orderService = {
  /** Place an order */
  placeOrder: async (orderData, idempotencyKey) => {
    await delay(1200);
    // Idempotency check
    if (orders.find(o => o.idempotencyKey === idempotencyKey)) {
      throw new Error('Duplicate order detected. Please wait before placing a new order.');
    }
    // Validate stock
    // (in real app, this would call inventory service)
    const orderId = `ORD-${new Date().getFullYear().toString().slice(2)}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(Math.random()*900+100)}`;
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'placed',
      statusHistory: [{ status: 'placed', time: new Date().toISOString(), note: 'Order placed by customer' }],
      placedAt: new Date().toISOString(),
      actualDelivery: null,
      proofOfDelivery: false,
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      idempotencyKey,
      dispute: null,
    };
    orders.push(newOrder);
    return newOrder;
  },

  /** Get orders for a customer */
  getCustomerOrders: async (customerId, { status, storeId } = {}) => {
    await delay(500);
    let results = orders.filter(o => o.customerId === customerId);
    if (status) results = results.filter(o => o.status === status);
    if (storeId) results = results.filter(o => o.storeId === storeId);
    return results.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  },

  /** Get single order */
  getOrder: async (orderId) => {
    await delay(400);
    return orders.find(o => o.id === orderId) || null;
  },

  /** Get orders for owner's store */
  getStoreOrders: async (storeId, { status } = {}) => {
    await delay(500);
    let results = orders.filter(o => o.storeId === storeId);
    if (status) results = results.filter(o => o.status === status);
    return results.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  },

  /** Owner accepts/rejects order */
  respondToOrder: async (orderId, action, reason = '') => {
    await delay(600);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found.');
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    orders[idx].status = newStatus;
    orders[idx].statusHistory.push({
      status: newStatus,
      time: new Date().toISOString(),
      note: action === 'accept' ? 'Order accepted by store' : `Order rejected: ${reason}`,
    });
    if (action === 'reject') orders[idx].rejectionReason = reason;
    return orders[idx];
  },

  /** Owner updates order status (preparing → ready) */
  updateOrderStatus: async (orderId, newStatus, note = '') => {
    await delay(500);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found.');
    orders[idx].status = newStatus;
    orders[idx].statusHistory.push({ status: newStatus, time: new Date().toISOString(), note });
    if (newStatus === 'delivered') orders[idx].actualDelivery = new Date().toISOString();
    return orders[idx];
  },

  /** Delivery partner updates delivery step */
  updateDeliveryStep: async (orderId, step, data = {}) => {
    await delay(500);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found.');
    const statusMap = {
      arrived_store: 'preparing',
      picked_up: 'picked_up',
      in_transit: 'in_transit',
      delivered: 'delivered',
    };
    const newStatus = statusMap[step] || step;
    orders[idx].status = newStatus;
    orders[idx].statusHistory.push({ status: newStatus, time: new Date().toISOString(), note: data.note || '' });
    if (newStatus === 'delivered') {
      orders[idx].actualDelivery = new Date().toISOString();
      orders[idx].proofOfDelivery = true;
    }
    return orders[idx];
  },

  /** Cancel order (customer) */
  cancelOrder: async (orderId, reason) => {
    await delay(600);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found.');
    const cancellable = ['placed', 'accepted'];
    if (!cancellable.includes(orders[idx].status)) throw new Error('Order cannot be cancelled at this stage.');
    orders[idx].status = 'cancelled';
    orders[idx].cancellationReason = reason;
    orders[idx].statusHistory.push({ status: 'cancelled', time: new Date().toISOString(), note: `Cancelled: ${reason}` });
    return orders[idx];
  },

  /** Get delivery partner assigned orders */
  getDeliveryOrders: async (partnerId, { status } = {}) => {
    await delay(500);
    let results = orders.filter(o => o.deliveryPartnerId === partnerId);
    if (status) results = results.filter(o => o.status === status);
    return results.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  },

  /** Assign delivery partner */
  assignDeliveryPartner: async (orderId, partnerId, partnerName, partnerPhone, vehicle) => {
    await delay(400);
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) throw new Error('Order not found.');
    orders[idx].deliveryPartnerId = partnerId;
    orders[idx].deliveryPartnerName = partnerName;
    orders[idx].deliveryPartnerPhone = partnerPhone;
    orders[idx].deliveryPartnerVehicle = vehicle;
    return orders[idx];
  },

  /** Get all orders (admin) */
  getAllOrders: async ({ status, storeId, customerId } = {}) => {
    await delay(500);
    let results = [...orders];
    if (status) results = results.filter(o => o.status === status);
    if (storeId) results = results.filter(o => o.storeId === storeId);
    if (customerId) results = results.filter(o => o.customerId === customerId);
    return results.sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt));
  },

  // ---- DISPUTES ----

  /** Get disputes */
  getDisputes: async ({ customerId, status } = {}) => {
    await delay(400);
    let results = [...disputes];
    if (customerId) results = results.filter(d => d.customerId === customerId);
    if (status) results = results.filter(d => d.status === status);
    return results;
  },

  /** File dispute */
  fileDispute: async (orderId, customerId, storeId, type, description) => {
    await delay(600);
    const existing = disputes.find(d => d.orderId === orderId);
    if (existing) throw new Error('A dispute already exists for this order.');
    const newDispute = {
      id: genId('dis'),
      orderId, customerId, storeId, type, description,
      status: 'open', evidence: [], resolution: null, refundAmount: null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      thread: [{ author: 'Customer', text: description, time: new Date().toISOString() }],
    };
    disputes.push(newDispute);
    return newDispute;
  },

  /** Resolve dispute (admin) */
  resolveDispute: async (disputeId, action, resolution, refundAmount = 0) => {
    await delay(500);
    const idx = disputes.findIndex(d => d.id === disputeId);
    if (idx === -1) throw new Error('Dispute not found.');
    disputes[idx].status = action; // 'resolved' | 'escalated' | 'closed'
    disputes[idx].resolution = resolution;
    disputes[idx].refundAmount = refundAmount;
    disputes[idx].updatedAt = new Date().toISOString();
    disputes[idx].thread.push({ author: 'Admin', text: resolution, time: new Date().toISOString() });
    return disputes[idx];
  },

  /** Get dispute analytics (admin dashboard KPIs) */
  getDashboardKPIs: async () => {
    await delay(600);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayOrders = orders.filter(o => new Date(o.placedAt) >= todayStart);
    const gmv = orders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0);
    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalRevenue: gmv,
      activeUsers: 9,
      totalStores: 14,
      pendingApprovals: 1,
      openDisputes: disputes.filter(d => d.status === 'open').length,
    };
  },
};
