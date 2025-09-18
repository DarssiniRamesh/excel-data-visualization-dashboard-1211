import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts';

/**
 * PUBLIC_INTERFACE
 * ChartsPanel provides dropdowns to select axes from columns and renders chosen chart type.
 */
export default function ChartsPanel({ rows, columns, valueColumns }) {
  const [chartType, setChartType] = useState('bar');
  const [xKey, setXKey] = useState(columns[0] || null);
  const [yKey, setYKey] = useState(valueColumns[0] || null);

  // Prepare data for chart rendering (coerce y to number)
  const chartData = useMemo(() => {
    if (!rows || !rows.length || !xKey || !yKey) return [];
    return rows.map((r) => ({
      x: r[xKey],
      y: typeof r[yKey] === 'number' ? r[yKey] : parseFloat(r[yKey]),
    })).filter((d) => !isNaN(d.y));
  }, [rows, xKey, yKey]);

  const colors = ['#2563EB', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <label>
          <div className="section-title" style={{ marginBottom: 6 }}>Chart</div>
          <select className="select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="pie">Pie</option>
          </select>
        </label>
        <label>
          <div className="section-title" style={{ marginBottom: 6 }}>X</div>
          <select className="select" value={xKey || ''} onChange={(e) => setXKey(e.target.value)}>
            {columns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <div className="section-title" style={{ marginBottom: 6 }}>Y</div>
          <select className="select" value={yKey || ''} onChange={(e) => setYKey(e.target.value)}>
            {valueColumns.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        {!chartData.length ? (
          <div className="placeholder" style={{ height: 280 }}>
            Select columns to render a chart.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="y" name={yKey} fill="#2563EB" />
              </BarChart>
            )}
            {chartType === 'line' && (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="y" name={yKey} stroke="#2563EB" strokeWidth={2} dot={false} />
              </LineChart>
            )}
            {chartType === 'area' && (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="y" name={yKey} stroke="#2563EB" fill="url(#colorY)" />
              </AreaChart>
            )}
            {chartType === 'pie' && (
              <PieChart>
                <Tooltip />
                <Legend />
                <Pie data={chartData} dataKey="y" nameKey="x" outerRadius={100} innerRadius={50} label>
                  {chartData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
