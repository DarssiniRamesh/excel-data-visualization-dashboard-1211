import React, { useCallback, useRef, useState, useContext } from 'react';
import { parseExcelFile, validateTemplate, downloadExcelTemplate } from '../services/excel';
import { DataContext } from '../context';

export default function Sidebar() {
  const { setWorkbook, workbookData, currentSheet, setCurrentSheet, columns, filters, setFilterField, clearAll } = useContext(DataContext);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragOver(false);
    setError('');
    const file = e.dataTransfer.files?.[0];
    if (file) await handleFile(file);
  }, []);

  const handleFile = useCallback(async (file) => {
    try {
      const data = await parseExcelFile(file);
      if (!data.sheetNames.length) {
        setError('No sheets found in Excel file.');
        return;
      }
      // Validate first sheet against template but allow any structure
      const firstRows = data.sheets[data.sheetNames[0]];
      const validation = validateTemplate(firstRows);
      if (!validation.valid) {
        // Not a hard error; allow custom schema but show info
        console.warn(validation.message);
      }
      setWorkbook(data, file.name);
    } catch (err) {
      console.error(err);
      setError('Failed to parse Excel. Please ensure it is a valid .xlsx file.');
    }
  }, [setWorkbook]);

  const onSelectFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  return (
    <aside className="app-sidebar sidebar" role="complementary" aria-label="Controls">
      <div className="section">
        <div className="section-title">Data Import</div>
        <div className="panel">
          <div
            className="placeholder"
            role="group"
            aria-label="Upload"
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            style={{
              borderColor: dragOver ? 'var(--color-primary)' : 'var(--border)',
              background: dragOver ? 'rgba(37,99,235,0.05)' : '#fff',
              cursor: 'pointer'
            }}
          >
            <p style={{ marginTop: 0, marginBottom: 12 }}>
              Drag & drop Excel file here, or click to select.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn" type="button">Upload .xlsx</button>
              <button className="btn ghost" type="button" onClick={(e) => { e.stopPropagation(); downloadExcelTemplate(); }}>
                Download Excel Template
              </button>
              <button className="btn secondary" type="button" onClick={(e) => { e.stopPropagation(); clearAll(); }}>
                Clear
              </button>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls"
              style={{ display: 'none' }}
              onChange={onSelectFile}
              aria-label="File input"
            />
            {error && <div style={{ marginTop: 10, color: 'var(--color-error)' }} role="alert">{error}</div>}
          </div>
          {workbookData?.sheetNames?.length ? (
            <div style={{ marginTop: 12 }}>
              <label>
                <div className="section-title" style={{ marginBottom: 6 }}>Sheet</div>
                <select
                  className="select"
                  value={currentSheet || ''}
                  onChange={(e) => setCurrentSheet(e.target.value)}
                  aria-label="Select sheet"
                >
                  {workbookData.sheetNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
          ) : null}
        </div>
      </div>

      <div className="section">
        <div className="section-title">Filters</div>
        <div className="panel">
          <div style={{ display: 'grid', gap: 10 }}>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Date Range</div>
              <select
                className="select"
                value={filters.dateRange}
                onChange={(e) => setFilterField('dateRange', e.target.value)}
                aria-label="Date range"
              >
                <option value="last_7">Last 7 days</option>
                <option value="last_30">Last 30 days</option>
                <option value="qtd">Quarter to date</option>
                <option value="ytd">Year to date</option>
              </select>
            </label>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Date Column</div>
              <select
                className="select"
                value={filters.dateField || ''}
                onChange={(e) => setFilterField('dateField', e.target.value || null)}
                aria-label="Date column"
              >
                <option value="">Auto/None</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Category Column</div>
              <select
                className="select"
                value={filters.categoryField || ''}
                onChange={(e) => setFilterField('categoryField', e.target.value || null)}
                aria-label="Category column"
              >
                <option value="">Auto/None</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Value Column</div>
              <select
                className="select"
                value={filters.valueField || ''}
                onChange={(e) => setFilterField('valueField', e.target.value || null)}
                aria-label="Value column"
              >
                <option value="">Auto/None</option>
                {columns.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <div className="section-title" style={{ marginBottom: 6 }}>Category Contains</div>
              <input
                className="input"
                placeholder="Type to filter…"
                value={filters.categoryQuery}
                onChange={(e) => setFilterField('categoryQuery', e.target.value)}
                aria-label="Category contains"
              />
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
