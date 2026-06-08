"use client";
import { useMemo } from "react";
import { id } from "date-fns/locale/id";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Database, HistoryIcon, AlertTriangle, Calendar, Download, ShieldCheck, Siren } from "lucide-react";
import exportCSV from "@/pages/dashboard/saveCSV";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import AceUICard from "@/component/card/AceUICard";
import AceUICardTable from "@/component/card/AceUICardTable";

registerLocale("id", id);

export interface HistoryItem {
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string;
}

export interface HistoryProps {
  tbody: HistoryItem[];
  thead: { title: string }[];
}

type FilterMode = "harian" | "bulanan";

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

const statusStyles: Record<string, string> = {
  Aman: "bg-green-100 text-green-900 border border-green-300",
  Waspada: "bg-amber-100 text-amber-900 border border-amber-300",
  Siaga: "bg-amber-100 text-amber-900 border border-amber-300",
  Bahaya: "bg-rose-100 text-rose-900 border border-rose-300",
};

function History({ tbody, thead }: HistoryProps) {
  const [filterMode, setFilterMode] = useSessionStorage<FilterMode>("history_filter_mode", "harian");
  const [selectedDate, setSelectedDate] = useSessionStorage<Date | null>("history_selected_date", null);
  const [selectedMonth, setSelectedMonth] = useSessionStorage<Date | null>("history_selected_month", null);
  const dateValue = selectedDate ? new Date(selectedDate as any) : null;
  const monthValue = selectedMonth ? new Date(selectedMonth as any) : null;

  const filteredData = useMemo(() => {
    if (filterMode === "harian" && dateValue) {
      return tbody.filter((item) => {
        const d = new Date(item.update_terakhir);
        return isSameDay(d, dateValue);
      });
    }
    if (filterMode === "bulanan" && monthValue) {
      return tbody.filter((item) => {
        const d = new Date(item.update_terakhir);
        return isSameMonth(d, monthValue);
      });
    }
    return tbody;
  }, [tbody, filterMode, dateValue, monthValue]);

  function handleExport() {
    const rows = filteredData.map((item) => ({
      "Tinggi Air (cm)": parseFloat(item.tinggi_air) || 0,
      "Curah Hujan": item.curah_hujan,
      "Status": item.status,
      "Update Terakhir": new Date(item.update_terakhir).toLocaleString("id-ID"),
    }));

    let suffix = "semua";
    if (filterMode === "harian" && dateValue) {
      suffix = dateValue.toLocaleDateString("id-ID").replace(/\//g, "-");
    } else if (filterMode === "bulanan" && monthValue) {
      suffix = `${monthValue.toLocaleString("id-ID", { month: "long" })}-${monthValue.getFullYear()}`;
    }

    exportCSV({ data: rows, fileName: `riwayat-${suffix}.csv` });
  }

  const statCards = [
    { label: "Total Aman",   key: "Aman",    color: "green",  Icon: ShieldCheck },
    { label: "Total Waspada", key: "Waspada", color: "yellow", Icon: AlertTriangle },
    { label: "Total Bahaya",  key: "Bahaya",  color: "red",    Icon: Siren },
    { label: "Total Data",    key: null,      color: "text",   Icon: Database },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <AceUICard className="backdrop-blur-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
                <HistoryIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text">Riwayat Monitoring</h2>
                <p className="text-sm text-text/60">Monitoring realtime sensor banjir dan hujan</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Mode Filter</label>
              <div className="flex rounded-xl overflow-hidden border border-secondary">
                <button
                  onClick={() => { setFilterMode("harian"); setSelectedMonth(null); }}
                  className={`px-4 py-3 text-sm font-semibold transition-all ${filterMode === "harian" ? "bg-primary text-white" : "bg-background text-text hover:bg-secondary/20"}`}
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

            {filterMode === "harian" ? (
              <div className="flex flex-col gap-1.5 min-w-[220px]">
                <label className="text-sm font-medium text-text">Pilih Tanggal</label>
                <div className="relative z-50">
                  <DatePicker
                    locale="id"
                    selected={dateValue}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    placeholderText="Semua tanggal"
                    dateFormat="dd MMM yyyy"
                    isClearable={!!dateValue}
                    popperClassName="z-[9999]"
                    calendarClassName="shadow-2xl border border-secondary rounded-xl"
                    className="w-full appearance-none rounded-xl border border-secondary bg-background px-4 py-3 pr-11 text-sm font-medium text-text placeholder:text-black shadow-sm outline-none transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {!selectedDate && (
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5 min-w-[220px]">
                <label className="text-sm font-medium text-text">Pilih Bulan</label>
                <div className="relative z-50">
                  <DatePicker
                    locale="id"
                    selected={monthValue}
                    onChange={(date: Date | null) => setSelectedMonth(date)}
                    placeholderText="Semua bulan"
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    isClearable={!!monthValue}
                    popperClassName="z-[9999]"
                    calendarClassName="shadow-2xl border border-secondary rounded-xl"
                    className="w-full appearance-none rounded-xl border border-secondary bg-background px-4 py-3 pr-11 text-sm font-medium text-text placeholder:text-black shadow-sm outline-none transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  {!selectedMonth && (
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
                  )}
                </div>
              </div>
            )}

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
      </AceUICard>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, key, color, Icon }) => (
          <AceUICard key={label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text/60">{label}</p>
                <h3 className={`text-3xl font-bold text-${color}-600 mt-2`}>
                  {key ? filteredData.filter((i) => i.status === key).length : filteredData.length}
                </h3>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-${color}-100 flex items-center justify-center`}>
                <Icon className={`text-${color}-600 w-6 h-6`} />
              </div>
            </div>
          </AceUICard>
        ))}
      </div>

      <AceUICardTable
        key={`${filterMode}-${dateValue?.getTime()}-${monthValue?.getTime()}`}
        thead={thead}
        tbody={filteredData}
        title="Riwayat Pengamatan"
        itemsPerPage={20}
        info={`Menampilkan data dari ${filteredData.length} data sensor`}
        renderCell={(value, row, colIndex) => {
          if (colIndex === 2) {
            return (
              <span className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${statusStyles[value as string] || ""}`}>
                {value}
              </span>
            );
          }
          if (colIndex === 3) return new Date(value).toLocaleString("id-ID");
          return value;
        }}
      />
    </div>
  );
}

export default History;
