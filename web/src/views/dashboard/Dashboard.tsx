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
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.tbody.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.tbody.slice(startIndex, startIndex + itemsPerPage);

  // Memprioritaskan data dari WebSocket untuk 4 kartu status di atas
  // Jika latestWsData kosong/belum masuk, akan *fallback* menggunakan index 0 dari tbody
  const latestData: Tbody = data.latestWsData || data.tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(data.graph, graphDuration);

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
          toggle={true}
        />
      </div>

      {/* SECTION: GRAFIK */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-800">Grafik Monitoring Tinggi Air (Real-time)</h3>
          <div className="relative">
            <select
              value={graphDuration}
              onChange={(e) => setGraphDuration(Number(e.target.value))}
              className="min-w-45 appearance-none rounded-xl border border-[#7fb8c6] bg-[#f8fcfd] px-4 py-2 pr-11 text-sm font-medium text-[#2c6e7d] shadow-sm outline-none transition-all hover:border-[#6fb3c1] focus:border-[#6fb3c1] focus:ring-2 focus:ring-[#dff1f5]"
            >
              <option value={10}>Last 10 minutes</option>
              <option value={30}>Last 30 minutes</option>
              <option value={60}>Last 1 hour</option>
              <option value={240}>Last 4 hours</option>
              <option value={1440}>Last 24 hours</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2c6e7d]" />
          </div>
        </div>
        <AceUICardGraphs
          data={filteredGraphData}
          start={0}
          end={25}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title=""
        />
      </div>

      {/* SECTION: CUSTOM TABLE (SAMA DENGAN HISTORY) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Pengamatan</h2>
        {/* TABLE BODY (Design Biru Toska sesuai History) */}
        <div className="bg-[#e6f4f7] rounded-2xl overflow-hidden border border-[#b6dbe3]">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#6fb3c1] text-white">
                {data.thead.map((h, i) => (
                  <th key={i} className="text-left px-5 py-4 font-semibold uppercase tracking-wider">
                    {h.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((row, i) => (
                (() => {
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
                  className="border-b border-[#b6dbe3] last:border-0 hover:bg-[#d7eef3] transition-colors"
                >
                  <td className="px-5 py-4 font-medium">{formatDistance(row.distance ?? row.tinggi_air)} cm</td>
                  <td className="px-5 py-4">{row.curah_hujan || row.rain}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={statusValue} />
                  </td>
                  <td className="px-5 py-4 text-gray-600">{row.update_terakhir}</td>
                </tr>
                  );
                })()
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BUTTONS */}
        <div className="flex justify-end mt-5 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg border border-[#7fb8c6] transition-all
              ${currentPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
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
                    className={`px-4 py-2 rounded-lg border border-[#7fb8c6] transition-all
                      ${n === currentPage ? "bg-[#dff1f5] text-[#2c6e7d] font-semibold" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
                  >
                    {n}
                  </button>
                ))}
                {endPage < totalPages && <span className="px-2 text-gray-500 self-end mb-2">...</span>}
              </>
            );
          })()}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg border border-[#7fb8c6] transition-all
              ${currentPage === totalPages ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}`}
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-green-100 text-green-800",
    Waspada: "bg-yellow-100 text-yellow-800",
    Bahaya: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default Dashboard;