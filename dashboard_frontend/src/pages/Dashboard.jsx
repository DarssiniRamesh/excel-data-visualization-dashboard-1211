import React, { useContext, useMemo } from 'react';
import { DataContext } from '../context';
import { ChartsPanel } from '../components/charts';
import { DataTable } from '../components/tables';

/**
 * PUBLIC_INTERFACE
 * Dashboard page renders KPIs, charts, and table using DataContext.
 */
export default function Dashboard() {
  const { filteredRows, aggregates, columns, valueColumns, filters, lastAction } = useContext(DataContext);

  const kpiTotal = filteredRows.length;
  const kpiCategories = useMemo(() => {
    if (!filteredRows.length) return 0;
    const set = new Set(filteredRows.map((r) => r[filters.categoryField] ?? '—'));
    return set.size;
  }, [filteredRows, filters.categoryField]);

  return (
    <div className="main app-main">
      <div className="container">
        {/* KPI cards */}
        <div className="section-grid" style={{ marginBottom: 16 }}>
          <div className="col-4">
            <div className="card" style={{ padding: 16 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Total Records</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{kpiTotal}</div>
              <div className="badge" style={{ marginTop: 8 }}>{columns.length ? 'Filtered' : 'Awaiting data'}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ padding: 16 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Categories</div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{kpiCategories}</div>
              <div className="badge" style={{ marginTop: 8, background: 'rgba(245, 158, 11, 0.12)', color: 'var(--color-secondary)', borderColor: 'rgba(245,158,11,.3)' }}>
                {filters.categoryField || '—'}
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ padding: 16 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Last Updated</div>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.2 }}>{lastAction || '—'}</div>
              <div className="badge" style={{ marginTop: 8 }}>Runtime</div>
            </div>
          </div>
        </div>

        {/* Charts and table layout */}
        <div className="section-grid">
          <div className="col-8">
            <div className="card" style={{ padding: 16, height: 360 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Trend Chart</div>
              <ChartsPanel rows={filteredRows} columns={columns} valueColumns={valueColumns} />
            </div>
          </div>
          <div className="col-4">
            <div className="card" style={{ padding: 16, height: 360 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>Breakdown</div>
              {/* Render a small pie using aggregates if available */}
              <div style={{ height: 280 }}>
                {/* Reuse ChartsPanel with pie? Keep simple pie by transforming aggregates */}
                {/* Minimal Pie using recharts PieChart */}
                {/* Inline to avoid extra file: */}
                {/* eslint-disable-next-line */}
                {(() => {
                  if (!aggregates.length) return <div className="placeholder" style={{ height: 280 }}>Awaiting data</div>;
                  const Recharts = require('recharts');
                  const { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } = Recharts;
                  const colors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];
                  return (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie data={aggregates} dataKey="value" nameKey="name" outerRadius={100} innerRadius={50} label>
                          {aggregates.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  );
                })()}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '16px 16px 8px' }}>
                <div className="section-title">Data Table</div>
              </div>
              <div style={{ padding: 16, borderTop: '1px solid var(--border)' }}>
                <DataTable rows={filteredRows} />
              </div>
            </div>
          </div>
        </div>

        <div id="usage" style={{ marginTop: 24 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="section-title" style={{ marginBottom: 8 }}>Usage</div>
            <ol>
              <li>Upload an Excel (.xlsx) file from the sidebar or drag & drop into the upload area.</li>
              <li>Select the active sheet and choose Date/Category/Value columns to unlock filters and charts.</li>
              <li>Adjust date range and category contains filter to refine the dataset.</li>
              <li>Use chart dropdowns to switch chart types and axes.</li>
              <li>Sort and paginate the table; theme preference and filters persist automatically.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
