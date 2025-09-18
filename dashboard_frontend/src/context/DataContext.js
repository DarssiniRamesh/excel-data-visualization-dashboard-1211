import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * DataContext provides global state for uploaded Excel data, filters, current sheet,
 * derived aggregates, and UI metadata. It also persists relevant parts to localStorage.
 */
export const DataContext = createContext(null);

// Keys for localStorage
const LS_KEYS = {
  theme: 'op_theme',
  datasetMeta: 'op_dataset_meta',
  filters: 'op_filters',
  lastFileName: 'op_last_file_name',
};

const defaultFilters = {
  dateField: null,       // column name
  categoryField: null,   // column name
  valueField: null,      // column name
  dateRange: 'last_30',  // enum
  categoryQuery: '',     // string contains
};

function parseDateSafe(value) {
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function withinDateRange(date, rangeKey) {
  const d = parseDateSafe(date);
  if (!d) return true; // if invalid date, don't filter it out by date
  const now = new Date();
  const start = new Date(now);
  switch (rangeKey) {
    case 'last_7':
      start.setDate(now.getDate() - 7);
      break;
    case 'last_30':
      start.setDate(now.getDate() - 30);
      break;
    case 'qtd': {
      const currentMonth = now.getMonth();
      const qStartMonth = Math.floor(currentMonth / 3) * 3;
      start.setMonth(qStartMonth, 1);
      start.setHours(0, 0, 0, 0);
      break;
    }
    case 'ytd':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      return true;
  }
  return d >= start && d <= now;
}

export function DataProvider({ children }) {
  const [workbookData, setWorkbookData] = useState(null); // { sheets: {name: rows[]}, sheetNames: [] }
  const [currentSheet, setCurrentSheet] = useState(null);
  const [filters, setFilters] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.filters);
      return saved ? { ...defaultFilters, ...JSON.parse(saved) } : defaultFilters;
    } catch {
      return defaultFilters;
    }
  });
  const [status, setStatus] = useState('Ready');
  const [lastAction, setLastAction] = useState(null);
  const [lastFileName, setLastFileName] = useState(() => localStorage.getItem(LS_KEYS.lastFileName) || '');

  // Persist filters/meta
  useEffect(() => {
    localStorage.setItem(LS_KEYS.filters, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    if (workbookData) {
      const meta = {
        sheetNames: workbookData.sheetNames,
        currentSheet,
        columns: currentSheet ? Object.keys((workbookData.sheets[currentSheet][0] || {})) : [],
        rowCount: currentSheet ? workbookData.sheets[currentSheet].length : 0,
      };
      localStorage.setItem(LS_KEYS.datasetMeta, JSON.stringify(meta));
    }
  }, [workbookData, currentSheet]);

  const setWorkbook = useCallback((data, fileName) => {
    setWorkbookData(data);
    setCurrentSheet(data.sheetNames[0] || null);
    setStatus('Data loaded');
    setLastAction(`Loaded ${fileName} at ${new Date().toLocaleString()}`);
    if (fileName) {
      setLastFileName(fileName);
      localStorage.setItem(LS_KEYS.lastFileName, fileName);
    }
  }, []);

  const clearAll = useCallback(() => {
    setWorkbookData(null);
    setCurrentSheet(null);
    setFilters(defaultFilters);
    setStatus('Cleared');
    setLastAction(`Cleared at ${new Date().toLocaleString()}`);
  }, []);

  const rows = useMemo(() => {
    if (!workbookData || !currentSheet) return [];
    return workbookData.sheets[currentSheet] || [];
  }, [workbookData, currentSheet]);

  // Derived: filtered rows
  const filteredRows = useMemo(() => {
    if (!rows.length) return [];
    const { dateField, categoryField, dateRange, categoryQuery } = filters;
    return rows.filter((r) => {
      let pass = true;
      if (dateField && r[dateField]) {
        pass = pass && withinDateRange(r[dateField], dateRange);
      }
      if (categoryField && categoryQuery) {
        const val = `${r[categoryField] || ''}`.toLowerCase();
        pass = pass && val.includes(categoryQuery.toLowerCase());
      }
      return pass;
    });
  }, [rows, filters]);

  // Derived: aggregates (simple sum by category if fields selected)
  const aggregates = useMemo(() => {
    const { categoryField, valueField } = filters;
    if (!categoryField || !valueField || !filteredRows.length) return [];
    const map = new Map();
    for (const row of filteredRows) {
      const cat = row[categoryField] ?? 'Unknown';
      const valRaw = row[valueField];
      const val = typeof valRaw === 'number' ? valRaw : parseFloat(valRaw);
      const safe = isNaN(val) ? 0 : val;
      map.set(cat, (map.get(cat) || 0) + safe);
    }
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredRows, filters]);

  const columns = useMemo(() => {
    if (!rows.length) return [];
    return Object.keys(rows[0]);
  }, [rows]);

  const valueColumns = useMemo(() => {
    if (!rows.length) return [];
    const candidates = Object.keys(rows[0]).filter((k) => {
      const v = rows[0][k];
      return typeof v === 'number' || (!isNaN(parseFloat(v)) && isFinite(v));
    });
    return candidates;
  }, [rows]);

  const setFilterField = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <DataContext.Provider
      value={{
        workbookData,
        setWorkbook,
        currentSheet,
        setCurrentSheet,
        rows,
        filteredRows,
        aggregates,
        columns,
        valueColumns,
        filters,
        setFilters,
        setFilterField,
        status,
        setStatus,
        lastAction,
        lastFileName,
        clearAll,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
