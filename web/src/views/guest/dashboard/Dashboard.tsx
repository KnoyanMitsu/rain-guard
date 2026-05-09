// src/views/guest/dashboard/Dashboard.tsx

interface DashboardProps {
  thead: { title: string }[];
  tbody: {
    // Berdasarkan gambar: distance = double, rain = int64
    // Dalam TypeScript, keduanya direpresentasikan sebagai 'number'
    distance: number;    
    rain: number;        
    status_rain: string; 
    buzzer: string;      
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
        <h3 className="text-lg font-bold mb-4">Tren Ketinggian Air (Distance)</h3>
        <div className="h-64 w-full bg-gray-50 flex items-center justify-center rounded-lg border border-dashed border-gray-300">
           {/* Render grafik menggunakan data dari props 'graph' */}
           <p className="text-gray-400 text-sm">Grafik Monitoring Real-time</p>
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
                  {/* .toFixed(2) opsional untuk merapikan tampilan double/float */}
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {typeof row.distance === 'number' ? row.distance.toFixed(2) : row.distance} cm
                  </td>
                  <td className="px-6 py-4">{row.rain}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.status_rain} type="hujan" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={row.buzzer} type="buzzer" />
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

// Komponen Badge tetap sama
function StatusBadge({ status, type }: { status: string; type: 'hujan' | 'buzzer' }) {
  let style = "bg-gray-100 text-gray-700";

  if (type === 'hujan') {
    style = status === "Ya" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";
  } else if (type === 'buzzer') {
    style = status === "Aktif" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {status}
    </span>
  );
}

export default Dashboard;