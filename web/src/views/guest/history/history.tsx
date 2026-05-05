// views/history/History.tsx

import { useState } from "react";

interface HistoryItem {
  lokasi: string;
  tinggi_air: string;
  curah_hujan: string;
  status: string;
  update_terakhir: string;
}

interface HistoryProps {
  tbody: HistoryItem[];
  thead: { title: string }[];
}

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "aman": return "badge-success";
    case "siaga": return "badge-warning";
    case "bahaya": return "badge-danger";
    default: return "badge-secondary";
  }
}

function History({ tbody, thead }: HistoryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hitung total page
  const totalPages = Math.ceil(tbody.length / itemsPerPage);

  // Slice data sesuai page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = tbody.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Riwayat Data Sensor</h2>
        <p className="text-sm text-gray-500">
          Data tinggi air dan curah hujan per lokasi
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-gray-500 mb-1">Total Lokasi</p>
          <p className="text-xl font-semibold">{tbody.length}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs text-green-600 mb-1">Aman</p>
          <p className="text-xl font-semibold text-green-700">
            {tbody.filter(r => r.status === "Aman").length}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
          <p className="text-xs text-yellow-600 mb-1">Siaga</p>
          <p className="text-xl font-semibold text-yellow-700">
            {tbody.filter(r => r.status === "Siaga").length}
          </p>
        </div>

        <div className="bg-red-50 rounded-lg p-3 border border-red-100">
          <p className="text-xs text-red-600 mb-1">Bahaya</p>
          <p className="text-xl font-semibold text-red-700">
            {tbody.filter(r => r.status === "Bahaya").length}
          </p>
        </div>
      </div>

       {/* TABLE */}
      <div className="bg-[#e6f4f7] rounded-2xl overflow-hidden border border-[#b6dbe3]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-[#6fb3c1] text-white">
              {thead.map((h, i) => (
                <th key={i} className="text-left px-5 py-4 font-semibold">
                  {h.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {currentData.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#b6dbe3] last:border-0 hover:bg-[#d7eef3]"
              >
                <td className="px-5 py-4">{row.lokasi}</td>
                <td className="px-5 py-4">{row.tinggi_air}</td>
                <td className="px-5 py-4">{row.curah_hujan}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-5 py-4">{row.update_terakhir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-end mt-5 gap-2">

        {/* PREV */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg border border-[#7fb8c6]
            ${currentPage === 1
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}
          `}
        >
          Prev
        </button>

        {/* NUMBER */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`
              px-4 py-2 rounded-lg border border-[#7fb8c6]
              ${
                n === currentPage
                  ? "bg-[#dff1f5] text-[#2c6e7d] font-semibold"
                  : "text-[#2c6e7d] hover:bg-[#e6f4f7]"
              }
            `}
          >
            {n}
          </button>
        ))}

        {/* NEXT */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg border border-[#7fb8c6]
            ${currentPage === totalPages
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-[#2c6e7d] hover:bg-[#e6f4f7]"}
          `}
        >
          Next
        </button>

      </div>
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-green-100 text-green-800",
    Siaga: "bg-yellow-100 text-yellow-800",
    Bahaya: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default History;