"use client";

import { useEffect, useMemo, useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { id } from "date-fns/locale/id";

import {
  Activity,
  AlertTriangle,
  Calendar,
  Download,
  ShieldCheck,
  Siren,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import exportCSV from "@/pages/dashboard/saveCSV";

registerLocale("id", id);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface HistoryItem {
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string; // ISO string
}

export interface HistoryProps {
  tbody: HistoryItem[];
  thead: { title: string }[];
}

type FilterMode = "harian" | "bulanan";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
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
  const [filterMode, setFilterMode] = useState<FilterMode>("harian");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);

  const itemsPerPage = 20;

  // ───────────────── FILTER ─────────────────

  const filteredData = useMemo(() => {
    if (filterMode === "harian" && selectedDate) {
      return tbody.filter((item) => {
        const d = new Date(item.update_terakhir);
        return isSameDay(d, selectedDate);
      });
    }
    if (filterMode === "bulanan" && selectedMonth) {
      return tbody.filter((item) => {
        const d = new Date(item.update_terakhir);
        return isSameMonth(d, selectedMonth);
      });
    }
    return tbody;
  }, [tbody, filterMode, selectedDate, selectedMonth]);

  // ───────────────── GRAFIK DATA ─────────────────

  const graphData = useMemo(() => {
    const sorted = [...filteredData].reverse();
    if (filterMode === "bulanan" && selectedMonth) {
      // Agregasi harian untuk tampilan bulanan
      const byDay: Record<string, { sum: number; count: number }> = {};
      sorted.forEach((item) => {
        const d = new Date(item.update_terakhir);
        const key = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        if (!byDay[key]) byDay[key] = { sum: 0, count: 0 };
        byDay[key].sum += parseFloat(item.tinggi_air) || 0;
        byDay[key].count++;
      });
      return Object.entries(byDay).map(([label, v]) => ({
        time: label,
        tinggiAir: Math.round((v.sum / v.count) * 100) / 100,
      }));
    }
    // Harian: setiap titik = satu record
    return sorted.map((item) => {
      const d = new Date(item.update_terakhir);
      return {
        time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        tinggiAir: parseFloat(item.tinggi_air) || 0,
      };
    });
  }, [filteredData, filterMode, selectedMonth]);

  // ───────────────── PAGINATION ─────────────────

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, selectedMonth, filterMode]);

  // ───────────────── EXPORT CSV ─────────────────

  function handleExport() {
    const rows = filteredData.map((item) => ({
      "Tinggi Air (cm)": parseFloat(item.tinggi_air) || 0,
      "Curah Hujan": item.curah_hujan,
      "Status": item.status,
      "Update Terakhir": new Date(item.update_terakhir).toLocaleString("id-ID"),
    }));

    let suffix = "semua";
    if (filterMode === "harian" && selectedDate) {
      suffix = selectedDate.toLocaleDateString("id-ID").replace(/\//g, "-");
    } else if (filterMode === "bulanan" && selectedMonth) {
      suffix = `${selectedMonth.toLocaleString("id-ID", { month: "long" })}-${selectedMonth.getFullYear()}`;
    }

    exportCSV({ data: rows, fileName: `riwayat-${suffix}.csv` });
  }

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

          {/* FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">

            {/* MODE TOGGLE */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Mode Filter</label>
              <div className="flex rounded-xl overflow-hidden border border-secondary">
                <button
                  onClick={() => { setFilterMode("harian"); setSelectedMonth(null); }}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${filterMode === "harian" ? "bg-primary text-white" : "bg-background text-text hover:bg-secondary/20"}`}
                >
                  Harian
                </button>
                <button
                  onClick={() => { setFilterMode("bulanan"); setSelectedDate(null); }}
                  className={`px-4 py-2 text-sm font-semibold transition-all ${filterMode === "bulanan" ? "bg-primary text-white" : "bg-background text-text hover:bg-secondary/20"}`}
                >
                  Bulanan
                </button>
              </div>
            </div>

            {/* DATE / MONTH PICKER */}
            {filterMode === "harian" ? (
              <div className="flex flex-col gap-1.5 min-w-[220px]">
                <label className="text-sm font-medium text-text">Pilih Tanggal</label>
                <div className="relative z-50">
                  <DatePicker
                    locale="id"
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    placeholderText="Semua tanggal"
                    dateFormat="dd MMM yyyy"
                    isClearable={!!selectedDate}
                    popperClassName="z-[9999]"
                    calendarClassName="shadow-2xl border border-secondary rounded-xl"
                    className="w-full appearance-none rounded-xl border border-secondary bg-background px-4 py-3 pr-11 text-sm font-medium text-text placeholder:text-black shadow-sm outline-none transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 min-w-[220px]">
                <label className="text-sm font-medium text-text">Pilih Bulan</label>
                <div className="relative z-50">
                  <DatePicker
                    locale="id"
                    selected={selectedMonth}
                    onChange={(date: Date | null) => setSelectedMonth(date)}
                    placeholderText="Semua bulan"
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    isClearable={!!selectedMonth}
                    popperClassName="z-[9999]"
                    calendarClassName="shadow-2xl border border-secondary rounded-xl"
                    className="w-full appearance-none rounded-xl border border-secondary bg-background px-4 py-3 pr-11 text-sm font-medium text-text placeholder:text-black shadow-sm outline-none transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
                </div>
              </div>
            )}

            {/* EXPORT BUTTON */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text opacity-0 select-none">Export</label>
              <button
                onClick={handleExport}
                disabled={filteredData.length === 0}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Unduh CSV
              </button>
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

      {/* GRAFIK */}
      {graphData.length > 0 && (
        <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm p-6 shadow-sm">
          <h3 className="text-lg font-bold text-text mb-4">
            Grafik Tinggi Air{filterMode === "bulanan" && selectedMonth ? ` — ${selectedMonth.toLocaleString("id-ID", { month: "long", year: "numeric" })}` : ""}
          </h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad-riwayat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-secondary)" opacity={0.35} />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.7 }}
                  interval={filterMode === "bulanan" ? 1 : "preserveStartEnd"}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.7 }}
                  unit=" cm"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid var(--color-secondary)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text)",
                    fontSize: 12,
                  }}
                  formatter={(v: unknown) => [`${Number(v)} cm`, "Tinggi Air"]}
                />
                <Area
                  type="monotone"
                  dataKey="tinggiAir"
                  name="Tinggi Air (cm)"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#grad-riwayat)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-2xl border border-secondary bg-background/70 backdrop-blur-sm p-6 shadow-sm">
        <div className="mb-5">
          <h3 className="text-xl font-bold text-text">Riwayat Pengamatan</h3>
          <p className="text-sm text-text/60 mt-1">Menampilkan {currentData.length} dari {filteredData.length} data sensor</p>
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
              const pages: number[] = [];
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
