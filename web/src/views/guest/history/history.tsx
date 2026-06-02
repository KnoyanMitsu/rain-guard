"use client";

import { useEffect, useRef, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Activity,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Siren,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryItem {
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string;
}

interface HistoryProps {
  tbody: HistoryItem[];
  thead: { title: string }[];
}

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BADGE
// ─────────────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-emerald-100 text-emerald-900 border border-emerald-300",
    Waspada: "bg-amber-100 text-amber-900 border border-amber-300",
    Siaga: "bg-amber-100 text-amber-900 border border-amber-300",
    Bahaya: "bg-rose-100 text-rose-900 border border-rose-300",
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        min-w-[90px] px-3 py-1 rounded-full
        text-xs font-semibold shadow-sm
        ${styles[status] || "bg-secondary/10 text-text border border-secondary"}
      `}
    >
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function History({ tbody, thead }: HistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const itemsPerPage = 20;

  // ───────────────── FILTER DATE ─────────────────

  const filteredData = selectedDate
    ? tbody.filter((item) => {
        const itemDate = new Date(item.update_terakhir);
        const itemFormatted = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}-${String(itemDate.getDate()).padStart(2, "0")}`;
        const filterFormatted = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        return itemFormatted === filterFormatted;
      })
    : tbody;

  // ───────────────── PAGINATION ─────────────────

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  // ───────────────── UI ─────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="relative z-20 rounded-3xl border border-secondary bg-background/80 backdrop-blur-sm p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Riwayat Monitoring</h2>
                <p className="text-sm text-text/60">Monitoring realtime sensor banjir dan hujan</p>
              </div>
            </div>
          </div>

          {/* DATE FILTER */}
          <div className="flex flex-col gap-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-text">Filter Tanggal</label>
            <div className="relative z-50">
              <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                placeholderText="Semua tanggal"
                dateFormat="dd MMM yyyy"
                isClearable={!!selectedDate}
                popperClassName="z-[9999]"
                calendarClassName="shadow-2xl border border-secondary rounded-xl"
                className="
                  w-full appearance-none rounded-xl
                  border border-secondary bg-background
                  px-4 py-3 pr-11
                  text-sm font-medium text-text
                  placeholder:text-black shadow-sm outline-none
                  transition-all hover:border-primary
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                "
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
            </div>
          </div>
        </div>
      </div>

      {/* CARD STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/60">Total Aman</p>
              <h3 className="text-3xl font-bold text-green-600 mt-2">
                {filteredData.filter((item) => item.status === "Aman").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <ShieldCheck className="text-green-600 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/60">Total Waspada</p>
              <h3 className="text-3xl font-bold text-yellow-600 mt-2">
                {filteredData.filter((item) => item.status === "Waspada").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="text-yellow-600 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/60">Total Bahaya</p>
              <h3 className="text-3xl font-bold text-red-600 mt-2">
                {filteredData.filter((item) => item.status === "Bahaya").length}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
              <Siren className="text-red-600 w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text/60">Total Data</p>
              <h3 className="text-3xl font-bold text-text mt-2">{filteredData.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center">
              <Activity className="text-text w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-secondary bg-background/70 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-text">Riwayat Pengamatan</h3>
          <p className="text-sm text-text/60 mt-1">Menampilkan {currentData.length} data sensor</p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-secondary bg-background/60">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-secondary/20 text-text">
              <tr>
                {thead.map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 font-semibold uppercase tracking-wider text-xs">
                    {h.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={thead.length} className="py-16 text-center text-text/50">
                    Tidak ada data tersedia
                  </td>
                </tr>
              ) : (
                currentData.map((row, i) => (
                  <tr key={i} className="border-b border-secondary/15 last:border-0 hover:bg-secondary/10 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap text-text font-medium">{row.tinggi_air}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-text font-medium">{row.curah_hujan}</td>
                    <td className="px-5 py-4 whitespace-nowrap w-[300px]">
                      <div className="flex justify-start">
                        <StatusBadge status={row.status} />
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text font-medium">
                      {new Date(row.update_terakhir).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-end mt-5 gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg border transition-all ${currentPage === 1 ? "text-text/40 bg-background/50 cursor-not-allowed border-secondary/10" : "text-text bg-secondary/20 hover:bg-secondary/30 border-secondary"}`}
            >
              Sebelumnya
            </button>

            {(() => {
              const maxVisible = 5;
              let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
              let endPage = Math.min(totalPages, startPage + maxVisible - 1);
              if (endPage - startPage + 1 < maxVisible) startPage = Math.max(1, endPage - maxVisible + 1);
              const pages = [];
              for (let i = startPage; i <= endPage; i++) pages.push(i);
              return (
                <>
                  {startPage > 1 && <span className="px-2 text-text/50 self-end mb-2">...</span>}
                  {pages.map((n) => (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      className={`px-4 py-2 rounded-lg border transition-all ${n === currentPage ? "bg-primary text-background font-semibold border-primary shadow-md shadow-primary/20" : "text-text bg-background/60 hover:bg-secondary/20 border-secondary"}`}
                    >
                      {n}
                    </button>
                  ))}
                  {endPage < totalPages && <span className="px-2 text-text/50 self-end mb-2">...</span>}
                </>
              );
            })()}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg border transition-all ${currentPage === totalPages ? "text-text/40 bg-background/50 cursor-not-allowed border-secondary/10" : "text-text bg-secondary/20 hover:bg-secondary/30 border-secondary"}`}
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
