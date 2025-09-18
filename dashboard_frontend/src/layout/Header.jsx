import React from 'react';

export default function Header({ onToggleTheme, theme }) {
  /** Header with brand, title, and quick actions (theme toggle, help). */
  return (
    <header className="app-header header" role="banner">
      <div className="brand" aria-label="Ocean Professional Dashboard">
        <div className="logo" aria-hidden="true" />
        <span>Excel DataViz</span>
        <span className="badge" title="Theme">Ocean Professional</span>
      </div>
      <div className="actions">
        <button className="btn ghost" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        <a
          className="btn secondary"
          aria-label="Help and docs"
          href="#usage"
          onClick={(e) => {
            const el = document.getElementById('usage');
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          ❓ Help
        </a>
      </div>
    </header>
  );
}
