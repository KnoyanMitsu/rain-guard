import AceUICard from "./AceUICard";

type StatItem = {
  label: string;
  value: number;
  unit: string;
  color: string;
};

type StatsProps = {
  title: string;
  stats: StatItem[];
};

type MetricProps = {
  title: string;
  value: string | number;
  unit?: string;
};

export function AceUICardMetric({ title, value, unit }: MetricProps) {
  return (
    <AceUICard>
      <p className="text-sm text-text/60 mb-1">{title}</p>
      <div className="flex items-end gap-1">
        <p className="text-2xl font-bold text-text">{value}</p>
        {unit && <span className="text-sm text-text/70 mb-1">{unit}</span>}
      </div>
    </AceUICard>
  );
}

export default function AceUICardStats({
  title,
  stats,
}: StatsProps) {
  return (
    <AceUICard>
      <h3 className="text-lg font-bold text-text mb-4">
        {title}
      </h3>

      <div className="space-y-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex justify-between items-center border-b border-secondary pb-2"
          >
            <span className="text-text/70">
              {s.label}
            </span>

            <span
              className="font-bold"
              style={{ color: s.color }}
            >
              {s.value} {s.unit}
            </span>
          </div>
        ))}
      </div>
    </AceUICard>
  );
}