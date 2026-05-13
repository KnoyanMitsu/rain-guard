import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { Bell, ChevronDown, Cloud, CloudRain, Droplets } from "lucide-react";
import { useState } from "react";

interface DashboardProps {
  websocketData: {
    distance: number;
    rain: number;
    status_rain: string;
    buzzer: string;
  };
  thead: { title: string }[];
  tbody: {
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

function formatDistance(value: number | string | undefined) {
  const numericValue = Number(String(value ?? 0).replace(" cm", ""));

  if (Number.isNaN(numericValue)) {
    return "0.00";
  }

  return numericValue.toFixed(2);
}

function getFilteredGraphData(graphData: DashboardProps["graph"], durationMinutes: number) {
  const maxPoints = Math.ceil((durationMinutes * 60) / 10); // 10 detik per titik
  // Jika data lebih sedikit dari yang dibutuhkan, tampilkan semua data
  if (graphData.length <= maxPoints) {
    return graphData;
  }
  return graphData.slice(-maxPoints);
}

const Dashboard = ({ websocketData, thead, tbody, graph }: DashboardProps) => {
  const [graphDuration, setGraphDuration] = useState(60); // Default: 1 hour
  const isBuzzerActive = websocketData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(graph, graphDuration);

  return (
    <div className="flex flex-col gap-6">
      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan Buzzer Aktif"
        message="Status alarm sedang aktif. Banner ini akan tetap tampil sampai buzzer kembali non-aktif."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AceUICardStatus
          title="Tinggi Air"
          value={formatDistance(websocketData.distance)}
          icon={<Droplets />}
          color="primary"
          unit="cm"
        />

        <AceUICardStatus
          title="Nilai Sensor Hujan"
          value={websocketData.rain.toString()}
          icon={<Cloud />}
          color="yellow"
          unit="raw"
        />

        <AceUICardStatus
          title="Status Hujan"
          value={websocketData.status_rain}
          icon={<CloudRain />}
          color={websocketData.status_rain === "Ya" ? "red" : "green"}
        />

        <AceUICardStatus
          title="Status Alarm"
          value={websocketData.buzzer}
          icon={<Bell />}
          color={isBuzzerActive ? "red" : "green"}
        />
      </div>

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
          end={100}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title=""
        />
      </div>
    </div>
  );
};

// function StatusBadge({ status }: { status: string }) {
//   let style = "bg-gray-100 text-gray-700";

//   if (status === "Aman") {
//     style = "bg-green-100 text-green-800 border border-green-200";
//   } else if (status === "Siaga") {
//     style = "bg-yellow-100 text-yellow-800 border border-yellow-200";
//   } else if (status === "Bahaya") {
//     style = "bg-red-100 text-red-800 border border-red-200";
//   }

//   return (
//     <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
//       {status}
//     </span>
//   );
// }

export default Dashboard;