import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardTable from "@/component/card/AceUICardTable";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";

export type Tbody = {
  [key: string]: string;
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
          data={data.graph}
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
          tbody={data.tbody}
        />
      </div>
    </>
  );
}

export default Dashboard;
