import React, { useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * DataTable renders a sortable, paginated table for a list of objects.
 */
export default function DataTable({ rows, pageSizeOptions = [10, 25, 50] }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] || 10);

  const columns = useMemo(() => {
    if (!rows || !rows.length) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  const sorted = useMemo(() => {
    if (!rows) return [];
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va == null && vb == null) return 0;
      if (va == null) return sortDir === 'asc' ? -1 : 1;
      if (vb == null) return sortDir === 'asc' ? 1 : -1;
      if (typeof va === 'number' && typeof vb === 'number') {
        return sortDir === 'asc' ? va - vb : vb - va;
      }
      const sa = String(va).toLowerCase();
      const sb = String(vb).toLowerCase();
      if (sa < sb) return sortDir === 'asc' ? -1 : 1;
      if (sa > sb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const pageCount = useMemo(() => {
    if (!sorted.length) return 1;
    return Math.max(1, Math.ceil(sorted.length / pageSize));
  }, [sorted, pageSize]);

  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize]);

  function onSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <label>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 8 }}>Page size</span>
          <select
            className="select"
            aria-label="Page size"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
        <div className="badge" aria-live="polite">{sorted.length} rows</div>
      </div>
      <table
        role="table"
        aria-label="Data table"
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                role="columnheader"
                onClick={() => onSort(col)}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSort(col)}
                style={{
                  textAlign: 'left',
                  padding: 12,
                  background: 'var(--surface)',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  borderLeft: '1px solid var(--border)',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                aria-sort={sortKey === col ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                {col} {sortKey === col ? (sortDir === 'asc' ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageRows.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td
                  key={col}
                  role="cell"
                  style={{
                    padding: 12,
                    borderLeft: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    background: '#fff',
                  }}
                >
                  {String(row[col] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {!pageRows.length && (
            <tr>
              <td colSpan={columns.length} style={{ padding: 16, color: 'var(--text-muted)' }}>
                No data to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
        <button className="btn ghost" onClick={() => setPage(1)} disabled={page === 1} aria-label="First page">« First</button>
        <button className="btn ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">‹ Prev</button>
        <div className="badge" aria-live="polite">Page {page} / {pageCount}</div>
        <button className="btn ghost" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} aria-label="Next page">Next ›</button>
        <button className="btn ghost" onClick={() => setPage(pageCount)} disabled={page === pageCount} aria-label="Last page">Last »</button>
      </div>
    </div>
  );
}
