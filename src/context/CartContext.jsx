// src/context/CartContext.jsx — Shopping cart context

import { createContext, useContext, useReducer } from 'react';
import { genIdempotencyKey } from '../utils/helpers.js';

const CartContext = createContext(null);

const initialState = {
  items: [],        // [{ product, qty, storeId, storeName }]
  coupon: null,     // applied coupon object
  idempotencyKey: genIdempotencyKey(),
};

function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const { product, qty = 1 } = action.payload;
      // Cart is per-store; if different store, we DON'T auto-clear — caller handles that
      const existing = state.items.find(i => i.product.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === product.id
              ? { ...i, qty: Math.min(i.qty + qty, i.product.stock) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, {
          product,
          qty: Math.min(qty, product.stock),
          storeId: product.storeId,
          storeName: product.store?.name || '',
        }],
      };
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.product.id !== action.payload) };

    case 'UPDATE_QTY': {
      const { productId, qty } = action.payload;
      if (qty <= 0) return { ...state, items: state.items.filter(i => i.product.id !== productId) };
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === productId
            ? { ...i, qty: Math.min(qty, i.product.stock) }
            : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...initialState, idempotencyKey: genIdempotencyKey() };

    case 'CLEAR_STORE_ITEMS':
      return { ...state, items: state.items.filter(i => i.storeId !== action.payload), coupon: null };

    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };

    case 'REMOVE_COUPON':
      return { ...state, coupon: null };

    case 'UPDATE_PRICES': {
      // Called at checkout re-validation; updates prices based on latest service data
      const priceMap = action.payload; // { productId: newPrice }
      return {
        ...state,
        items: state.items.map(i => ({
          ...i,
          priceChanged: priceMap[i.product.id] && priceMap[i.product.id] !== i.product.price,
          product: { ...i.product, price: priceMap[i.product.id] ?? i.product.price },
        })),
      };
    }

    default: return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Computed values
  const itemCount = state.items.reduce((s, i) => s + i.qty, 0);

  // Group items by store
  const itemsByStore = state.items.reduce((acc, item) => {
    if (!acc[item.storeId]) acc[item.storeId] = { storeId: item.storeId, storeName: item.storeName, items: [] };
    acc[item.storeId].items.push(item);
    return acc;
  }, {});

  // Get unique store IDs
  const storeIds = [...new Set(state.items.map(i => i.storeId))];

  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);

  const addItem = (product, qty = 1) => dispatch({ type: 'ADD_ITEM', payload: { product, qty } });
  const removeItem = (productId) => dispatch({ type: 'REMOVE_ITEM', payload: productId });
  const updateQty = (productId, qty) => dispatch({ type: 'UPDATE_QTY', payload: { productId, qty } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const clearStoreItems = (storeId) => dispatch({ type: 'CLEAR_STORE_ITEMS', payload: storeId });
  const applyCoupon = (coupon) => dispatch({ type: 'APPLY_COUPON', payload: coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  const getItemQty = (productId) => state.items.find(i => i.product.id === productId)?.qty || 0;
  const isInCart = (productId) => state.items.some(i => i.product.id === productId);

  const value = {
    ...state,
    itemCount, itemsByStore, storeIds, subtotal,
    addItem, removeItem, updateQty, clearCart, clearStoreItems,
    applyCoupon, removeCoupon, getItemQty, isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
