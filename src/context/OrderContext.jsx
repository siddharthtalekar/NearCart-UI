// src/context/OrderContext.jsx — Orders state context
import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { orderService } from '../services/orderService.js';
import { useAuth } from './AuthContext.jsx';
import { useNotifications } from './NotificationContext.jsx';

const OrderContext = createContext(null);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

function orderReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_CURRENT_ORDER':
      return { ...state, currentOrder: action.payload };
    case 'ORDER_CREATED':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        currentOrder: action.payload,
      };
    case 'ORDER_UPDATED':
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? action.payload
            : state.currentOrder,
      };
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  const loadCustomerOrders = useCallback(async () => {
    if (!user?.id) return;
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await orderService.getCustomerOrders(user.id);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.role === 'customer') {
      loadCustomerOrders();
    }
  }, [user, loadCustomerOrders]);

  const placeOrder = async (orderPayload, idempotencyKey) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const created = await orderService.placeOrder(orderPayload, idempotencyKey);
      dispatch({ type: 'ORDER_CREATED', payload: created });
      addNotification({
        title: 'Order Placed!',
        message: `Your order #${created.id} has been placed successfully.`,
        type: 'order_status',
        link: `/customer/orders/${created.id}`,
      });
      return created;
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
      throw err;
    }
  };

  const cancelOrder = async (orderId, reason) => {
    try {
      const updated = await orderService.cancelOrder(orderId, reason);
      dispatch({ type: 'ORDER_UPDATED', payload: updated });
      addNotification({
        title: 'Order Cancelled',
        message: `Order #${orderId} was cancelled.`,
        type: 'order_status',
        link: `/customer/orders/${orderId}`,
      });
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const setCurrentOrder = (order) => {
    dispatch({ type: 'SET_CURRENT_ORDER', payload: order });
  };

  return (
    <OrderContext.Provider
      value={{
        ...state,
        loadCustomerOrders,
        placeOrder,
        cancelOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}
