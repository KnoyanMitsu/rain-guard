import React from "react";
import AceUICard from "@/component/AceUICard";
import AceUICardStatus from "@/component/AceUICardStatus";
import { Droplets, CloudRain, Cloud, Bell } from "lucide-react";
function Dashboard() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Last updated: 2 minutes ago</p>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-3">
          <AceUICardStatus
            title="Tinggi Air Rata-rata"
            value="10"
            icon={<Droplets />}
            color="green"
            unit="mm"
          />
          <AceUICardStatus
            title="Curah Hujan"
            color="yellow"
            icon={<Cloud />}
            value="Ya"
          />
          <AceUICardStatus
            title="Status Hujan"
            color="yellow"
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
          <AceUICard>
            <h1>hello</h1>
          </AceUICard>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
