# Excel Data Visualization Dashboard (Ocean Professional)

A modern React dashboard to upload and explore Excel data with charts, tables, filters, and a light/dark theme.

## Key Features
- Excel upload via drag-and-drop or button (SheetJS)
- Validates common template columns (Date, Category, Value) but supports any schema
- DataContext-based state with filters, sheet selection, and persisted preferences
- Recharts-based Bar/Line/Area/Pie charts with column pickers
- Sortable, paginated data table
- KPI cards, responsive layout, accessible keyboard/ARIA
- Ocean Professional theme with light/dark toggle and persistence
- Footer status with file name, row count, last action
- Downloadable Excel template

## Getting Started

Install dependencies and start:

```bash
npm install
npm start
```

Open http://localhost:3000 in your browser.

## How to Use
1. Upload an Excel (.xlsx) file from the sidebar or drag & drop into the upload area.
2. If your workbook has multiple sheets, select one from the Sheet dropdown.
3. Pick your Date/Category/Value columns (optional but recommended for filters/aggregates).
4. Adjust the Date Range and Category Contains filters.
5. Choose chart type and set X/Y columns to render Bar/Line/Area/Pie visuals.
6. Sort/paginate the table. Theme, filters, and meta persist automatically.
7. Use "Download Excel Template" to get a sample template with recommended columns.

## Notes
- The app uses localStorage to persist theme (op_theme), dataset meta, last file name, and filters.
- The table and charts adapt to both themes.

## Development
- Styles: src/styles/theme.css
- Data Context: src/context/DataContext.js
- Excel Services: src/services/excel.js
- Components: src/components/...

