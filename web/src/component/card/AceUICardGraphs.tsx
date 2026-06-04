import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AceUICardWithTitle from "./AceUICardWithTitle";

export type Data = {
  [key: string]: any;
};

type Props = {
  data: Data[];
  start: number;
  end: number;
  dataKey: string;
  titlelegend: string;
  title: string;
  className?: string;
};

function AceUICardGraphs({
  data,
  start,
  end,
  dataKey,
  titlelegend,
  title,
  className = "",
}: Props) {
  return (
    <>
      <AceUICardWithTitle title={title} className={className}>
        <div className="w-full h-75 sm:h-100 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-secondary)"
                opacity={0.35}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-text)", opacity: 0.82 }}
                dy={10}
              />
              <YAxis
                domain={[start, end]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-text)", opacity: 0.82 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid var(--color-secondary)",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.35)",
                  backgroundColor: "var(--color-background)",
                  color: "var(--color-text)",
                }}
                labelStyle={{ color: "var(--color-text)", fontWeight: 700 }}
                itemStyle={{ color: "var(--color-accent)" }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                name={titlelegend}
                stroke="var(--color-accent)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAir)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AceUICardWithTitle>
    </>
  );
}

export default AceUICardGraphs;
