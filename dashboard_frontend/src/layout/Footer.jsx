import React from 'react';

// PUBLIC_INTERFACE
export default function Footer({ status = "Ready", rows = 0, lastUpdated = null }) {
  /** Footer status bar showing simple session info. */
  return (
    <footer className="app-footer footer" role="contentinfo" aria-label="Status bar">
      <div>
        <strong>Status:</strong> {status}
        {lastUpdated ? (
          <span style={{ marginLeft: 10, color: 'var(--text-muted)' }}>
            • Updated {lastUpdated}
          </span>
        ) : null}
      </div>
      <div>
        <span className="badge" title="Loaded rows">Rows: {rows}</span>
      </div>
    </footer>
  );
}
