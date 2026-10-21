// src/services/storeService.js — Store and product service layer

import { mockStores, categories } from '../data/stores.js';
import { mockProducts } from '../data/products.js';
import { mockOffers } from '../data/offers.js';
import { delay, genId } from '../utils/helpers.js';

let stores = [...mockStores];
let products = [...mockProducts];
let offers = [...mockOffers];

export const storeService = {
  // ---- STORES ----

  /** Get all approved stores near delivery location */
  getNearbyStores: async ({ search = '', category = '', sortBy = 'distance' } = {}) => {
    await delay(500);
    let results = stores.filter(s => s.status === 'approved');
    if (search) results = results.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    if (category) results = results.filter(s => s.category === category);
    if (sortBy === 'rating') results = [...results].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'distance') results = [...results].sort((a, b) => a.distanceKm - b.distanceKm);
    else if (sortBy === 'delivery_fee') results = [...results].sort((a, b) => a.deliveryFee - b.deliveryFee);
    return results;
  },

  /** Get single store */
  getStore: async (storeId) => {
    await delay(400);
    return stores.find(s => s.id === storeId) || null;
  },

  /** Get stores owned by a user */
  getOwnerStore: async (ownerId) => {
    await delay(300);
    return stores.find(s => s.ownerId === ownerId) || null;
  },

  /** Get all stores (admin) */
  getAllStores: async () => {
    await delay(400);
    return [...stores];
  },

  /** Register new store */
  registerStore: async (ownerId, data) => {
    await delay(1000);
    const newStore = {
      id: genId('s'),
      ownerId,
      ...data,
      rating: 0, reviewCount: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    stores.push(newStore);
    return newStore;
  },

  /** Update store (owner) */
  updateStore: async (storeId, updates) => {
    await delay(500);
    const idx = stores.findIndex(s => s.id === storeId);
    if (idx === -1) throw new Error('Store not found.');
    stores[idx] = { ...stores[idx], ...updates };
    return stores[idx];
  },

  /** Approve/reject store (admin) */
  setStoreStatus: async (storeId, status, reason = '') => {
    await delay(400);
    const idx = stores.findIndex(s => s.id === storeId);
    if (idx === -1) throw new Error('Store not found.');
    stores[idx].status = status;
    stores[idx].rejectionReason = reason;
    return stores[idx];
  },

  // ---- PRODUCTS ----

  /** Get products for a store */
  getStoreProducts: async (storeId, { search = '', category = '' } = {}) => {
    await delay(400);
    let results = products.filter(p => p.storeId === storeId && p.isEnabled);
    if (search) results = results.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category) results = results.filter(p => p.category === category);
    return results;
  },

  /** Get all products for owner's store (includes disabled) */
  getOwnerProducts: async (storeId) => {
    await delay(400);
    return products.filter(p => p.storeId === storeId);
  },

  /** Search products across all stores */
  searchProducts: async ({ q = '', category = '', minPrice, maxPrice, brand, inStock, sortBy = 'relevance' } = {}) => {
    await delay(600);
    let results = products.filter(p => p.isEnabled);
    if (q) results = results.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.brand?.toLowerCase().includes(q.toLowerCase()) ||
      p.description?.toLowerCase().includes(q.toLowerCase())
    );
    if (category) results = results.filter(p => p.category === category);
    if (brand) results = results.filter(p => p.brand?.toLowerCase().includes(brand.toLowerCase()));
    if (minPrice !== undefined) results = results.filter(p => p.price >= minPrice);
    if (maxPrice !== undefined) results = results.filter(p => p.price <= maxPrice);
    if (inStock) results = results.filter(p => p.stock > 0);

    if (sortBy === 'price_asc') results.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') results.sort((a, b) => b.price - a.price);

    // Attach store info
    return results.map(p => ({
      ...p,
      store: stores.find(s => s.id === p.storeId),
    }));
  },

  /** Get price comparison for a product (same name+brand+size+variant across stores) */
  getPriceComparison: async (productId) => {
    await delay(500);
    const base = products.find(p => p.id === productId);
    if (!base) return { exact: [], similar: [] };

    // Exact match: same name, brand, size, variant
    const exact = products
      .filter(p => p.id !== productId && p.isEnabled &&
        p.name === base.name &&
        p.brand === base.brand &&
        p.size === base.size &&
        p.variant === base.variant
      )
      .map(p => ({ ...p, store: stores.find(s => s.id === p.storeId) }));

    // Similar: same name+brand but different size/variant
    const similar = products
      .filter(p => p.isEnabled &&
        p.name === base.name && p.brand === base.brand &&
        (p.size !== base.size || p.variant !== base.variant)
      )
      .map(p => ({ ...p, store: stores.find(s => s.id === p.storeId) }));

    return {
      base: { ...base, store: stores.find(s => s.id === base.storeId) },
      exact,
      similar,
    };
  },

  /** Get single product */
  getProduct: async (productId) => {
    await delay(300);
    const p = products.find(p => p.id === productId);
    if (!p) return null;
    return { ...p, store: stores.find(s => s.id === p.storeId) };
  },

  /** Add product (owner) */
  addProduct: async (data) => {
    await delay(600);
    const newProduct = { id: genId('p'), isEnabled: true, ...data };
    products.push(newProduct);
    return newProduct;
  },

  /** Update product (owner) */
  updateProduct: async (productId, updates) => {
    await delay(500);
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) throw new Error('Product not found.');
    products[idx] = { ...products[idx], ...updates };
    return products[idx];
  },

  /** Bulk stock update */
  bulkUpdateStock: async (updates) => {
    await delay(700);
    updates.forEach(({ id, stock }) => {
      const idx = products.findIndex(p => p.id === id);
      if (idx !== -1) products[idx].stock = stock;
    });
    return true;
  },

  // ---- OFFERS ----

  /** Get offers for store */
  getStoreOffers: async (storeId) => {
    await delay(300);
    return offers.filter(o => o.storeId === storeId);
  },

  /** Add offer */
  addOffer: async (data) => {
    await delay(500);
    const newOffer = { id: genId('offer'), usageCount: 0, ...data };
    offers.push(newOffer);
    return newOffer;
  },

  /** Update offer */
  updateOffer: async (offerId, updates) => {
    await delay(400);
    const idx = offers.findIndex(o => o.id === offerId);
    if (idx === -1) throw new Error('Offer not found.');
    offers[idx] = { ...offers[idx], ...updates };
    return offers[idx];
  },

  /** Validate coupon code */
  validateCoupon: async (code, storeId, subtotal) => {
    await delay(400);
    const offer = offers.find(o => o.code === code && o.storeId === storeId && o.isActive);
    if (!offer) throw new Error('Invalid or expired coupon code.');
    if (subtotal < offer.minOrder) throw new Error(`Minimum order ₹${offer.minOrder} required for this coupon.`);
    return offer;
  },

  // ---- CATEGORIES ----
  getCategories: async () => {
    await delay(200);
    return categories;
  },
};
