"use client";

// views/history/history.tsx
import { useEffect, useRef, useState } from "react";
import AnalysisPanel, { ANALYSIS_META } from "./AnalysisPanel";

// Impor React Datepicker dan stylenya
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Statics
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryItem {
  lokasi: string;
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string;
}

interface HistoryProps {
  tbody: HistoryItem[];
  thead: { title: string }[];
}

const ANALYSIS_LIST = [
  "Tren Ketinggian Air",
  "Tren Intensitas Hujan",
  "Korelasi Hujan dan Tinggi Air",
  "Analisis Delay Hujan-Air",
  "Analisis Jam Rawan",
  "Analisis Kecepatan Kenaikan Air",
  "Statistik Harian",
  "Frekuensi Status Alarm",
  "Riwayat Monitoring",
  "Prediksi Kenaikan Air",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "aman":
      return "bg-green-100 text-green-800";
    case "waspada":
      return "bg-yellow-100 text-yellow-800";
    case "bahaya":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main History component
// ─────────────────────────────────────────────────────────────────────────────

function History({ tbody, thead }: HistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);
  
  // Mengubah state tanggal menjadi objek Date asli agar sinkron dengan DatePicker
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemsPerPage = 20;

  // Filter data berdasarkan objek tanggal
  const filteredData = selectedDate
    ? tbody.filter((item) => {
        const itemDate = new Date(item.update_terakhir);
        
        // Samakan format YYYY-MM-DD
        const itemFormatted = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}-${String(itemDate.getDate()).padStart(2, "0")}`;
        const filterFormatted = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;

        return itemFormatted === filterFormatted;
      })
    : tbody;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAnalysis = (name: string) => {
    setSelectedAnalysis(name);
    setDropdownOpen(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  const handleClosePanel = () => setSelectedAnalysis(null);
  const activeMeta = selectedAnalysis ? ANALYSIS_META[selectedAnalysis] : null;

  return (
    <div className="p-4 space-y-5">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Riwayat Data Sensor
          </h2>
          <p className="text-sm text-slate-500">
            Data tinggi air dan curah hujan per lokasi
          </p>
        </div>

        {/* ── Dropdown Analisis ─────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-sm border transition-all duration-150
              ${
                selectedAnalysis
                  ? "bg-[#2c6e7d] text-white border-[#2c6e7d] hover:bg-[#255f6d]"
                  : "bg-white text-[#2c6e7d] border-[#7fb8c6] hover:bg-[#f0f9fb]"
              }`}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>{selectedAnalysis ? selectedAnalysis : "Analisis"}</span>
            <svg
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 z-50 w-64 rounded-2xl shadow-xl border border-slate-200 bg-white overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Pilih Analisis
                </p>
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
                {ANALYSIS_LIST.map((name) => {
                  const meta = ANALYSIS_META[name];
                  const isActive = selectedAnalysis === name;
                  return (
                    <button
                      key={name}
                      onClick={() => handleSelectAnalysis(name)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                        ${isActive ? "bg-[#e8f7fa] text-[#2c6e7d] font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: isActive ? meta.colorAccent : "#cbd5e1" }}
                      />
                      <span className="leading-tight">{name}</span>
                      {isActive && (
                        <svg
                          className="w-3.5 h-3.5 ml-auto flex-shrink-0 text-[#2c6e7d]"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedAnalysis && (
                <div className="border-t border-slate-100 px-3 py-2">
                  <button
                    onClick={() => {
                      setSelectedAnalysis(null);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-red-500 transition-colors py-1"
                  >
                    Hapus pilihan
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── SUMMARY CARDS ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-400 mb-1">Total Lokasi</p>
          <p className="text-xl font-semibold text-slate-800">{filteredData.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3.5 border border-green-100 shadow-sm">
          <p className="text-xs text-green-600 mb-1">Aman</p>
          <p className="text-xl font-semibold text-green-700">
            {filteredData.filter((r) => r.status === "Aman").length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-3.5 border border-yellow-100 shadow-sm">
          <p className="text-xs text-yellow-600 mb-1">Waspada</p>
          <p className="text-xl font-semibold text-yellow-700">
            {tbody.filter((r) => r.status === "Waspada").length}
          </p>
        </div>
        <div className="bg-red-50 rounded-xl p-3.5 border border-red-100 shadow-sm">
          <p className="text-xs text-red-600 mb-1">Bahaya</p>
          <p className="text-xl font-semibold text-red-700">
            {tbody.filter((r) => r.status === "Bahaya").length}
          </p>
        </div>
      </div>

      {/* ── KUSTOM DROPDOWN FILTER PERIODE/HARI (Sesuai Gambar) ── */}
      <div className="flex flex-col space-y-1.5 max-w-[240px]">
        <label className="text-sm font-semibold text-slate-700">Period</label>
        
        {/* Pembungkus Utama Input dan Icon */}
        <div className="relative custom-datepicker-container w-full">
          
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            placeholderText="Show all"
            dateFormat="yyyy-MM-dd"
            isClearable={!!selectedDate}
            // Ditambahkan pr-10 agar teks tanggal tidak menabrak icon panah di kanan
            className="w-full pl-4 pr-20 py-2.5 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer transition-colors focus:outline-none focus:border-slate-300 hover:bg-slate-50 select-none"
          />
          
          {/* Icon Chevron Sekarang Masuk ke Dalam Kolom (Hanya muncul jika belum ada tanggal yang dipilih) */}
          {!selectedDate && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg 
                className="w-4 h-4 transition-colors group-hover:text-slate-600" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2} 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
          
        </div>
      </div>

      {/* ── ANALYSIS PANEL (conditional) ────────────────────────── */}
      {selectedAnalysis && (
        <AnalysisPanel selectedAnalysis={selectedAnalysis} onClose={handleClosePanel} />
      )}

      {/* ── SENSOR TABLE ────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-600">Data Sensor Terbaru</h3>
          {activeMeta && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium border"
              style={{
                color: activeMeta.colorAccent,
                borderColor: activeMeta.colorAccent + "44",
                backgroundColor: activeMeta.colorAccent + "11",
              }}
            >
              {activeMeta.icon} {selectedAnalysis}
            </span>
          )}
        </div>

        <div className="bg-[#e6f4f7] rounded-2xl overflow-hidden border border-[#b6dbe3]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#6fb3c1] text-white">
                {thead.map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 font-semibold">{h.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={thead.length} className="text-center py-10 text-slate-400 text-sm">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                currentData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-[#b6dbe3] last:border-0 hover:bg-[#d7eef3] transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-slate-700">{row.lokasi}</td>
                    <td className="px-5 py-4 text-slate-600">{row.tinggi_air}</td>
                    <td className="px-5 py-4 text-slate-600">{row.curah_hujan}</td>
                    <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                    <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(row.update_terakhir).toLocaleString("id-ID")}
                  </td>
                </tr>
            ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── PAGINATION ──────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border border-[#7fb8c6] text-sm transition-colors
                ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
            >
              Sebelumnya
            </button>

            {(() => {
              const maxVisible = 5;
              let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let end = Math.min(totalPages, start + maxVisible - 1);
              if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

              const pages: number[] = [];
              for (let i = start; i <= end; i++) pages.push(i);

              return (
                <>
                  {start > 1 && <span className="px-2 text-gray-400 self-center">…</span>}
                  {pages.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`px-4 py-2 rounded-lg border border-[#7fb8c6] text-sm transition-colors
                        ${n === currentPage ? "bg-[#dff1f5] text-[#2c6e7d] font-semibold" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
                    >
                      {n}
                    </button>
                  ))}
                  {end < totalPages && <span className="px-2 text-gray-400 self-center">…</span>}
                </>
              );
            })()}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border border-[#7fb8c6] text-sm transition-colors
                ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default History;