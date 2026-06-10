import { ChevronDown, ChevronUp, Database, Download, FileJson, Loader2, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";

type HdfsFile = {
  fileName: string;
  size: number;
  modifiedAt: string;
  modifiedTimestamp: number;
};

type SensorRecord = {
  id?: string;
  distance?: number;
  rain?: number;
  status_rain?: string;
  buzzer?: string;
  timestamp?: number;
  [key: string]: any;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Aman: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Waspada: "bg-amber-100 text-amber-800 border-amber-300",
    Bahaya: "bg-rose-100 text-rose-800 border-rose-300",
    Ya: "bg-rose-100 text-rose-800 border-rose-300",
    Tidak: "bg-emerald-100 text-emerald-800 border-emerald-300",
  };
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[status] ?? "bg-white text-text border-secondary"}`}>
      {status}
    </span>
  );
}

export default function HadoopFiles() {
  const [files, setFiles] = useState<HdfsFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [errorFiles, setErrorFiles] = useState("");

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<SensorRecord[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [previewPage, setPreviewPage] = useState(1);
  const [sortAsc, setSortAsc] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);

  const PREVIEW_PER_PAGE = 15;

  async function fetchFiles() {
    setLoadingFiles(true);
    setErrorFiles("");
    try {
      const res = await fetch("/api/hadoop-files");
      const json = await res.json();
      if (json.success) {
        setFiles(json.files);
      } else {
        setErrorFiles(json.message);
      }
    } catch {
      setErrorFiles("Gagal menghubungi server. Pastikan Next.js berjalan.");
    } finally {
      setLoadingFiles(false);
    }
  }

  async function fetchFileContent(fileName: string) {
    setSelectedFile(fileName);
    setFileContent([]);
    setLoadingContent(true);
    setErrorContent("");
    setPreviewPage(1);
    try {
      const res = await fetch(`/api/hadoop-files?file=${encodeURIComponent(fileName)}`);
      const json = await res.json();
      if (json.success) {
        setFileContent(Array.isArray(json.data) ? json.data : []);
      } else {
        setErrorContent(json.message);
      }
    } catch {
      setErrorContent("Gagal membaca file dari HDFS.");
    } finally {
      setLoadingContent(false);
    }
  }

  function closePreview() {
    setSelectedFile(null);
    setFileContent([]);
    setErrorContent("");
  }

  async function downloadFile(fileName: string) {
    setDownloadingFile(fileName);
    try {
      const res = await fetch(`/api/hadoop-files?file=${encodeURIComponent(fileName)}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      const blob = new Blob([JSON.stringify(json.data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(`Gagal mengunduh: ${err.message}`);
    } finally {
      setDownloadingFile(null);
    }
  }

  useEffect(() => { fetchFiles(); }, []);

  const sortedFiles = [...files].sort((a, b) =>
    sortAsc
      ? a.modifiedTimestamp - b.modifiedTimestamp
      : b.modifiedTimestamp - a.modifiedTimestamp
  );

  const totalPreviewPages = Math.ceil(fileContent.length / PREVIEW_PER_PAGE);
  const previewData = fileContent.slice(
    (previewPage - 1) * PREVIEW_PER_PAGE,
    previewPage * PREVIEW_PER_PAGE
  );

  const panelClass = "rounded-2xl border border-secondary bg-white backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className={`${panelClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">File Backup di HDFS</h3>
            
          </div>
        </div>
        <button
          onClick={fetchFiles}
          disabled={loadingFiles}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-secondary bg-white px-4 py-2 text-sm font-medium text-text transition-all hover:bg-secondary/20 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loadingFiles ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* DAFTAR FILE */}
      <div className={`${panelClass} p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-text">
            Daftar File Backup
            {!loadingFiles && (
              <span className="ml-2 text-sm font-normal text-text/50">
                ({files.length} file)
              </span>
            )}
          </h2>
          <button
            onClick={() => setSortAsc((v) => !v)}
            className="flex items-center gap-1 text-xs text-text/60 hover:text-text transition-colors"
          >
            Tanggal {sortAsc ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {loadingFiles ? (
          <div className="flex items-center justify-center py-16 text-sm text-text/50">
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Memuat daftar file...
          </div>
        ) : errorFiles ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {errorFiles}
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-text/40">
            <FileJson className="h-10 w-10" />
            <p className="text-sm">Belum ada file backup.</p>
            <p className="text-xs">Klik "Backup ke Hadoop" di halaman Dashboard untuk membuat backup pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-secondary bg-white">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-secondary/20 text-text">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nama File</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Ukuran</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tanggal Dibuat</th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {sortedFiles.map((file) => (
                  <tr
                    key={file.fileName}
                    className={`border-b border-secondary/15 last:border-0 transition-colors hover:bg-secondary/10 ${selectedFile === file.fileName ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4 shrink-0 text-primary/60" />
                        <span className="font-mono text-xs font-semibold text-text">{file.fileName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text/70">{formatSize(file.size)}</td>
                    <td className="px-5 py-4 text-sm text-text/70">{file.modifiedAt}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            selectedFile === file.fileName
                              ? closePreview()
                              : fetchFileContent(file.fileName)
                          }
                          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all
                            ${selectedFile === file.fileName
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-secondary text-text hover:bg-secondary/20"}`}
                        >
                          {selectedFile === file.fileName ? "Tutup" : "Lihat Isi"}
                        </button>
                        <button
                          onClick={() => downloadFile(file.fileName)}
                          disabled={downloadingFile === file.fileName}
                          title="Unduh file"
                          className="flex items-center gap-1.5 rounded-lg border border-secondary px-3 py-1.5 text-xs font-semibold text-text transition-all hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {downloadingFile === file.fileName ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Download className="h-3.5 w-3.5" />
                          )}
                          Unduh
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PREVIEW ISI FILE */}
      {selectedFile && (
        <div className={`${panelClass} p-6`}>
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text">
                Preview: <span className="font-mono text-base font-semibold text-primary">{selectedFile}</span>
              </h2>
              {!loadingContent && !errorContent && (
                <p className="mt-0.5 text-xs text-text/50">
                  {fileContent.length} record ditemukan
                  {fileContent.length > PREVIEW_PER_PAGE && ` · Menampilkan ${PREVIEW_PER_PAGE} per halaman`}
                </p>
              )}
            </div>
            <button
              onClick={closePreview}
              className="shrink-0 rounded-lg p-1.5 text-text/40 hover:bg-secondary/20 hover:text-text transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {loadingContent ? (
            <div className="flex items-center justify-center py-12 text-sm text-text/50">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Membaca file dari HDFS...
            </div>
          ) : errorContent ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {errorContent}
            </div>
          ) : fileContent.length === 0 ? (
            <div className="py-12 text-center text-sm text-text/40">File kosong atau format tidak dikenal.</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-2xl border border-secondary bg-white">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-secondary/20 text-text">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">No</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Tinggi Air</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Curah Hujan</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status Hujan</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Alarm</th>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, i) => {
                      const globalIndex = (previewPage - 1) * PREVIEW_PER_PAGE + i + 1;
                      const ts = row.timestamp ? new Date(row.timestamp).toLocaleString("id-ID") : "-";
                      return (
                        <tr key={row.id ?? i} className="border-b border-secondary/15 last:border-0 hover:bg-secondary/10 transition-colors">
                          <td className="px-5 py-3.5 text-xs text-text/40">{globalIndex}</td>
                          <td className="px-5 py-3.5 font-semibold text-text">
                            {row.distance != null ? `${Number(row.distance).toFixed(2)} cm` : "-"}
                          </td>
                          <td className="px-5 py-3.5 text-text/80">{row.rain ?? "-"}</td>
                          <td className="px-5 py-3.5">
                            {row.status_rain ? <StatusBadge status={row.status_rain} /> : "-"}
                          </td>
                          <td className="px-5 py-3.5 text-text/80">{row.buzzer ?? "-"}</td>
                          <td className="px-5 py-3.5 text-xs text-text/60">{ts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION PREVIEW */}
              {totalPreviewPages > 1 && (
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setPreviewPage((p) => Math.max(p - 1, 1))}
                    disabled={previewPage === 1}
                    className="rounded-lg border border-secondary px-3 py-1.5 text-xs font-medium transition-all hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Sebelumnya
                  </button>
                  <span className="text-xs text-text/50">
                    {previewPage} / {totalPreviewPages}
                  </span>
                  <button
                    onClick={() => setPreviewPage((p) => Math.min(p + 1, totalPreviewPages))}
                    disabled={previewPage === totalPreviewPages}
                    className="rounded-lg border border-secondary px-3 py-1.5 text-xs font-medium transition-all hover:bg-secondary/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
