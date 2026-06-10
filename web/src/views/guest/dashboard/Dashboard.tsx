import { useState } from "react";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import { DashboardCards, DashboardGraph, DashboardTable, getFilteredGraphData, type Tbody, type Thead, type GraphData } from "@/views/dashboard/Dashboard";

type DashboardProps = {
  thead: Thead[];
  tbody: Tbody[];
  graph: GraphData[];
  latestWsData?: Tbody | null;
};

function GuestDashboard({ thead, tbody, graph, latestWsData }: DashboardProps) {
  const [graphDuration, setGraphDuration] = useState(60);
  const latestData = latestWsData || tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(graph, graphDuration);

  return (
    <div className="flex flex-col gap-6 mx-auto py-15 px-4 sm:px-6">
      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan: STATUS BAHAYA!"
        message="Status alarm sedang aktif. Banner ini akan tetap tampil sampai alarm kembali non-aktif."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <DashboardCards latestData={latestData} isBuzzerActive={isBuzzerActive} />

          <DashboardGraph
            graphDuration={graphDuration}
            setGraphDuration={setGraphDuration}
            filteredGraphData={filteredGraphData}
          />
        </div>

        <div className="flex flex-col h-full">
          <DashboardTable thead={thead} tbody={tbody} />
        </div>
      </div>
    </div>
  );
}

export default GuestDashboard;
