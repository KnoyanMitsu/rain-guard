import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardTable from "@/component/card/AceUICardTable";
import saveJson from "@/pages/dashboard/saveCSV";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";

// Definisikan tipe data sesuai dengan payload WebSocket (distance: double, rain: int64)
export type Tbody = {
  distance?: number | string;
  rain?: number | string;
  status_rain?: string;
  buzzer?: string;
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
};

function Dashboard(data: Data) {
  // Mengambil data terbaru dari WebSocket untuk ditampilkan di Card
  const latestData: Tbody = data.tbody[0] || {};

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card Distance - Menangani tipe double */}
        <AceUICardStatus
          title="Distance"
          value={
            typeof latestData.distance === 'number' 
              ? latestData.distance.toFixed(2) 
              : (latestData.distance?.toString().replace(" cm", "") || "0")
          }
          icon={<Droplets />}
          color="primary"
          unit="cm"
        />

        {/* Card Rain Sensor - Menangani tipe int64 */}
        <AceUICardStatus
          title="Rain Sensor"
          value={latestData.rain?.toString() || "0"}
          icon={<Cloud />}
          color="yellow"
          unit="raw"
        />

        {/* Card Status Hujan - Warna Dinamis */}
        <AceUICardStatus
          title="Status Hujan"
          value={latestData.status_rain || "-"}
          icon={<CloudRain />}
          color={latestData.status_rain === "Ya" ? "red" : "green"}
        />

        {/* Card Buzzer - Warna Dinamis */}
        <AceUICardStatus
          title="Buzzer"
          value={latestData.buzzer || "-"}
          icon={<Bell />}
          color={latestData.buzzer === "Aktif" ? "red" : "green"}
          toggle={true}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Grafik Real-time */}
        <AceUICardGraphs
          data={data.graph}
          start={0}
          end={500}
          dataKey="tinggiAir"
          titlelegend="Distance (cm)"
          title="Grafik Monitoring Jarak Air (Real-time)"
        />

        {/* Tabel History Real-time */}
        <AceUICardTable
          title="History Pengamatan"
          thead={data.thead}
          tbody={data.tbody}
          buttonSave
          buttonTitle="Save as CSV"
          onClick={() => saveJson({ data: data.tbody, fileName: "history.csv" })}
        />
      </div>
    </>
  );
}

export default Dashboard;