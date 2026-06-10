"use client";
import { useRef, useState, useEffect, useMemo } from "react";
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
  backgroundColor: "var(--color-background)",
  border: "1px solid var(--color-secondary)",
  borderRadius: "10px",
  color: "var(--color-text)",
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
          <button onClick={onClose} className="text-text/50 hover:text-text p-1.5 rounded-lg hover:bg-secondary/20">
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary)" opacity={0.35} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-text)", opacity: 0.82 }} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.82 }} />
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const interval = useMemo(
    () => containerWidth < 640
      ? Math.max(1, Math.floor(data.length / 10))   // HP: ~10 label
      : Math.max(1, Math.floor(data.length / 30)),  // laptop: ~30 label
    [containerWidth, data.length]
  );

  return (
    <AceUICardChart title={title} icon={icon} description={description} onClose={onClose}>
      <div ref={containerRef}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary)" opacity={0.35} />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-text)", opacity: 0.82 }} interval={interval} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.82 }} unit=" cm/h" />
          <Tooltip contentStyle={tooltipStyle} />
          <ReferenceLine y={0} stroke="var(--color-text)" opacity={0.3} />
          <Bar dataKey="delta_water" radius={[3, 3, 0, 0]}>
            {data.map((entry: any, idx: number) => (
              <Cell key={idx} fill={entry.delta_water > 5 ? "#ef4444" : entry.delta_water > 0 ? "#f59e0b" : "#22c55e"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
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
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-secondary)" opacity={0.35} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-text)", opacity: 0.82 }} />
          <YAxis yAxisId="left" unit=" cm" tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.82 }} />
          <YAxis yAxisId="right" orientation="right" unit="%" tick={{ fontSize: 11, fill: "var(--color-text)", opacity: 0.82 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="water_level" name="Tinggi Air (cm)" stroke="var(--chart-water)" strokeWidth={2.5} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="rain_sensor" name="Intensitas Hujan (%)" stroke="var(--chart-rain)" strokeWidth={2.5} dot={false} />
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
