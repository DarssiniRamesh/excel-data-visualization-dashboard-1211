import React, { useEffect, useState } from 'react';
import './index.css';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import Dashboard from './pages/Dashboard';

/**
 * PUBLIC_INTERFACE
 * App assembles the main application layout: header, sidebar, main content, footer.
 */
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // For future dark theme, we can toggle data-theme here if needed.
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-shell">
      <Header onToggleTheme={toggleTheme} theme={theme} />
      <Sidebar />
      <Dashboard />
      <Footer status="Ready" rows={0} />
    </div>
  );
}

export default App;
