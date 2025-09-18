import React, { useEffect, useMemo, useState, useContext } from 'react';
import './index.css';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import Dashboard from './pages/Dashboard';
import { DataProvider, DataContext, readThemePreference, saveThemePreference } from './context';

/**
 * PUBLIC_INTERFACE
 * App assembles the main application layout: header, sidebar, main content, footer.
 */
function AppInner() {
  const [theme, setTheme] = useState(readThemePreference());
  const { filteredRows, lastAction, lastFileName } = useContext(DataContext);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveThemePreference(theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const footerStatus = useMemo(() => {
    const name = lastFileName ? `File: ${lastFileName}` : 'No file loaded';
    return `${name}${lastAction ? ` • ${lastAction}` : ''}`;
  }, [lastFileName, lastAction]);

  return (
    <div className="app-shell">
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <Sidebar />
      <Dashboard />
      <Footer status={footerStatus} rows={filteredRows.length} lastUpdated={lastAction} />
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppInner />
    </DataProvider>
  );
}
