import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { Bell, ChevronDown, Cloud, CloudRain, Droplets } from "lucide-react";
import { useState } from "react";

export type Tbody = {
  lokasi?: string;
  distance?: number | string;
  rain?: number | string;
  status_rain?: string;
  buzzer?: string;
  status?: string; // Untuk badge warna
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

type Data = {
  thead: Thead[];
  tbody: Tbody[];
  graph: GraphData[];
  latestWsData?: Tbody; // Menambahkan properti khusus untuk menerima data realtime dari WebSocket
};

function formatDistance(value: number | string | undefined) {
  const numericValue = Number(String(value ?? 0).replace(" cm", ""));

  if (Number.isNaN(numericValue)) {
    return "0";
  }

  return numericValue.toFixed(2);
}

function getFilteredGraphData(graphData: GraphData[], durationMinutes: number) {
  const maxPoints = Math.ceil((durationMinutes * 60) / 10); // 10 detik per titik
  // Jika data lebih sedikit dari yang dibutuhkan, tampilkan semua data
  if (graphData.length <= maxPoints) {
    return graphData;
  }
  return graphData.slice(-maxPoints);
}

function Dashboard(data: Data) {
  const [currentPage, setCurrentPage] = useState(1);
  const [graphDuration, setGraphDuration] = useState(60); // Default: 1 hour
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.tbody.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.tbody.slice(startIndex, startIndex + itemsPerPage);

  // Memprioritaskan data dari WebSocket untuk 4 kartu status di atas
  // Jika latestWsData kosong/belum masuk, akan *fallback* menggunakan index 0 dari tbody
  const latestData: Tbody = data.latestWsData || data.tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(data.graph, graphDuration);
  const panelClass = "rounded-2xl border border-secondary bg-background/80 backdrop-blur-sm";
  const controlClass =
    "min-w-45 appearance-none rounded-xl border border-secondary bg-background px-4 py-2 pr-11 text-sm font-medium text-text shadow-sm outline-none transition-all hover:border-secondary focus:border-secondary focus:ring-2 focus:ring-primary/30";

  return (
    <div className="flex flex-col gap-6">
      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan: STATUS BAHAYA!"
        message="Status alarm sedang aktif. (Banner ini akan tetap tampil sampai alarm kembali non-aktif)"
      />

      {/* SECTION: CARD STATUS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AceUICardStatus
          title="Tinggi Air"
          value={formatDistance(latestData.distance)}
          icon={<Droplets />}
          color="primary"
          unit="cm"
        />

        <AceUICardStatus
          title="Nilai Sensor Hujan"
          value={latestData.rain?.toString() || "0"}
          icon={<Cloud />}
          color="yellow"
          unit="raw"
        />

        <AceUICardStatus
          title="Status Hujan"
          value={latestData.status_rain || "-"}
          icon={<CloudRain />}
          color={latestData.status_rain === "Ya" ? "red" : "green"}
        />

        <AceUICardStatus
          title="Status Alarm"
          value={latestData.buzzer || "-"}
          icon={<Bell />}
          color={isBuzzerActive ? "red" : "green"}
        />
      </div>

      {/* SECTION: GRAFIK */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text">Grafik Monitoring Tinggi Air (Real-time)</h3>
          <div className="relative">
            <select
              value={graphDuration}
              onChange={(e) => setGraphDuration(Number(e.target.value))}
              className={controlClass}
            >
              <option value={10}>Last 10 minutes</option>
              <option value={30}>Last 30 minutes</option>
              <option value={60}>Last 1 hour</option>
              <option value={240}>Last 4 hours</option>
              <option value={1440}>Last 24 hours</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text/70" />
          </div>
        </div>
        <AceUICardGraphs
          data={filteredGraphData}
          start={0}
          end={10}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title=""
        />
      </div>

      {/* SECTION: CUSTOM TABLE (SAMA DENGAN HISTORY) */}
      <div className={`${panelClass} p-6`}>
        <h2 className="text-xl font-bold text-text mb-4">Riwayat Pengamatan</h2>
        <div className="overflow-x-auto rounded-2xl border border-secondary bg-background/60">
          <table className="w-full min-w-180 border-collapse text-sm">
            <thead className="bg-secondary/20 text-text">
              <tr>
                {data.thead.map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 font-semibold uppercase tracking-wider text-xs">
                    {h.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, i) => {
                const distanceValue = Number(
                  String(row.distance ?? row.tinggi_air ?? 0).replace(" cm", "")
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
                    <td className="px-5 py-4 font-medium text-text">{formatDistance(row.distance ?? row.tinggi_air)} cm</td>
                    <td className="px-5 py-4 text-text/80">{row.curah_hujan || row.rain}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={statusValue} />
                    </td>
                    <td className="px-5 py-4 text-text/70">{row.update_terakhir}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BUTTONS */}
        {/* <div className="flex justify-end mt-5 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border transition-all
              ${currentPage === 1 ? "text-text/40 bg-background/50 cursor-not-allowed border-secondary/10" : "text-text bg-secondary/20 hover:bg-secondary/30 border-secondary"}`}
          >
            Sebelumnya
          </button>

          {(() => {
            const maxVisible = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let endPage = Math.min(totalPages, startPage + maxVisible - 1);

            if (endPage - startPage + 1 < maxVisible) {
              startPage = Math.max(1, endPage - maxVisible + 1);
            }

            const pages = [];
            for (let i = startPage; i <= endPage; i++) {
              pages.push(i);
            }

            return (
              <>
                {startPage > 1 && <span className="px-2 text-gray-500 self-end mb-2">...</span>}
                {pages.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-4 py-2 rounded-lg border transition-all
                      ${n === currentPage ? "bg-primary text-background font-semibold border-primary shadow-md shadow-primary/20" : "text-text bg-background/60 hover:bg-secondary/20 border-secondary"}`}
                  >
                    {n}
                  </button>
                ))}
                {endPage < totalPages && <span className="px-2 text-text/50 self-end mb-2">...</span>}
              </>
            );
          })()}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border transition-all
              ${currentPage === totalPages ? "text-text/40 bg-background/50 cursor-not-allowed border-secondary/10" : "text-text bg-secondary/20 hover:bg-secondary/30 border-secondary"}`}
          >
            Selanjutnya
          </button>
        </div> */}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-emerald-100 text-emerald-900 border-emerald-400",
    Waspada: "bg-amber-100 text-amber-900 border-amber-400",
    Bahaya: "bg-rose-100 text-rose-900 border-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tracking-wide shadow-sm ${styles[status] ?? "bg-secondary/10 text-text border-secondary"}`}>
      {status}
    </span>
  );
}

export default Dashboard;