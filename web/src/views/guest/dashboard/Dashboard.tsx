// src/views/guest/dashboard/Dashboard.tsx

// Import komponen Chart atau UI lainnya jika ada

interface DashboardProps {
  thead: { title: string }[];
  tbody: {
    lokasi: string;
    tinggi_air: string;
    curah_hujan: string;
    status: string;
    update_terakhir: string;
  }[];
  graph: {
    time: string;
    tinggiAir: number;
  }[];
}

const Dashboard = ({ thead, tbody, graph }: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Bagian Grafik */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Tren Tinggi Air</h3>
        {/* Render grafik kamu di sini menggunakan data dari props 'graph' */}
        {/* Contoh: <MyChart data={graph} /> */}
      </div>

      {/* Bagian Tabel (Sama stylenya dengan History) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
              <tr>
                {thead.map((h, i) => (
                  <th key={i} className="px-6 py-4">{h.title}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tbody.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{row.lokasi}</td>
                  <td className="px-6 py-4">{row.tinggi_air}</td>
                  <td className="px-6 py-4">{row.curah_hujan}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500">{row.update_terakhir}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Komponen Badge agar seragam dengan History
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-green-100 text-green-700",
    Siaga: "bg-yellow-100 text-yellow-700",
    Bahaya: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status] || "bg-gray-100"}`}>
      {status}
    </span>
  );
}

export default Dashboard;