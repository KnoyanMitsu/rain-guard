import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardWithTitle from "@/component/card/AceUICardWithTitle";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";
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
      </div>
    </>
  );
}

export default Dashboard;
