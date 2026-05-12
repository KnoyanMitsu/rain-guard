import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";
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

function Dashboard(data: Data) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.tbody.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.tbody.slice(startIndex, startIndex + itemsPerPage);

  // Memprioritaskan data dari WebSocket untuk 4 kartu status di atas
  // Jika latestWsData kosong/belum masuk, akan *fallback* menggunakan index 0 dari tbody
  const latestData: Tbody = data.latestWsData || data.tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";

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
        <AceUICardGraphs
          data={data.graph}
          start={0}
          end={100}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title="Grafik Monitoring Tinggi Air (Real-time)"
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