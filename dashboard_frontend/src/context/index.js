export { DataContext, DataProvider } from './DataContext';

/**
 * PUBLIC_INTERFACE
 * readThemePreference
 * Reads theme from localStorage or system preference; returns 'light' | 'dark'
 */
export function readThemePreference() {
  try {
    const saved = localStorage.getItem('op_theme');
    if (saved) return saved;
  } catch {}
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  return mq && mq.matches ? 'dark' : 'light';
}

/**
 * PUBLIC_INTERFACE
 * saveThemePreference
 * Persists theme to localStorage
 */
export function saveThemePreference(theme) {
  try {
    localStorage.setItem('op_theme', theme);
  } catch {}
}
