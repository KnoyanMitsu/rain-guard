import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardTable from "@/component/card/AceUICardTable";
import AceUICardWithTitle from "@/component/card/AceUICardWithTitle";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";


const tbody = [
  {
    "lokasi": "Sungai Ciliwung",
    "tinggi_air": "85 cm",
    "curah_hujan": "12.5 mm/jam",
    "status": "Waspada",
    "update_terakhir": "5 menit lalu"
  },
  {
    "lokasi": "Sungai Cisadane",
    "tinggi_air": "45 cm",
    "curah_hujan": "5.2 mm/jam",
    "status": "Aman",
    "update_terakhir": "8 menit lalu"
  },
  {
    "lokasi": "Bendungan Katulampa",
    "tinggi_air": "120 cm",
    "curah_hujan": "25.8 mm/jam",
    "status": "Bahaya",
    "update_terakhir": "2 menit lalu"
  },
  {
    "lokasi": "Kali Pesanggrahan",
    "tinggi_air": "62 cm",
    "curah_hujan": "8.3 mm/jam",
    "status": "Aman",
    "update_terakhir": "10 menit lalu"
  }
]


function Dashboard() {
  return (
    <>

      <div className="grid grid-cols-4 gap-3 mb-3">
        <AceUICardStatus
          title="Tinggi Air Rata-rata"
          value="10"
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
      <div>
        <AceUICardWithTitle title="hello">
          <h1>hello</h1>
        </AceUICardWithTitle>

        <AceUICardTable thead={[
          { title: "Lokasi" },
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status" },
          { title: "Update Terakhir" },
        ]} tbody={tbody} />
      </div>
    </>
  );
}

export default Dashboard;
