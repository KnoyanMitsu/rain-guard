"use client";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AceUICardMetric } from "@/component/card/AceUICardStats";
import AceUICardStats from "@/component/card/AceUICardStats";
import { AceUILineChart, AceUIBarChart, AceUIComposedChart, AceUIPieChart } from "@/component/card/AceUICardChart";
import AceUICardChart from "@/component/card/AceUICardChart";

// Types
export interface SensorReading {
  time: string;
  hour: number;
  water_level: number;
  rain_sensor: number;
  status: "Aman" | "Waspada" | "Bahaya";
  delta_water: number;
}

// Design tokens
const C_WATER = "#3b82f6";
const C_RAIN = "#6fb3c1";
const PIE_COLORS: Record<string, string> = {
  Aman: "#22c55e",
  Waspada: "#f59e0b",
  Bahaya: "#ef4444",
};

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "10px",
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

// Analysis metadata config
export const ANALYSIS_META: Record<
  string,
  {
    deskripsi: string;
    dataDigunakan: string[];
    visualisasi: string;
    colorAccent: string;
    icon: string;
  }
> = {
  "Tren Ketinggian Air": {
    deskripsi: "Menampilkan pola naik turun tinggi air terhadap waktu.",
    dataDigunakan: ["Water Level (cm)", "Timestamp"],
    visualisasi: "Line Chart",
    colorAccent: "#3b82f6",
    icon: "📈",
  },
  "Tren Intensitas Hujan": {
    deskripsi: "Menampilkan perubahan intensitas hujan terhadap waktu.",
    dataDigunakan: ["Rain Sensor Value (%)", "Timestamp"],
    visualisasi: "Line Chart",
    colorAccent: "#6fb3c1",
    icon: "🌧️",
  },
  "Korelasi Hujan dan Tinggi Air": {
    deskripsi: "Menampilkan hubungan antara hujan dan kenaikan tinggi air.",
    dataDigunakan: ["Rain Sensor Value (%)", "Water Level (cm)"],
    visualisasi: "Dual Line Chart",
    colorAccent: "#8b5cf6",
    icon: "🔗",
  },
  "Analisis Kecepatan Kenaikan Air": {
    deskripsi: "Menampilkan seberapa cepat tinggi air meningkat.",
    dataDigunakan: ["Selisih Water Level terhadap Waktu"],
    visualisasi: "Bar Chart (delta)",
    colorAccent: "#f59e0b",
    icon: "⚡",
  },
  "Statistik Harian": {
    deskripsi: "Menampilkan nilai minimum, maksimum, dan rata-rata harian.",
    dataDigunakan: ["Water Level (cm)", "Rain Sensor (%)"],
    visualisasi: "Statistik Tabel",
    colorAccent: "#10b981",
    icon: "📊",
  },
  "Frekuensi Status Alarm": {
    deskripsi: "Menampilkan frekuensi status aman, waspada, dan bahaya.",
    dataDigunakan: ["Alert Status"],
    visualisasi: "Pie Chart",
    colorAccent: "#6366f1",
    icon: "🚨",
  },
  "Prediksi Kenaikan Air": {
    deskripsi:
      "Menampilkan prediksi potensi kenaikan air berdasarkan pola sebelumnya.",
    dataDigunakan: ["Water Level (cm)", "Rain Sensor (%)", "Timestamp"],
    visualisasi: "Forecast Chart",
    colorAccent: "#f43f5e",
    icon: "🔮",
  },
};

// Chart components
function TrenKetinggianAir({
  data, meta, onClose
}: {
  data: SensorReading[]; meta: any; onClose?: () => void;
}) {
  return (
    <AceUILineChart
      title="Tren Ketinggian Air"
      icon={meta.icon}
      description={meta.deskripsi}
      onClose={onClose}
      data={data}
      lines={[
        {
          dataKey: "water_level",
          name: "Tinggi Air (cm)",
          color: "#3b82f6",
        },
      ]}
    />
  );
}

function TrenIntensitasHujan({
  data, meta, onClose
}: {
  data: SensorReading[]; meta: any; onClose?: () => void;
}) {
  return (
    <AceUILineChart
      title="Tren Intensitas Hujan"
      icon={meta.icon}
      description={meta.deskripsi}
      onClose={onClose}
      data={data}
      lines={[
        {
          dataKey: "rain_sensor",
          name: "Intensitas Hujan (%)",
          color: "#6fb3c1",
        },
      ]}
    />
  );
}

function KorelasiHujanAir({
  data, meta, onClose
}: {
  data: SensorReading[]; meta: any; onClose?: () => void;
}) {
  return (
    <AceUIComposedChart title="Korelasi Hujan dan Tinggi Air" icon={meta.icon} description={meta.deskripsi} onClose={onClose} data={data} />
  );
}

function AnalisisKecepatanKenaikanAir({
  data, meta, onClose
}: {
  data: SensorReading[]; meta: any; onClose?: () => void;
}) {
  return (
    <AceUIBarChart title="Kecepatan Kenaikan Air" icon={meta.icon} description={meta.deskripsi} onClose={onClose} data={data}
    />
  );
}

function StatistikHarian({ data, meta, onClose }: { data: SensorReading[]; meta: any; onClose?: () => void }) {
  const wl = data.map((d) => d.water_level);
  const rain = data.map((d) => d.rain_sensor);

  if (wl.length === 0) {
    return <p className="py-8 text-center text-sm text-slate-400">Tidak ada data untuk ditampilkan.</p>;
  }

  const stats = [
    {
      label: "Tinggi Air",
      unit: "cm",
      min: Math.min(...wl),
      max: Math.max(...wl),
      avg: Math.round(wl.reduce((a, b) => a + b, 0) / wl.length),
      color: C_WATER,
      bg: "white",
    },
    {
      label: "Intensitas Hujan",
      unit: "%",
      min: Math.min(...rain),
      max: Math.max(...rain),
      avg: Math.round(rain.reduce((a, b) => a + b, 0) / rain.length),
      color: C_RAIN,
      bg: "white",
    },
  ];

  return (
    <AceUICardChart title="Statistik Harian" icon={meta.icon} description={meta.deskripsi} onClose={onClose}>
      <div className="grid md:grid-cols-2 gap-4">
        <AceUICardStats
          title="Tinggi Air"
          stats={[
            { label: "Minimum", value: Math.min(...wl), unit: "cm", color: "#3b82f6" },
            { label: "Maksimum", value: Math.max(...wl), unit: "cm", color: "#ef4444" },
            { label: "Rata-rata", value: Math.round(wl.reduce((a, b) => a + b, 0) / wl.length), unit: "cm", color: "#64748b" },
          ]}
        />
        <AceUICardStats
          title="Intensitas Hujan"
          stats={[
            { label: "Minimum", value: Math.min(...rain), unit: "%", color: "#3b82f6" },
            { label: "Maksimum", value: Math.max(...rain), unit: "%", color: "#ef4444" },
            { label: "Rata-rata", value: Math.round(rain.reduce((a, b) => a + b, 0) / rain.length), unit: "%", color: "#64748b" },
          ]}
        />
      </div>
    </AceUICardChart>
  );
}

function FrekuensiStatusAlarm({ data, meta, onClose }: { data: SensorReading[]; meta: any; onClose?: () => void }) {
  const counts = { Aman: 0, Waspada: 0, Bahaya: 0 };
  data.forEach((d) => {
    counts[d.status]++;
  });

  const pieData = [
    {
      name: "Aman",
      value: counts.Aman,
      color: "#22c55e",
    },
    {
      name: "Waspada",
      value: counts.Waspada,
      color: "#f59e0b",
    },
    {
      name: "Bahaya",
      value: counts.Bahaya,
      color: "#ef4444",
    },
  ].filter((d) => d.value > 0);

  return (
    <AceUIPieChart
      title="Frekuensi Status Alarm"
      icon={meta.icon}
      description={meta.deskripsi}
      onClose={onClose}
      data={pieData}
      total={data.length}
    />
  );
}

// Linear regression: returns slope (cm per interval) and intercept
function linearRegression(points: number[]): { slope: number; intercept: number } {
  const n = points.length;
  if (n < 2) return { slope: 0, intercept: points[0] ?? 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += points[i];
    sumXY += i * points[i];
    sumXX += i * i;
  }

  const denom = n * sumXX - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function generateForecastLabel(baseDate: Date, stepMinutes: number): string {
  const d = new Date(baseDate.getTime() + stepMinutes * 60 * 1000);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm} ▸`;
}

function PrediksiKenaikanAir({ data, meta, onClose }: { data: SensorReading[]; meta: any; onClose?: () => void }) {
  // Gunakan semua data yang tersedia, minimal 5 titik untuk regresi
  const ACTUAL_POINTS = Math.min(data.length, 20);
  const FORECAST_STEPS = 6;

  const actualSlice = data.slice(-ACTUAL_POINTS).map((d) => ({
    ...d,
    forecast: undefined as number | undefined,
  }));

  // Hitung regresi linear dari data aktual
  const wlValues = actualSlice.map((d) => d.water_level);
  const rainValues = actualSlice.map((d) => d.rain_sensor);
  const { slope: wlSlope, intercept: wlIntercept } = linearRegression(wlValues);
  const { slope: rainSlope } = linearRegression(rainValues);

  // Estimasi interval waktu antar titik dari data (default 10 detik)
  const INTERVAL_MINUTES = 1; // setiap step prediksi = 1 menit ke depan

  // Base time untuk forecast: ambil dari titik data terakhir jika ada timestamp
  const lastLabel = actualSlice[actualSlice.length - 1]?.time ?? "00:00";
  const [lastHH = "0", lastMM = "0"] = lastLabel.replace(" ▸", "").split(":");
  const baseDate = new Date();
  baseDate.setHours(parseInt(lastHH, 10), parseInt(lastMM, 10), 0, 0);

  // Buat titik prediksi
  const forecastPoints = Array.from({ length: FORECAST_STEPS }, (_, i) => {
    const step = ACTUAL_POINTS + i + 1;
    const predicted = Math.max(0, Math.round((wlSlope * step + wlIntercept) * 100) / 100);
    const predictedRain = Math.max(0, Math.round((rainSlope * step) * 100) / 100);
    return {
      time: generateForecastLabel(baseDate, (i + 1) * INTERVAL_MINUTES),
      hour: (baseDate.getHours() + Math.floor((i + 1) / 60)) % 24,
      water_level: undefined as number | undefined,
      rain_sensor: predictedRain,
      status: "Aman" as const,
      delta_water: wlSlope,
      forecast: predicted,
    };
  });

  const combined = [...actualSlice, ...forecastPoints];

  // Tren dalam cm per interval, ubah ke per-menit untuk tampilan
  const trendDisplay = Math.round(wlSlope * 100) / 100;
  const avgRain = rainValues.length > 0
    ? Math.round(rainValues.reduce((a, b) => a + b, 0) / rainValues.length * 10) / 10
    : 0;

  const lastForecast = forecastPoints[forecastPoints.length - 1]?.forecast ?? 0;
  const lastActual = wlValues[wlValues.length - 1] ?? 0;

  return (
    <AceUICardChart title="Prediksi Kenaikan Air" icon={meta.icon} description={meta.deskripsi} onClose={onClose}>
      {/* Statistik ringkas */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <AceUICardMetric title="Tinggi Air Saat Ini" value={lastActual} unit="cm" />
        <AceUICardMetric title={`Prediksi +${FORECAST_STEPS} Menit`} value={lastForecast} unit="cm" />
        <AceUICardMetric title="Rata-rata Hujan" value={avgRain} unit="%" />
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={combined} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-secondary)" opacity={0.35}/>
          <XAxis dataKey="time" axisLine={false} tickLine={false}
            tick={{fontSize: 12, fill: "var(--color-text)", opacity: 0.82,}}
            interval={Math.max(1, Math.floor(combined.length / 10))} dy={10}
          />
          <YAxis tick={{ fontSize: 11 }} unit=" cm" domain={["auto", "auto"]}/>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid var(--color-secondary)",
              boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.35)",
              backgroundColor: "var(--color-background)",
              color: "var(--color-text)",
            }}
            labelStyle={{ color: "var(--color-text)", fontWeight: 700,}}
          />
          <Legend />
          <ReferenceLine
            x={actualSlice[actualSlice.length - 1]?.time}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: "Sekarang", fill: "#94a3b8", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="water_level"
            name="Tinggi Air Aktual (cm)"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={false}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            name="Prediksi (cm)"
            stroke="#f43f5e"
            strokeWidth={2.5}
            strokeDasharray="6 3"
            dot={{ r: 4, fill: "#f43f5e" }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <p className="mt-3 text-xs text-slate-400 text-center">
        Prediksi menggunakan regresi linear dari {ACTUAL_POINTS} data aktual terakhir.
        Akurasi meningkat seiring bertambahnya data.
      </p>
    </AceUICardChart>
  );
}

// Main AnalysisPanel component
interface AnalysisPanelProps {
  selectedAnalysis: string;
  onClose: () => void;
  data: SensorReading[];
}

export default function AnalysisPanel({
  selectedAnalysis,
  onClose,
  data,
}: AnalysisPanelProps) {
  const meta = ANALYSIS_META[selectedAnalysis];

  if (!meta) return null;

  if (data.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <div
          className="flex items-start justify-between px-6 py-4 border-b border-slate-100"
          style={{ borderLeftColor: meta.colorAccent, borderLeftWidth: 4 }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{meta.icon}</span>
            <h3 className="text-base font-semibold text-slate-800">{selectedAnalysis}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-10 text-center text-sm text-slate-400 bg-white">
          Tidak ada data untuk rentang tanggal yang dipilih.
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (selectedAnalysis) {
      case "Tren Ketinggian Air":
        return <TrenKetinggianAir data={data} meta={meta} onClose={onClose} />;
      case "Tren Intensitas Hujan":
        return <TrenIntensitasHujan data={data} meta={meta} onClose={onClose} />;
      case "Korelasi Hujan dan Tinggi Air":
        return <KorelasiHujanAir data={data} meta={meta} onClose={onClose} />;
      case "Analisis Kecepatan Kenaikan Air":
        return <AnalisisKecepatanKenaikanAir data={data} meta={meta} onClose={onClose} />;
      case "Statistik Harian":
        return <StatistikHarian data={data} meta={meta} onClose={onClose} />;
      case "Frekuensi Status Alarm":
        return <FrekuensiStatusAlarm data={data} meta={meta} onClose={onClose} />;
      case "Prediksi Kenaikan Air":
        return <PrediksiKenaikanAir data={data} meta={meta} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-5">
      {renderChart()}
    </div>
  );
}
