import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUICardWithTitle from "@/component/card/AceUICardWithTitle";
import AceUITemplateBlankWithContainerCenter from "@/component/template/AceUITemplateBlankWithContainerCenter";
import { Bell, Cloud, CloudRain, Droplets } from "lucide-react";
function Dashboard() {
  return (
    <>
      <AceUITemplateBlankWithContainerCenter>
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
          />
        </div>
        <div>
          <AceUICardStatus title="Kondisi Darurat" value="Aman" color="green" icon={<CloudRain />} />
        </div>
      </AceUITemplateBlankWithContainerCenter>
    </>
  );
}

export default Dashboard;
