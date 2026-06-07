import { useMemo, useState } from "react";
import { Bell, ChevronDown, Cloud, CloudRain, Droplets } from "lucide-react";

import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";

export type Tbody = {
  distance?: number | string;
  tinggi_air?: number | string;
  rain?: number | string;
  curah_hujan?: number | string;
  status_rain?: string;
  buzzer?: string;
  status?: string;
  update_terakhir?: string;
  [key: string]: any;
};

export type Thead = {
  title: string;
};

export type GraphData = {
  time: string;
  tinggiAir: number;
};

type DashboardProps = {
  thead: Thead[];
  tbody: Tbody[];
  graph: GraphData[];
  latestWsData?: Tbody | null;
};

const GRAPH_DURATION_OPTIONS = [
  { label: "Last 10 minutes", value: 10 },
  { label: "Last 30 minutes", value: 30 },
  { label: "Last 1 hour", value: 60 },
  { label: "Last 4 hours", value: 240 },
  { label: "Last 24 hours", value: 1440 },
];

const STATUS_STYLES: Record<string, string> = {
  Aman: "bg-emerald-100 text-emerald-900 border-emerald-400",
  Waspada: "bg-amber-100 text-amber-900 border-amber-400",
  Bahaya: "bg-rose-100 text-rose-900 border-rose-400",
};

const cardClass = "bg-white border border-gray-100 shadow-sm";
const panelClass = "rounded-2xl border border-secondary bg-white backdrop-blur-sm";

function toNumber(value?: number | string) {
  const numericValue = Number(String(value ?? 0).replace(" cm", ""));
  return Number.isNaN(numericValue) ? 0 : numericValue;
}

function formatDistance(value?: number | string) {
  return toNumber(value).toFixed(2);
}

function getWaterStatus(distance: number) {
  if (distance > 10) return "Bahaya";
  if (distance >= 5) return "Waspada";
  return "Aman";
}

function getFilteredGraphData(graphData: GraphData[], durationMinutes: number) {
  const intervalSeconds = 10;
  const maxPoints = Math.ceil((durationMinutes * 60) / intervalSeconds);

  return graphData.length <= maxPoints
    ? graphData
    : graphData.slice(-maxPoints);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`
        inline-flex items-center gap-2 rounded-full border px-3 py-1.5
        text-sm font-semibold tracking-wide shadow-sm
        ${STATUS_STYLES[status] ?? "bg-secondary/10 text-text border-secondary"}
      `}
    >
      {status}
    </span>
  );
}

function GuestDashboard({ thead, tbody, graph, latestWsData }: DashboardProps) {
  const [graphDuration, setGraphDuration] = useState(60);

  const latestData = latestWsData || tbody[0] || {};

  const isBuzzerActive =
    latestData.buzzer?.trim().toLowerCase() === "aktif";

  const filteredGraphData = useMemo(
    () => getFilteredGraphData(graph, graphDuration),
    [graph, graphDuration],
  );

  return (
    <div className="flex flex-col gap-6 mx-auto py-15">
      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan: STATUS BAHAYA!"
        message="Status alarm sedang aktif. Banner ini akan tetap tampil sampai alarm kembali non-aktif."
      />

      {/* Tata letak utama: Kiri (Status Cards + Grafik), Kanan (Riwayat Pengamatan) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Status Cards & Grafik */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Status Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <AceUICardStatus
              className={cardClass}
              title="Tinggi Air"
              value={formatDistance(latestData.distance ?? latestData.tinggi_air)}
              icon={<Droplets />}
              color="primary"
              unit="cm"
            />

            <AceUICardStatus
              className={cardClass}
              title="Nilai Sensor Hujan"
              value={String(latestData.rain ?? latestData.curah_hujan ?? 0)}
              icon={<Cloud />}
              color="yellow"
              unit="raw"
            />

            <AceUICardStatus
              className={cardClass}
              title="Status Hujan"
              value={latestData.status_rain || "-"}
              icon={<CloudRain />}
              color={latestData.status_rain === "Ya" ? "red" : "green"}
            />

            <AceUICardStatus
              className={cardClass}
              title="Status Alarm"
              value={latestData.buzzer || "-"}
              icon={<Bell />}
              color={isBuzzerActive ? "red" : "green"}
            />
          </section>

          {/* Graph */}
          <section className="w-full rounded-2xl border border-secondary bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-text">
                Grafik Monitoring Tinggi Air (Real-time)
              </h3>

              <div className="relative">
                <select
                  value={graphDuration}
                  onChange={(event) => setGraphDuration(Number(event.target.value))}
                  className="
                    cursor-pointer appearance-none rounded-xl border border-secondary
                    bg-background px-5 py-2.5 pr-10 text-sm font-semibold text-text
                    shadow-sm outline-none transition-all hover:border-primary
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                  "
                >
                  {GRAPH_DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
              </div>
            </div>

            <AceUICardGraphs
              className={cardClass}
              data={filteredGraphData}
              start={0}
              end={10}
              dataKey="tinggiAir"
              titlelegend="Tinggi Air (cm)"
              title=""
            />
          </section>
        </div>

        {/* Kolom Kanan: Riwayat Pengamatan */}
        <section className={`${panelClass} p-6 flex flex-col h-full`}>
          <h2 className="mb-4 text-xl font-bold text-text">
            Riwayat Pengamatan
          </h2>

          <div className="overflow-auto rounded-2xl border border-secondary bg-white flex-1 max-h-[600px] lg:max-h-[none]">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-secondary/20 text-text sticky top-0 z-10">
                <tr>
                  {thead.map((head) => (
                    <th
                      key={head.title}
                      className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {head.title}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {tbody.slice(0, 10).map((row, index) => {
                  const distance = row.distance ?? row.tinggi_air;
                  const rain = row.curah_hujan ?? row.rain ?? "-";
                  const distanceValue = toNumber(distance);
                  const statusValue = getWaterStatus(distanceValue);

                  return (
                    <tr
                      key={index}
                      className="
                        border-b border-secondary/15 transition-colors
                        last:border-0 hover:bg-secondary/10
                      "
                    >
                      <td className="px-5 py-4 font-semibold text-black">
                        {formatDistance(distance)} cm
                      </td>

                      <td className="px-5 py-4 font-semibold text-black">
                        {rain}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={statusValue} />
                      </td>

                      <td className="px-5 py-4 font-semibold text-black">
                        {row.update_terakhir || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GuestDashboard;