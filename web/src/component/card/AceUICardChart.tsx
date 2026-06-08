"use client";
import AceUICard from "./AceUICard";
import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar, Cell,
  ComposedChart,
  PieChart, Pie,
  CartesianGrid, Tooltip, XAxis, YAxis, Legend, ReferenceLine,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "10px",
  color: "#f1f5f9",
  fontSize: 12,
  padding: "8px 12px",
};

type AceUICardChartProps = {
  title: string;
  children: React.ReactNode;
  icon?: string;
  description?: string;
  onClose?: () => void;
  className?: string;
};

export default function AceUICardChart({ title, children, icon, description, onClose, className }: AceUICardChartProps) {
  return (
    <AceUICard className={className}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <h3 className="text-lg font-bold text-text">{title}</h3>
            {description && <p className="text-xs text-text/60 mt-0.5">{description}</p>}
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {description && <hr className="mb-4 border-secondary/20" />}
      {children}
    </AceUICard>
  );
}

type LineSeries = { dataKey: string; name: string; color: string };

type LineChartProps = {
  title: string;
  data: any[];
  lines: LineSeries[];
  icon?: string;
  description?: string;
  onClose?: () => void;
};

export function AceUILineChart({ title, data, lines, icon, description, onClose }: LineChartProps) {
  return (
    <AceUICardChart title={title} icon={icon} description={description} onClose={onClose}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {lines.map((line) => (
            <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} name={line.name} stroke={line.color} strokeWidth={2.5} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </AceUICardChart>
  );
}

type BarChartProps = {
  title: string;
  data: any[];
  icon?: string;
  description?: string;
  onClose?: () => void;
};

export function AceUIBarChart({ title, data, icon, description, onClose }: BarChartProps) {
  return (
    <AceUICardChart title={title} icon={icon} description={description} onClose={onClose}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} interval={5} />
          <YAxis tick={{ fontSize: 11 }} unit=" cm/h" />
          <Tooltip contentStyle={tooltipStyle} />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <Bar dataKey="delta_water" radius={[3, 3, 0, 0]}>
            {data.map((entry: any, idx: number) => (
              <Cell key={idx} fill={entry.delta_water > 5 ? "#ef4444" : entry.delta_water > 0 ? "#f59e0b" : "#22c55e"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </AceUICardChart>
  );
}

type ComposedChartProps = {
  title: string;
  data: any[];
  icon?: string;
  description?: string;
  onClose?: () => void;
};

export function AceUIComposedChart({ title, data, icon, description, onClose }: ComposedChartProps) {
  return (
    <AceUICardChart title={title} icon={icon} description={description} onClose={onClose}>
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis yAxisId="left" unit=" cm" />
          <YAxis yAxisId="right" orientation="right" unit="%" />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="water_level" name="Tinggi Air (cm)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="rain_sensor" name="Intensitas Hujan (%)" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </AceUICardChart>
  );
}

type PieChartData = { name: string; value: number; color: string };

type PieChartProps = {
  title: string;
  data: PieChartData[];
  total: number;
  icon?: string;
  description?: string;
  onClose?: () => void;
};

export function AceUIPieChart({ title, data, total, icon, description, onClose }: PieChartProps) {
  return (
    <AceUICardChart title={title} icon={icon} description={description} onClose={onClose}>
      <div className="flex flex-col md:flex-row items-center gap-8 py-4">
        <div className="w-[260px] h-[260px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={68} outerRadius={108} paddingAngle={3} dataKey="value">
                {data.map((entry, idx) => (<Cell key={idx} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-4 flex-1 w-full">
          {data.map((item) => {
            const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : "0";
            return (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-text w-20">{item.name}</span>
                <div className="flex-1 bg-background rounded-full h-2.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: item.color }} />
                </div>
                <span className="text-sm font-semibold text-text w-8 text-right">{item.value}</span>
                <span className="text-xs text-text/60 w-10">{percent}%</span>
              </div>
            );
          })}
          <p className="text-xs text-text/60 mt-1">Total pembacaan: {total} data point</p>
        </div>
      </div>
    </AceUICardChart>
  );
}
