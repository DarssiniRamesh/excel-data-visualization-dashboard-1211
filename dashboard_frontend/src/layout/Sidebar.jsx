import React from 'react';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar with upload area and filter placeholders ready for integration. */
  return (
    <aside className="app-sidebar sidebar" role="complementary" aria-label="Controls">
      <div className="section">
        <div className="section-title">Data Import</div>
        <div className="panel">
          <div className="placeholder" role="group" aria-label="Upload">
            <p style={{ marginTop: 0, marginBottom: 12 }}>
              Drag & drop Excel file here, or click to select.
            </p>
            <button className="btn" type="button">Upload .xlsx</button>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Filters</div>
        <div className="panel">
          <div style={{ display: 'grid', gap: 10 }}>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Date Range</div>
              <select className="select" defaultValue="last_30">
                <option value="last_7">Last 7 days</option>
                <option value="last_30">Last 30 days</option>
                <option value="qtd">Quarter to date</option>
                <option value="ytd">Year to date</option>
              </select>
            </label>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Category</div>
              <input className="input" placeholder="Type to filter…" />
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn">Apply</button>
              <button className="btn ghost">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
