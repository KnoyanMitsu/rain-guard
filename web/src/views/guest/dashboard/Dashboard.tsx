import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { Bell, ChevronDown, Cloud, CloudRain, Droplets } from "lucide-react";
import { useState } from "react";

export type Tbody = {
  distance?: number | string;
  rain?: number | string;
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

function formatDistance(value: number | string | undefined) {
  const numericValue = Number(String(value ?? 0).replace(" cm", ""));
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toFixed(2);
}

function getFilteredGraphData(graphData: GraphData[], durationMinutes: number) {
  const maxPoints = Math.ceil((durationMinutes * 60) / 10);
  if (graphData.length <= maxPoints) return graphData;
  return graphData.slice(-maxPoints);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-emerald-100 text-emerald-900 border-emerald-400",
    Waspada: "bg-amber-100 text-amber-900 border-amber-400",
    Bahaya: "bg-rose-100 text-rose-900 border-rose-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tracking-wide shadow-sm ${
        styles[status] ?? "bg-secondary/10 text-text border-secondary"
      }`}
    >
      {status}
    </span>
  );
}

function GuestDashboard({ thead, tbody, graph, latestWsData }: DashboardProps) {
  const [graphDuration, setGraphDuration] = useState(60);

  // WebSocket data diutamakan, jika belum ada fallback ke data Firebase terbaru
  const latestData: Tbody = latestWsData || tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(graph, graphDuration);

  const panelClass = "rounded-2xl border border-secondary bg-white backdrop-blur-sm";

  return (
    <div className="flex flex-col gap-6">
      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan: STATUS BAHAYA!"
        message="Status alarm sedang aktif. (Banner ini akan tetap tampil sampai alarm kembali non-aktif)"
      />

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AceUICardStatus
          className="bg-white border border-gray-100 shadow-sm"
          title="Tinggi Air"
          value={formatDistance(latestData.distance)}
          icon={<Droplets />}
          color="primary"
          unit="cm"
        />
        <AceUICardStatus
          className="bg-white border border-gray-100 shadow-sm"
          title="Nilai Sensor Hujan"
          value={latestData.rain?.toString() || "0"}
          icon={<Cloud />}
          color="yellow"
          unit="raw"
        />
        <AceUICardStatus
          className="bg-white border border-gray-100 shadow-sm"
          title="Status Hujan"
          value={latestData.status_rain || "-"}
          icon={<CloudRain />}
          color={latestData.status_rain === "Ya" ? "red" : "green"}
        />
        <AceUICardStatus
          className="bg-white border border-gray-100 shadow-sm"
          title="Status Alarm"
          value={latestData.buzzer || "-"}
          icon={<Bell />}
          color={isBuzzerActive ? "red" : "green"}
        />
      </div>

      {/* Graph */}
      <div className="w-full bg-white border border-secondary shadow-sm rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text">
            Grafik Monitoring Tinggi Air (Real-time)
          </h3>
          <div className="relative">
            <select
              value={graphDuration}
              onChange={(e) => setGraphDuration(Number(e.target.value))}
              className="appearance-none rounded-xl border border-secondary bg-background px-5 py-2.5 pr-10 text-sm font-semibold text-text shadow-sm outline-none transition-all hover:border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value={10} className="text-text">Last 10 minutes</option>
              <option value={30} className="text-text">Last 30 minutes</option>
              <option value={60} className="text-text">Last 1 hour</option>
              <option value={240} className="text-text">Last 4 hours</option>
              <option value={1440} className="text-text">Last 24 hours</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
          </div>
        </div>
        <AceUICardGraphs
          className="bg-white border border-gray-100 shadow-sm"
          data={filteredGraphData}
          start={0}
          end={10}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title=""
        />
      </div>

      {/* Riwayat Pengamatan */}
      <div className={`${panelClass} p-6`}>
        <h2 className="text-xl font-bold text-text mb-4">Riwayat Pengamatan</h2>
        <div className="overflow-x-auto rounded-2xl border border-secondary bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-secondary/20 text-text">
              <tr>
                {thead.map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-4 font-semibold uppercase tracking-wider text-xs"
                  >
                    {h.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbody.slice(0, 10).map((row, i) => {
                const distanceValue = Number(
                  String(row.distance ?? row.tinggi_air ?? 0).replace(" cm", ""),
                );
                const statusValue =
                  distanceValue > 10
                    ? "Bahaya"
                    : distanceValue >= 5
                      ? "Waspada"
                      : "Aman";

                return (
                  <tr
                    key={i}
                    className="border-b border-secondary/15 last:border-0 hover:bg-secondary/10 transition-colors"
                  >
                    <td className="px-5 py-4 font-semibold text-black">
                      {formatDistance(row.distance ?? row.tinggi_air)} cm
                    </td>
                    <td className="px-5 py-4 font-semibold text-black">
                      {row.curah_hujan || row.rain}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={statusValue} />
                    </td>
                    <td className="px-5 py-4 font-semibold text-black">
                      {row.update_terakhir}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
