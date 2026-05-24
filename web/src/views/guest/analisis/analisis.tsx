"use client";
import React, { useMemo } from "react";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from "recharts";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Constants
// ─────────────────────────────────────────────────────────────────────────────

interface SensorReading {
  time: string;
  hour: number;
  water_level: number;
  rain_sensor: number;
  status: "Aman" | "Waspada" | "Bahaya";
  delta_water: number;
}

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
// Chart Helper Components
// ─────────────────────────────────────────────────────────────────────────────

function TrenKetinggianAir({ data }: { data: SensorReading[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
        <YAxis tick={{ fontSize: 11 }} unit=" cm" domain={["auto", "auto"]} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v} cm`, "Tinggi Air"]} />
        <Legend />
        <ReferenceLine y={85} stroke="#f59e0b" strokeDasharray="4 4" />
        <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="4 4" />
        <Line type="monotone" dataKey="water_level" name="Tinggi Air (cm)" stroke={C_WATER} strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// Tambahkan komponen chart lainnya (KorelasiHujanAir, AnalisisJamRawan, dll) 
// di sini dengan cara yang sama seperti di atas agar tersedia untuk RenderChart.

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

interface AnalyticsProps {
  data: any[]; // Data mentah dari Firebase
  loading: boolean;
  selectedAnalysis: string; // Tipe analisis yang dipilih
}

const Analytics: React.FC<AnalyticsProps> = ({ data, loading, selectedAnalysis }) => {
  
  // Format data dari Firebase ke format SensorReading
  const formattedData: SensorReading[] = useMemo(() => {
    return data.map((d, index) => {
      const wl = d.tinggi_air || 0;
      const prevWl = index > 0 ? (data[index - 1].tinggi_air || 0) : wl;
      return {
        time: d.timestamp || "00:00",
        hour: new Date(d.timestamp).getHours() || 0,
        water_level: wl,
        rain_sensor: d.curah_hujan || 0,
        status: wl >= 120 ? "Bahaya" : wl >= 85 ? "Waspada" : "Aman",
        delta_water: wl - prevWl,
      };
    });
  }, [data]);

  const renderContent = () => {
    switch (selectedAnalysis) {
      case "Tren Ketinggian Air":
        return <TrenKetinggianAir data={formattedData} />;
      // Tambahkan case lainnya sesuai dengan komponen chart yang Anda buat
      default:
        return <div className="p-10 text-center text-slate-500">Pilih analisis yang valid.</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">{selectedAnalysis}</h2>
      
      {loading ? (
        <div className="h-[320px] flex items-center justify-center text-gray-400">
          Memuat data...
        </div>
      ) : (
        <div className="w-full">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default Analytics;