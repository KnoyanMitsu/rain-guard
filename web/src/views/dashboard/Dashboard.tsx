import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardTable from "@/component/card/AceUICardTable";
import AceUICardWithTitle from "@/component/card/AceUICardWithTitle";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";

const tbody = [
  {
    lokasi: "Sungai Ciliwung",
    tinggi_air: "85 cm",
    curah_hujan: "12.5 mm/jam",
    status: "Waspada",
    update_terakhir: "5 menit lalu",
  },
  {
    lokasi: "Sungai Cisadane",
    tinggi_air: "45 cm",
    curah_hujan: "5.2 mm/jam",
    status: "Aman",
    update_terakhir: "8 menit lalu",
  },
  {
    lokasi: "Bendungan Katulampa",
    tinggi_air: "120 cm",
    curah_hujan: "25.8 mm/jam",
    status: "Bahaya",
    update_terakhir: "2 menit lalu",
  },
  {
    lokasi: "Kali Pesanggrahan",
    tinggi_air: "62 cm",
    curah_hujan: "8.3 mm/jam",
    status: "Aman",
    update_terakhir: "10 menit lalu",
  },
];

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Data dummy disesuaikan dengan range skala 20 - 400
const dummyData = [
  { time: "00:00", tinggiAir: 50 },
  { time: "04:00", tinggiAir: 80 },
  { time: "08:00", tinggiAir: 150 },
  { time: "12:00", tinggiAir: 320 },
  { time: "16:00", tinggiAir: 380 },
  { time: "20:00", tinggiAir: 250 },
  { time: "24:00", tinggiAir: 120 },
];

function Dashboard() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AceUICardStatus
          title="Tinggi Air Rata-rata"
          value="150" // Disesuaikan angkanya
          icon={<Droplets />}
          color="green"
          unit="cm"
        />
        <AceUICardStatus
          title="Curah Hujan"
          color="yellow"
          icon={<Cloud />}
          value="12"
          unit="mm/jam"
        />
        <AceUICardStatus
          title="Status Hujan"
          color="red"
          icon={<CloudRain />}
          value="Ya"
        />
        <AceUICardStatus
          title="Status Sirine"
          color="green"
          icon={<Bell />}
          value="Tidak"
          toggle={true}
        />
      </div>

      {/* Bagian Grafik */}
      <div className="grid grid-cols-1 gap-4">
        <AceUICardGraphs
          data={dummyData}
          start={20}
          end={400}
          dataKey="tinggiAir"
          titlelegend="Tinggi Air (cm)"
          title="Grafik Ketinggian Air (24 Jam)"
        />

        <AceUICardTable
          title="History dalam 30 hari"
          thead={[
            { title: "Lokasi" },
            { title: "Tinggi Air" },
            { title: "Curah Hujan" },
            { title: "Status" },
            { title: "Update Terakhir" },
          ]}
          tbody={tbody}
        />
      </div>
    </>
  );
}

export default Dashboard;
