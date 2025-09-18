import * as XLSX from 'xlsx';

/**
 * PUBLIC_INTERFACE
 * parseExcelFile
 * Parses an uploaded Excel file into a workbookData structure:
 * { sheets: { [sheetName]: Array<Object> }, sheetNames: string[] }
 */
export async function parseExcelFile(file) {
  /** Reads a File/Blob, parses with XLSX, returns normalized workbook data. */
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });
  const sheetNames = wb.SheetNames || [];
  const sheets = {};
  for (const name of sheetNames) {
    const ws = wb.Sheets[name];
    const json = XLSX.utils.sheet_to_json(ws, { defval: null });
    sheets[name] = json;
  }
  return { sheets, sheetNames };
}

/**
 * PUBLIC_INTERFACE
 * validateTemplate
 * Ensures rows contain required columns: Date, Category, Value
 */
export function validateTemplate(rows) {
  const required = ['Date', 'Category', 'Value'];
  if (!rows || !rows.length) {
    return { valid: false, message: 'No rows found in the selected sheet.' };
  }
  const cols = Object.keys(rows[0] || {});
  const missing = required.filter((r) => !cols.includes(r));
  if (missing.length) {
    return { valid: false, message: `Missing required columns: ${missing.join(', ')}` };
  }
  return { valid: true, message: 'Structure valid.' };
}

/**
 * PUBLIC_INTERFACE
 * buildTemplateWorkbook
 * Creates an in-memory workbook for download with sample rows.
 */
export function buildTemplateWorkbook() {
  const rows = [
    { Date: '2024-01-01', Category: 'Alpha', Value: 120 },
    { Date: '2024-01-08', Category: 'Beta', Value: 80 },
    { Date: '2024-01-15', Category: 'Alpha', Value: 95 },
    { Date: '2024-02-01', Category: 'Gamma', Value: 150 },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  return wb;
}

/**
 * PUBLIC_INTERFACE
 * downloadExcelTemplate
 * Triggers a client-side download for the template workbook.
 */
export function downloadExcelTemplate() {
  const wb = buildTemplateWorkbook();
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = 'excel-template.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(href);
}
