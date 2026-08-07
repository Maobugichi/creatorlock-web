'use client';

import { useState, useCallback, useRef } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (localStorage.getItem('theme') as Theme | null) ?? 'light';
  });

  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const listenerRef = useRef<(() => void) | null>(null);

  const applySystem = useCallback(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const detachListener = useCallback(() => {
    if (mediaQueryRef.current && listenerRef.current) {
      mediaQueryRef.current.removeEventListener('change', listenerRef.current);
    }
    mediaQueryRef.current = null;
    listenerRef.current = null;
  }, []);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem('theme', next);
    setThemeState(next);
    detachListener();

    if (next === 'system') {
      applySystem();
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applySystem();
      mql.addEventListener('change', listener);
      mediaQueryRef.current = mql;
      listenerRef.current = listener;
    } else {
      document.documentElement.classList.toggle('dark', next === 'dark');
    }
  }, [applySystem, detachListener]);

  return { theme, setTheme };
}