import { useRef, useState } from "react";
import { Download, Upload, ChevronDown } from "lucide-react";
import { exportRows, importFile, type Format } from "@/lib/import-export";

type Props = {
  filenameBase: string;
  getRows: () => Record<string, unknown>[] | Promise<Record<string, unknown>[]>;
  onImport?: (rows: Record<string, unknown>[]) => Promise<void> | void;
  importLabel?: string;
};

export function ExportImportBar({ filenameBase, getRows, onImport, importLabel = "Importer" }: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const doExport = async (fmt: Format) => {
    setOpen(false);
    setBusy(true);
    try {
      const rows = await getRows();
      exportRows(filenameBase, rows, fmt);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !onImport) return;
    setBusy(true);
    try {
      const rows = await importFile(f);
      await onImport(rows);
    } catch (err) {
      alert("Import: " + (err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          type="button"
          disabled={busy}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Exporter <ChevronDown className="h-3 w-3" />
        </button>
        {open && (
          <div className="absolute right-0 z-20 mt-1 min-w-[140px] border border-border bg-background shadow-lg">
            {(["csv", "xlsx", "json"] as Format[]).map((f) => (
              <button
                key={f}
                onClick={() => doExport(f)}
                className="block w-full px-4 py-2 text-left text-xs uppercase tracking-widest hover:bg-secondary"
              >
                {f === "xlsx" ? "Excel (.xlsx)" : f === "csv" ? "CSV" : "JSON"}
              </button>
            ))}
          </div>
        )}
      </div>
      {onImport && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 border border-border bg-card px-3 py-2 text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-50"
          >
            <Upload className="h-4 w-4" /> {importLabel}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.json,.xlsx,.xls"
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}
    </div>
  );
}
