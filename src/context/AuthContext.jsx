// src/context/AuthContext.jsx — Authentication context

import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { storage } from '../utils/helpers.js';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isLoading: true, // start true to check session
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS': return { ...state, user: action.payload, isLoading: false, error: null };
    case 'LOGOUT': return { ...state, user: null, isLoading: false, error: null };
    case 'SET_ERROR': return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_USER': return { ...state, user: { ...state.user, ...action.payload } };
    default: return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on mount
  useEffect(() => {
    const session = authService.getSession();
    if (session) dispatch({ type: 'LOGIN_SUCCESS', payload: session });
    else dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return user;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  };

  const register = async (data) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const user = await authService.register(data);
      // Don't auto-login for non-customer roles (they need approval)
      if (user.role === 'customer') dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      else dispatch({ type: 'SET_LOADING', payload: false });
      return user;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      throw err;
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (updates) => {
    dispatch({ type: 'UPDATE_USER', payload: updates });
    // Persist
    const updated = { ...state.user, ...updates };
    storage.set('nc_user', updated);
  };

  const demoLogin = async (role = 'customer') => {
    const demoMap = {
      customer: 'customer@demo.com',
      owner: 'owner@demo.com',
      delivery: 'delivery@demo.com',
      admin: 'admin@demo.com',
    };
    return login(demoMap[role] || 'customer@demo.com', 'demo1234');
  };

  const clearError = () => dispatch({ type: 'SET_ERROR', payload: null });

  const value = {
    ...state,
    isAuthenticated: Boolean(state.user),
    loading: state.isLoading,
    login,
    demoLogin,
    register,
    logout,
    updateUser,
    clearError,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
