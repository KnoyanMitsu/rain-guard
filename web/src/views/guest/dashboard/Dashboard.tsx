import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";

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

const Dashboard = ({ websocketData, thead, tbody, graph }: DashboardProps) => {
  const isBuzzerActive = websocketData.buzzer?.trim().toLowerCase() === "aktif";

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
          toggle={true}
        />
      </div>

      <div className="w-full">
        <AceUICardGraphs
          data={graph}
          start={0}
          end={100}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title="Grafik Monitoring Tinggi Air (Real-time)"
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