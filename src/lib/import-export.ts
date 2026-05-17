import * as XLSX from "xlsx";

export type Format = "csv" | "json" | "xlsx";

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportRows(filenameBase: string, rows: Record<string, unknown>[], format: Format) {
  if (format === "json") {
    downloadBlob(`${filenameBase}.json`, new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }));
    return;
  }
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Data");
  if (format === "csv") {
    const csv = XLSX.utils.sheet_to_csv(ws);
    downloadBlob(`${filenameBase}.csv`, new Blob([csv], { type: "text/csv;charset=utf-8" }));
  } else {
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    downloadBlob(`${filenameBase}.xlsx`, new Blob([buf], { type: "application/octet-stream" }));
  }
}

export async function importFile(file: File): Promise<Record<string, unknown>[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".json")) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error("JSON must be an array of objects");
    return parsed as Record<string, unknown>[];
  }
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: null });
}
