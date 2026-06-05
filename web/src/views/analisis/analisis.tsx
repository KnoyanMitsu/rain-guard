"use client";
import AnalysisPanel, { SensorReading } from "@/views/analisis/AnalysisPanel";
import { useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Activity, Calendar, ChevronDown } from "lucide-react";
import { useSessionStorage } from "@/hooks/useSessionStorage";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface HistoryItem {
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string;
}

interface AnalisisProps {
  tbody: HistoryItem[];
  loading: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ANALYSIS_LIST = [
  "Tren Ketinggian Air",
  "Tren Intensitas Hujan",
  "Korelasi Hujan dan Tinggi Air",
  "Analisis Kecepatan Kenaikan Air",
  "Statistik Harian",
  "Frekuensi Status Alarm",
  "Prediksi Kenaikan Air",
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function Analisis({ tbody, loading }: AnalisisProps) {
  const [selectedDateStr, setSelectedDateStr] = useSessionStorage<string | null>("analysis_selected_date", null);
  const selectedDate = useMemo(() => (selectedDateStr ? new Date(selectedDateStr) : null), [selectedDateStr]);
  const [activeAnalyses, setActiveAnalyses] =
    useSessionStorage<string[]>(
      "analysis_active_analyses",
      ["Tren Ketinggian Air"]
    );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ───────────────── FILTER DATE ─────────────────

  const filteredData = selectedDate
    ? tbody.filter((item) => {
        const itemDate = new Date(item.update_terakhir);
        const itemFormatted = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, "0")}-${String(itemDate.getDate()).padStart(2, "0")}`;
        const filterFormatted = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
        return itemFormatted === filterFormatted;
      })
    : tbody;

  // ───────────────── KONVERSI → SensorReading ─────────────────
  // filteredData urutan descending (terbaru di atas), chart butuh ascending

  const sensorData = useMemo((): SensorReading[] => {
    const sorted = [...filteredData].reverse();
    return sorted.map((item, i, arr) => {
      const date = new Date(item.update_terakhir);
      const wl = parseFloat(item.tinggi_air) || 0;
      const rain = parseFloat(item.curah_hujan) || 0;
      const prevWl = i > 0 ? parseFloat(arr[i - 1].tinggi_air) || 0 : wl;
      const delta = Math.round((wl - prevWl) * 10) / 10;
      return {
        time: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }),
        hour: date.getHours(),
        water_level: Math.round(wl * 100) / 100,
        rain_sensor: Math.round(rain * 100) / 100,
        status: (item.status === "Bahaya" ? "Bahaya" : item.status === "Waspada" ? "Waspada" : "Aman") as SensorReading["status"],
        delta_water: delta,
      };
    });
  }, [filteredData]);

  // ───────────────── OUTSIDE CLICK ─────────────────

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAnalysis = (name: string) => {
    if (activeAnalyses.includes(name)) {
      setActiveAnalyses(
        activeAnalyses.filter((item) => item !== name)
      );
    } else {
      setActiveAnalyses([
        ...activeAnalyses,
        name,
      ]);
    }
  };

  // ───────────────── UI ─────────────────

  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <div className="relative z-20 rounded-3xl border border-secondary bg-white backdrop-blur-sm p-6 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>
            <div className="flex items-center gap-3 mb-4 w-full ">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Analisis Data</h2>
                <p className="text-sm text-text/60">Visualisasi dan analisis data sensor banjir</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* DATE FILTER */}
            <div className="flex flex-col gap-1.5 min-w-[220px]">
              <label className="text-sm font-medium text-text">Filter Tanggal</label>
              <div className="relative z-50">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDateStr(date ? date.toISOString() : null)}
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

            {/* ANALYSIS DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <label className="text-sm font-medium text-text block mb-1.5">Analisis</label>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`
                  inline-flex items-center gap-2
                  px-5 py-3 rounded-xl
                  border shadow-sm text-sm font-semibold
                  transition-all duration-200
                  ${activeAnalyses.length > 0
                    ? "bg-primary text-background border-primary"
                    : "bg-background text-text border-secondary hover:bg-secondary/10"
                  }
                `}
              >
                <Activity className="w-4 h-4" />
                  <span>
                    {activeAnalyses.length > 0 ? `${activeAnalyses.length} Analisis Dipilih` : "Pilih Analisis"}
                  </span>                  
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 z-50 w-72 rounded-3xl border border-secondary bg-background shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-secondary/20 bg-secondary/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-text/50">Pilih Analisis</p>
                  </div>

                  <div className="max-h-80 overflow-y-auto py-2">
                    {ANALYSIS_LIST.map((name) => (
                      <button
                        key={name}
                        onClick={() => toggleAnalysis(name)}
                        className={`
                          w-full flex items-center gap-3
                          px-4 py-3 text-sm transition-all
                          ${activeAnalyses.includes(name)
                            ? "bg-primary/10 text-primary font-semibold"
                            : "hover:bg-secondary/10 text-text"
                          }
                        `}
                      >
                        <span className="text-left">
                          {activeAnalyses.includes(name) ? "✅ " : ""}
                          {name}
                        </span>
                      </button>
                    ))}
                  </div>

                  {activeAnalyses.length > 0 && (
                    <div className="border-t border-secondary/20 p-3">
                      <button
                        onClick={() => { setActiveAnalyses([]); setDropdownOpen(false); }}
                        className="w-full py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50 transition-all"
                      >
                        Reset Analisis
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeAnalyses.length === 0 && !loading && (
        <div className="rounded-2xl border border-secondary bg-white backdrop-blur-sm p-10 text-center">
          <Activity className="mx-auto mb-3 h-10 w-10 text-text/20" />
          <p className="text-sm font-semibold text-text/50">Pilih jenis analisis dari dropdown di atas</p>
          <p className="mt-1 text-xs text-text/30">
            {filteredData.length} data tersedia
            {selectedDate ? " untuk tanggal yang dipilih" : ""}
          </p>
        </div>
      )}

      {loading && (
        <div className="rounded-2xl border border-secondary bg-white backdrop-blur-sm p-10 text-center">
          <p className="text-sm text-text/50">Memuat data sensor...</p>
        </div>
      )}

      {/* ANALYSIS PANEL */}
      {!loading && ANALYSIS_LIST.filter((analysis) => activeAnalyses.includes(analysis)).map((analysis) => (
          <AnalysisPanel
            key={analysis}
            selectedAnalysis={analysis}
            onClose={() =>
              setActiveAnalyses(
                activeAnalyses.filter(
                  (item) => item !== analysis
                )
              )
            }
            data={sensorData}
          />
        ))}
    </div>
  );
}

export default Analisis;
