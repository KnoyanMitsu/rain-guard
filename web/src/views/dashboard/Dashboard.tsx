import AceUICardGraphs from "@/component/card/AceUICardGraphs";
import AceUICardStatus from "@/component/card/AceUICardStatus";
import AceUILocationHeader, { DeviceData } from "@/component/card/AceUILocationHeader";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import AceUIDropdown from "@/component/input/AceUIDropdown";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { Bell, CheckCircle, Cloud, CloudRain, Database, DatabaseBackup, Droplets, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

type BackupStatus = "idle" | "loading" | "success" | "error";

type BackupInfo = {
  fileName?: string;
  hdfsPath?: string;
  recordCount?: number;
  error?: string;
};

export type Tbody = {
  lokasi?: string;
  distance?: number | string;
  rain?: number | string;
  status_rain?: string;
  buzzer?: string;
  status?: string;
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
  devices: DeviceData[];
  latestWsData?: Tbody;
  lokasi?: string;
};

const panelClass = "rounded-2xl border border-secondary bg-background backdrop-blur-sm";

function formatDistance(value: number | string | undefined) {
  const numericValue = Number(String(value ?? 0).replace(" cm", ""));
  if (Number.isNaN(numericValue)) return "0";
  return numericValue.toFixed(2);
}

export function getFilteredGraphData(graphData: GraphData[], durationMinutes: number) {
  const maxPoints = Math.ceil((durationMinutes * 60) / 10);
  if (graphData.length <= maxPoints) return graphData;
  return graphData.slice(-maxPoints);
}

function getWaterStatus(distance: number) {
  if (distance > 10) return "Bahaya";
  if (distance >= 5) return "Waspada";
  return "Aman";
}

// ── SHARED COMPONENTS ──

export function DashboardCards({
  latestData,
  isBuzzerActive,
}: {
  latestData: Tbody;
  isBuzzerActive: boolean;
}) {
  const MAX_DISTANCE = 10;
  const MAX_RAIN = 4095;
  const rawDistance = parseFloat(String(latestData.distance ?? 0)) || 0;
  const rawRain = parseInt(String(latestData.rain ?? 0)) || 0;
  const safeDistance = Math.max(0, rawDistance);
  const safeRain = Math.max(0, rawRain);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AceUICardStatus
        className="bg-background border border-secondary shadow-sm"
        title="Tinggi Air"
        value={safeDistance.toString()}
        description={`Batas: ${MAX_DISTANCE} cm`}
        icon={<Droplets />}
        color="primary"
        unit="cm"
      />
      <AceUICardStatus
        className="bg-background border border-secondary shadow-sm"
        title="Nilai Sensor Hujan"
        value={safeRain.toString()}
        description={`Batas: ${MAX_RAIN} raw`}
        icon={<Cloud />}
        color="yellow"
        unit="raw"
      />
      <AceUICardStatus
        className="bg-background border border-secondary shadow-sm"
        title="Status Hujan"
        value={latestData.status_rain || "-"}
        icon={<CloudRain />}
        color={latestData.status_rain === "Ya" ? "red" : "green"}
      />
      <AceUICardStatus
        className="bg-background border border-secondary shadow-sm"
        title="Status Alarm"
        value={latestData.buzzer || "-"}
        icon={<Bell />}
        color={isBuzzerActive ? "red" : "green"}
      />
    </div>
  );
}

export function DashboardGraph({
  graphDuration,
  setGraphDuration,
  filteredGraphData,
}: {
  graphDuration: number;
  setGraphDuration: (val: number) => void;
  filteredGraphData: GraphData[];
}) {
  const options = [
    { title: "10 menit terakhir", value: 10 },
    { title: "30 menit terakhir", value: 30 },
    { title: "1 jam terakhir", value: 60 },
    { title: "4 jam terakhir", value: 240 },
    { title: "24 jam terakhir", value: 1440 },
  ];

  return (
    <div className="w-full bg-background border border-secondary shadow-sm rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-text">Grafik Monitoring Tinggi Air (Real-time)</h3>
        <div className="relative">
          <AceUIDropdown
            title={options.find((d) => d.value === graphDuration)?.title ?? "Pilih durasi"}
            actions={options.map((opt) => ({
              title: opt.title,
              onClick: () => setGraphDuration(opt.value),
            }))}
          />
        </div>
      </div>
      <AceUICardGraphs
        className="bg-background border border-secondary shadow-sm"
        data={filteredGraphData}
        start={0}
        end={10}
        dataKey="tinggiAir"
        titlelegend="Tinggi Air (cm)"
        title=""
      />
    </div>
  );
}

export function DashboardTable({
  thead,
  tbody,
}: {
  thead: Thead[];
  tbody: Tbody[];
}) {
  return (
    <div className={`${panelClass} p-6`}>
      <h2 className="text-xl font-bold text-text mb-4">Riwayat Pengamatan</h2>
      <div className="overflow-x-auto rounded-2xl border border-secondary bg-background">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-secondary/20 text-text">
            <tr>
              {thead.map((h, i) => (
                <th key={i} className="text-left px-5 py-4 font-semibold uppercase tracking-wider text-xs">
                  {h.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tbody.slice(0, 10).map((row, i) => {
              const distanceValue = Number(String(row.distance ?? row.tinggi_air ?? 0).replace(" cm", ""));
              const statusValue = getWaterStatus(distanceValue);
              return (
                <tr key={i} className="border-b border-secondary/15 last:border-0 hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-4 font-semibold text-text">{formatDistance(row.distance ?? row.tinggi_air)} cm</td>
                  <td className="px-5 py-4 font-semibold text-text">{row.curah_hujan || row.rain}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={statusValue} />
                  </td>
                  <td className="px-5 py-4 font-semibold text-text">{row.update_terakhir}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── STATUS BADGE ──

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Aman: "bg-emerald-100 text-emerald-900 border-emerald-400",
    Waspada: "bg-amber-100 text-amber-900 border-amber-400",
    Bahaya: "bg-rose-100 text-rose-900 border-rose-400",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold tracking-wide shadow-sm ${styles[status] ?? "bg-secondary/10 text-text border-secondary"}`}>
      {status}
    </span>
  );
}

// ── MAIN DASHBOARD ──

function Dashboard(data: Data) {
  const [currentPage, setCurrentPage] = useState(1);
  const [graphDuration, setGraphDuration] = useSessionStorage<number>("graphDuration", 60);
  const [backupStatus, setBackupStatus] = useState<BackupStatus>("idle");
  const [backupInfo, setBackupInfo] = useState<BackupInfo>({});
  const [selectedDeviceId, setSelectedDeviceId] = useSessionStorage<string>(
    "selectedDevice",
    data.devices?.length > 0 ? data.devices[0].device_id : "default"
  );

  useEffect(() => {
    if (backupStatus === "success" || backupStatus === "error") {
      const timer = setTimeout(() => setBackupStatus("idle"), 6000);
      return () => clearTimeout(timer);
    }
  }, [backupStatus]);

  async function handleBackup() {
    setBackupStatus("loading");
    setBackupInfo({});
    try {
      const res = await fetch("/api/backup-hadoop", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setBackupStatus("success");
        setBackupInfo({
          fileName: json.fileName,
          hdfsPath: json.hdfsPath,
          recordCount: json.recordCount,
        });
      } else {
        setBackupStatus("error");
        setBackupInfo({ error: json.message });
      }
    } catch (err: any) {
      setBackupStatus("error");
      setBackupInfo({ error: err.message || "Gagal menghubungi server" });
    }
  }

  const latestData: Tbody = data.latestWsData || data.tbody[0] || {};
  const isBuzzerActive = latestData.buzzer?.trim().toLowerCase() === "aktif";
  const filteredGraphData = getFilteredGraphData(data.graph, graphDuration);

  return (
    <div className="flex flex-col gap-6">
      <AceUILocationHeader
        devices={data.devices}
        selectedDevice={selectedDeviceId}
        onDeviceChange={(newId) => setSelectedDeviceId(newId)}
        city={data.lokasi || "Malang"}
      />

      {backupStatus !== "idle" && (
        <div
          className={`fixed top-4 right-4 z-50 w-80 rounded-2xl border px-4 py-4 shadow-xl transition-all
            ${backupStatus === "loading" ? "border-blue-200 bg-blue-50 text-blue-900" : ""}
            ${backupStatus === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-900" : ""}
            ${backupStatus === "error" ? "border-rose-200 bg-rose-50 text-rose-900" : ""}`}
        >
          <div className="flex items-start gap-3">
            {backupStatus === "loading" && <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-blue-600" />}
            {backupStatus === "success" && <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />}
            {backupStatus === "error" && <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />}
            <div className="min-w-0 flex-1">
              {backupStatus === "loading" && <p className="text-sm font-semibold">Sedang melakukan backup...</p>}
              {backupStatus === "success" && (
                <>
                  <p className="text-sm font-semibold">Backup berhasil!</p>
                  <p className="mt-1 break-all text-xs text-emerald-700">File: {backupInfo.fileName}</p>
                  <p className="break-all text-xs text-emerald-600">HDFS: {backupInfo.hdfsPath}</p>
                  <p className="text-xs text-emerald-600">{backupInfo.recordCount} record tersimpan</p>
                </>
              )}
              {backupStatus === "error" && (
                <>
                  <p className="text-sm font-semibold">Backup gagal</p>
                  <p className="mt-1 text-xs text-rose-700">{backupInfo.error}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AceUIFloatingWarning
        show={isBuzzerActive}
        title="Peringatan: STATUS BAHAYA!"
        message="Status alarm sedang aktif. (Banner ini akan tetap tampil sampai alarm kembali non-aktif)"
      />

      <DashboardCards latestData={latestData} isBuzzerActive={isBuzzerActive} />

      <DashboardGraph
        graphDuration={graphDuration}
        setGraphDuration={setGraphDuration}
        filteredGraphData={filteredGraphData}
      />

      <div className={`${panelClass} flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Backup ke Hadoop HDFS</h3>
          </div>
        </div>
        <button
          onClick={handleBackup}
          disabled={backupStatus === "loading"}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-background shadow-sm transition-all hover:bg-primary/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {backupStatus === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sedang backup...
            </>
          ) : (
            <>
              <DatabaseBackup className="h-4 w-4" />
              Backup ke Hadoop
            </>
          )}
        </button>
      </div>

      <DashboardTable thead={data.thead} tbody={data.tbody} />
    </div>
  );
}

export default Dashboard;
