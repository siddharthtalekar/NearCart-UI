// src/context/NotificationContext.jsx — Notification context

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService.js';
import { useAuth } from './AuthContext.jsx';

const NotificationContext = createContext(null);

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

function notifReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, unreadCount: action.payload.filter(n => !n.isRead).length };
    case 'MARK_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => n.id === action.payload ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    case 'MARK_ALL_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0,
      };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(notifReducer, initialState);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const notifs = await notificationService.getNotifications(user.id);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: notifs });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id) => {
    await notificationService.markRead(id);
    dispatch({ type: 'MARK_READ', payload: id });
  };

  const markAllRead = async () => {
    if (!user) return;
    await notificationService.markAllRead(user.id);
    dispatch({ type: 'MARK_ALL_READ' });
  };

  const addNotification = (notif) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notif });
  };

  const value = { ...state, fetchNotifications, markRead, markAllRead, addNotification };
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
