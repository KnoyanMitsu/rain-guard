import React from "react";
import AceUICardWithTitle from "./AceUICardWithTitle";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
};

function AceUICardGraphs({
  data,
  start,
  end,
  dataKey,
  titlelegend,
  title,
}: Props) {
  return (
    <>
      <AceUICardWithTitle title={title}>
        <div className="w-full h-[300px] sm:h-[400px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#dedcff"
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#050315", opacity: 0.7 }}
                dy={10}
              />
              <YAxis
                domain={[start, end]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#050315", opacity: 0.7 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid #dedcff",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "#fbfbfe",
                  color: "#050315",
                }}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                name={titlelegend}
                stroke="var(--color-secondary)"
                fillOpacity={1}
                fill="url(#colorAir)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AceUICardWithTitle>
    </>
  );
}

export default AceUICardGraphs;
