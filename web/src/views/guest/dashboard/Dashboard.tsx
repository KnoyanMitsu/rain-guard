// src/views/guest/dashboard/Dashboard.tsx (atau src/views/dashboard/Dashboard.tsx)

interface DashboardProps {
  thead: { title: string }[];
  tbody: {
    tinggi_air: string;
    curah_hujan: string;
    status: string;
    update_terakhir: string;
  }[];
  graph: {
    time: string;
    tinggiAir: number; // Tetap number karena ini hasil plot grafik
  }[];
}

const Dashboard = ({ thead, tbody, graph }: DashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Bagian Grafik */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Tren Ketinggian Air</h3>
        <div className="h-64 w-full bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
           {/* Render grafik menggunakan data dari props 'graph' */}
           <p className="text-gray-400 text-sm">Grafik Monitoring Ketinggian Air</p>
        </div>
      </div>

      {/* Bagian Tabel */}
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
                  {/* Tinggi Air */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {row.tinggi_air}
                  </td>
                  
                  {/* Curah Hujan */}
                  <td className="px-6 py-4 text-gray-600">
                    {row.curah_hujan}
                  </td>
                  
                  {/* Status (Menggunakan badge) */}
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  
                  {/* Pembaruan Waktu Terakhir */}
                  <td className="px-6 py-4 text-gray-500">
                    {row.update_terakhir}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Komponen Badge yang sudah disesuaikan untuk status "Aman", "Siaga", "Bahaya"
function StatusBadge({ status }: { status: string }) {
  let style = "bg-gray-100 text-gray-700";

  if (status === "Aman") {
    style = "bg-green-100 text-green-800";
  } else if (status === "Siaga") {
    style = "bg-yellow-100 text-yellow-800";
  } else if (status === "Bahaya") {
    style = "bg-red-100 text-red-800";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {status}
    </span>
  );
}

export default Dashboard;