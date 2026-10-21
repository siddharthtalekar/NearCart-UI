// src/hooks/useTheme.js — Dark/light mode hook

import { useState, useEffect } from 'react';
import { storage } from '../utils/helpers.js';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = storage.get('nc_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storage.set('nc_theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const setDark  = () => setTheme('dark');
  const setLight = () => setTheme('light');

  return { theme, toggle, setDark, setLight };
}
