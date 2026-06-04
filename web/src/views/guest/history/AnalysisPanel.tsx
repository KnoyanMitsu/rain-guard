"use client";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface SensorReading {
  time: string;
  hour: number;
  water_level: number;
  rain_sensor: number;
  status: "Aman" | "Waspada" | "Bahaya";
  delta_water: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// Analysis metadata config
// ─────────────────────────────────────────────────────────────────────────────

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
  "Analisis Delay Hujan-Air": {
    deskripsi: "Menampilkan jeda waktu antara hujan dan kenaikan air.",
    dataDigunakan: ["Rain Sensor Value (%)", "Water Level (cm)", "Timestamp"],
    visualisasi: "Overlay Line Chart",
    colorAccent: "#f59e0b",
    icon: "⏱️",
  },
  "Analisis Jam Rawan": {
    deskripsi: "Menampilkan jam yang paling rawan terjadi kenaikan air.",
    dataDigunakan: ["Water Level (cm)", "Rain Sensor (%)", "Timestamp"],
    visualisasi: "Bar Chart per Jam",
    colorAccent: "#ef4444",
    icon: "⏰",
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
  "Riwayat Monitoring": {
    deskripsi: "Menampilkan histori monitoring sensor secara kronologis.",
    dataDigunakan: ["Semua Data Sensor"],
    visualisasi: "Data Table",
    colorAccent: "#14b8a6",
    icon: "📋",
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

// ─────────────────────────────────────────────────────────────────────────────
// Chart components
// ─────────────────────────────────────────────────────────────────────────────

function TrenKetinggianAir({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis tick={{ fontSize: 11 }} unit=" cm" domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: unknown) => [`${Number(v)} cm`, "Tinggi Air"]}
        />
        <Legend />
        <ReferenceLine y={85} stroke="#f59e0b" strokeDasharray="4 4" />
        <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="water_level"
          name="Tinggi Air (cm)"
          stroke={C_WATER}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TrenIntensitasHujan({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: unknown) => [`${Number(v)}%`, "Intensitas Hujan"]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="rain_sensor"
          name="Intensitas Hujan (%)"
          stroke={C_RAIN}
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function KorelasiHujanAir({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11 }}
          unit=" cm"
          domain={["auto", "auto"]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11 }}
          unit="%"
          domain={[0, 100]}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="water_level"
          name="Tinggi Air (cm)"
          stroke={C_WATER}
          strokeWidth={2.5}
          dot={false}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="rain_sensor"
          name="Intensitas Hujan (%)"
          stroke="#8b5cf6"
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function AnalisisDelayHujanAir({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ComposedChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 11 }}
          unit=" cm"
          domain={["auto", "auto"]}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 11 }}
          unit="%"
          domain={[0, 100]}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Area
          yAxisId="right"
          type="monotone"
          dataKey="rain_sensor"
          name="Hujan (%)"
          stroke={C_RAIN}
          fill="#6fb3c122"
          strokeWidth={2}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="water_level"
          name="Tinggi Air (cm)"
          stroke={C_WATER}
          strokeWidth={2.5}
          dot={false}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function AnalisisJamRawan({ data }: { data: SensorReading[] }) {
  const byHour: Record<number, { total: number; count: number }> = {};
  data.forEach((d) => {
    if (!byHour[d.hour]) byHour[d.hour] = { total: 0, count: 0 };
    byHour[d.hour].total += d.water_level;
    byHour[d.hour].count++;
  });

  const hourlyData = Array.from({ length: 24 }, (_, h) => ({
    jam: `${h.toString().padStart(2, "0")}:00`,
    avg_water: byHour[h]
      ? Math.round(byHour[h].total / byHour[h].count)
      : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={hourlyData}
        margin={{ top: 10, right: 24, left: 0, bottom: 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="jam"
          tick={{ fontSize: 9 }}
          angle={-45}
          textAnchor="end"
          height={55}
        />
        <YAxis tick={{ fontSize: 11 }} unit=" cm" />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: unknown) => [`${Number(v)} cm`, "Rata-rata Tinggi Air"]}
        />
        <ReferenceLine
          y={85}
          stroke="#f59e0b"
          strokeDasharray="4 4"
          label={{ value: "Waspada", fill: "#f59e0b", fontSize: 10, position: "right" }}
        />
        <ReferenceLine
          y={120}
          stroke="#ef4444"
          strokeDasharray="4 4"
          label={{ value: "Bahaya", fill: "#ef4444", fontSize: 10, position: "right" }}
        />
        <Bar dataKey="avg_water" name="Rata-rata Tinggi Air" radius={[4, 4, 0, 0]}>
          {hourlyData.map((entry, idx) => (
            <Cell
              key={idx}
              fill={
                entry.avg_water >= 120
                  ? "#ef4444"
                  : entry.avg_water >= 85
                  ? "#f59e0b"
                  : "#6fb3c1"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function AnalisisKecepatanKenaikanAir({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis tick={{ fontSize: 11 }} unit=" cm/h" />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: unknown) => [`${Number(v)} cm/h`, "Kecepatan Kenaikan"]}
        />
        <ReferenceLine y={0} stroke="#94a3b8" />
        <Bar
          dataKey="delta_water"
          name="Kecepatan Kenaikan (cm/h)"
          radius={[3, 3, 0, 0]}
        >
          {data.map((entry, idx) => (
            <Cell
              key={idx}
              fill={
                entry.delta_water > 5
                  ? "#ef4444"
                  : entry.delta_water > 0
                  ? "#f59e0b"
                  : "#22c55e"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function StatistikHarian({ data }: { data: SensorReading[] }) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
        >
          <div
            className="px-5 py-3 text-sm font-semibold text-white"
            style={{ backgroundColor: s.color }}
          >
            {s.label}
          </div>
          <div style={{ backgroundColor: s.bg }}>
            {[
              { key: "Minimum", val: s.min, icon: "↓", cls: "text-blue-500" },
              { key: "Maksimum", val: s.max, icon: "↑", cls: "text-red-500" },
              { key: "Rata-rata", val: s.avg, icon: "≈", cls: "text-slate-500" },
            ].map(({ key, val, icon, cls }) => (
              <div
                key={key}
                className="flex items-center justify-between px-5 py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-base ${cls}`}>{icon}</span>
                  <span className="text-sm text-slate-500">{key}</span>
                </div>
                <span className="font-semibold text-slate-800 text-sm">
                  {val}{" "}
                  <span className="text-slate-400 font-normal">{s.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FrekuensiStatusAlarm({ data }: { data: SensorReading[] }) {
  const counts = { Aman: 0, Waspada: 0, Bahaya: 0 };
  data.forEach((d) => {
    counts[d.status]++;
  });

  const pieData = (
    ["Aman", "Waspada", "Bahaya"] as Array<"Aman" | "Waspada" | "Bahaya">
  )
    .map((k) => ({ name: k, value: counts[k] }))
    .filter((d) => d.value > 0);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 py-4">
      <ResponsiveContainer width={260} height={260}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={108}
            paddingAngle={3}
            dataKey="value"
          >
            {pieData.map((entry, idx) => (
              <Cell key={idx} fill={PIE_COLORS[entry.name]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-4 flex-1">
        {pieData.map((d) => (
          <div key={d.name} className="flex items-center gap-3">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: PIE_COLORS[d.name] }}
            />
            <span className="text-sm text-slate-600 w-20">{d.name}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${((d.value / data.length) * 100).toFixed(1)}%`,
                  backgroundColor: PIE_COLORS[d.name],
                }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-800 w-8 text-right">
              {d.value}
            </span>
            <span className="text-xs text-slate-400 w-10">
              {((d.value / data.length) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
        <p className="text-xs text-slate-400 mt-1">
          Total pembacaan: {data.length} data point
        </p>
      </div>
    </div>
  );
}

function RiwayatMonitoring({ data }: { data: SensorReading[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 max-h-72 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr className="bg-slate-800 text-white">
            {["Waktu", "Tinggi Air", "Hujan", "Kecepatan", "Status"].map((h) => (
              <th key={h} className="text-left px-4 py-3 font-semibold whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-2.5 text-slate-500 font-mono text-xs">
                {row.time}
              </td>
              <td className="px-4 py-2.5 font-medium text-slate-800">
                {row.water_level}{" "}
                <span className="text-xs text-slate-400">cm</span>
              </td>
              <td className="px-4 py-2.5 text-slate-600">
                {row.rain_sensor}
                <span className="text-xs text-slate-400">%</span>
              </td>
              <td
                className={`px-4 py-2.5 font-medium text-xs ${
                  row.delta_water > 0
                    ? "text-red-500"
                    : row.delta_water < 0
                    ? "text-green-500"
                    : "text-slate-400"
                }`}
              >
                {row.delta_water > 0 ? "+" : ""}
                {row.delta_water} cm/h
              </td>
              <td className="px-4 py-2.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === "Aman"
                      ? "bg-green-100 text-green-700"
                      : row.status === "Waspada"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrediksiKenaikanAir({ data }: { data: SensorReading[] }) {
  const lastWl = data[data.length - 1]?.water_level ?? 60;
  const lastRain = data[data.length - 1]?.rain_sensor ?? 20;
  const trend = lastRain > 50 ? 5 : lastRain > 30 ? 2 : -1;

  // Take last 12 actual points + 6 forecast
  const actualSlice = data.slice(-12).map((d) => ({
    ...d,
    forecast: undefined as number | undefined,
  }));

  const forecastPoints = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() + i + 1, 0, 0, 0);
    return {
      time: `${d.getHours().toString().padStart(2, "0")}:00 ▸`,
      hour: d.getHours(),
      water_level: undefined as number | undefined,
      rain_sensor: undefined as number | undefined,
      status: "Aman" as const,
      delta_water: trend,
      forecast: Math.max(
        20,
        Math.min(
          150,
          Math.round(lastWl + trend * (i + 1) + (Math.random() - 0.3) * 5)
        )
      ),
    };
  });

  const combined = [...actualSlice, ...forecastPoints];

  return (
    <div className="bg-white">
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-0.5 bg-blue-500 inline-block rounded" />
          <span>Data aktual</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 h-0.5 bg-rose-400 inline-block rounded border-dashed border border-rose-400" />
          <span>Prediksi (6 jam ke depan)</span>
        </div>
        <span className="ml-auto">
          Tren:{" "}
          <span
            className={`font-medium ${
              trend > 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            {trend > 0 ? `+${trend}` : trend} cm/h
          </span>
        </span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={combined} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={1} />
          <YAxis tick={{ fontSize: 11 }} unit=" cm" domain={["auto", "auto"]} />
          <Tooltip contentStyle={tooltipStyle} />
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
            stroke={C_WATER}
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
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AnalysisPanel component
// ─────────────────────────────────────────────────────────────────────────────

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
        return <TrenKetinggianAir data={data} />;
      case "Tren Intensitas Hujan":
        return <TrenIntensitasHujan data={data} />;
      case "Korelasi Hujan dan Tinggi Air":
        return <KorelasiHujanAir data={data} />;
      case "Analisis Delay Hujan-Air":
        return <AnalisisDelayHujanAir data={data} />;
      case "Analisis Jam Rawan":
        return <AnalisisJamRawan data={data} />;
      case "Analisis Kecepatan Kenaikan Air":
        return <AnalisisKecepatanKenaikanAir data={data} />;
      case "Statistik Harian":
        return <StatistikHarian data={data} />;
      case "Frekuensi Status Alarm":
        return <FrekuensiStatusAlarm data={data} />;
      case "Riwayat Monitoring":
        return <RiwayatMonitoring data={data} />;
      case "Prediksi Kenaikan Air":
        return <PrediksiKenaikanAir data={data} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
      {/* ── Panel header ────────────────────────────────────── */}
      <div
        className="flex items-start justify-between px-6 py-4 border-b border-slate-100"
        style={{ borderLeftColor: meta.colorAccent, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <h3 className="text-base font-semibold text-slate-800 leading-tight">
              {selectedAnalysis}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{meta.deskripsi}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 flex-shrink-0"
          title="Tutup analisis"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* ── Data info bar ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2 px-6 py-3 bg-white border-b border-slate-100">
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">
          Data:
        </span>
        {meta.dataDigunakan.map((d) => (
          <span
            key={d}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-600 shadow-sm"
          >
            {d}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-400">
          Visualisasi:{" "}
          <span
            className="font-semibold"
            style={{ color: meta.colorAccent }}
          >
            {meta.visualisasi}
          </span>
        </span>
      </div>

      {/* ── Chart / Table area ───────────────────────────────── */}
      <div className="p-6">{renderChart()}</div>
    </div>
  );
}
