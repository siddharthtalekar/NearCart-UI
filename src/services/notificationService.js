// src/services/notificationService.js — Notification mock service

import { mockNotifications } from '../data/offers.js';
import { delay, genId } from '../utils/helpers.js';

let notifications = [...mockNotifications];

export const notificationService = {
  /** Get notifications for a user */
  getNotifications: async (userId) => {
    await delay(300);
    return notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /** Mark notification as read */
  markRead: async (notificationId) => {
    await delay(200);
    const idx = notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) notifications[idx].isRead = true;
  },

  /** Mark all as read */
  markAllRead: async (userId) => {
    await delay(200);
    notifications.forEach(n => { if (n.userId === userId) n.isRead = true; });
  },

  /** Add notification (used internally by other services) */
  addNotification: async (notification) => {
    await delay(100);
    const n = { id: genId('n'), isRead: false, createdAt: new Date().toISOString(), ...notification };
    notifications.push(n);
    return n;
  },

  /** Get unread count */
  getUnreadCount: async (userId) => {
    await delay(100);
    return notifications.filter(n => n.userId === userId && !n.isRead).length;
  },
};
