// src/services/authService.js — Auth mock service

import { mockUsers } from '../data/users.js';
import { delay, genId, storage } from '../utils/helpers.js';

let users = [...mockUsers];

export const authService = {
  /** Login — returns user object */
  login: async (email, password) => {
    await delay(300);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    let user = users.find(
      u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    );
    if (!user) {
      user = mockUsers.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
      );
    }

    // Role-based demo convenience fallback
    if (!user) {
      if (cleanEmail === 'customer@demo.com') user = mockUsers.find(u => u.role === 'customer');
      else if (cleanEmail === 'owner@demo.com') user = mockUsers.find(u => u.role === 'owner');
      else if (cleanEmail === 'delivery@demo.com') user = mockUsers.find(u => u.role === 'delivery');
      else if (cleanEmail === 'admin@demo.com') user = mockUsers.find(u => u.role === 'admin');
    }

    if (!user) throw new Error('Invalid email or password. Use demo1234 for demo accounts.');
    if (user.status === 'suspended') throw new Error('Your account has been suspended. Contact support.');
    const { password: _, ...safeUser } = user;
    storage.set('nc_user', safeUser);
    return safeUser;
  },

  /** Register */
  register: async ({ name, email, password, phone, role }) => {
    await delay(800);
    if (users.find(u => u.email === email)) throw new Error('Email already registered.');
    const newUser = {
      id: genId('u'),
      name, email, password, phone, role,
      avatar: null,
      status: role === 'customer' ? 'active' : 'pending',
      verificationStatus: role === 'delivery' ? 'pending' : undefined,
      addresses: role === 'customer' ? [] : undefined,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  /** Logout */
  logout: async () => {
    await delay(200);
    storage.remove('nc_user');
  },

  /** Get session from storage */
  getSession: () => storage.get('nc_user'),

  /** Forgot password (mock) */
  forgotPassword: async (email) => {
    await delay(600);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('No account found with this email.');
    return { message: `Password reset link sent to ${email}` };
  },

  /** Update user profile */
  updateProfile: async (userId, updates) => {
    await delay(500);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    users[idx] = { ...users[idx], ...updates };
    const { password: _, ...safeUser } = users[idx];
    storage.set('nc_user', safeUser);
    return safeUser;
  },

  /** Get all users (admin) */
  getAllUsers: async () => {
    await delay(500);
    return users.map(({ password: _, ...u }) => u);
  },

  /** Suspend / reactivate user (admin) */
  setUserStatus: async (userId, status) => {
    await delay(400);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User not found.');
    users[idx].status = status;
    return { ...users[idx] };
  },
};
