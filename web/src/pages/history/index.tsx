import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import History from "@/views/guest/history/history";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function HistoryPage() {
  const { data: session }: any = useSession();
  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [deviceMap, setDeviceMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const getStatus = (tinggi: number): string => {
    if (tinggi >= 300) return "Bahaya";
    if (tinggi >= 100) return "Siaga";
    return "Aman";
  };

  useEffect(() => {
  console.log("🔄 Inisialisasi listener Firebase...");

  // 1. Listen ke Devices secara real-time
  const unsubDevices = onSnapshot(collection(db, "devices"), (deviceSnapshot) => {
    const map: Record<string, any> = {};
    deviceSnapshot.forEach((doc) => {
      map[doc.id] = doc.data();
    });
    
    setDeviceMap(map);
    console.log("📍 Device Map diperbarui:", Object.keys(map).length, "perangkat");

    // 2. Listen ke History (Ditambah orderBy agar data terbaru di atas)
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
    const unsubHistory = onSnapshot(q, (historySnapshot) => {
      if (historySnapshot.empty) {
        console.warn("⚠️ Firestore mengembalikan koleksi history kosong.");
        setDataHistory([]);
        setLoading(false);
        return;
      }

      const result = historySnapshot.docs.map((doc) => {
        const item = doc.data();
        const deviceData = map[item.device_id] || {};
        
        // Mengubah format angka milidetik (timestamp) dari Firebase jadi format tanggal Indo
        const lastSeen = item.timestamp 
          ? new Date(item.timestamp) 
          : new Date();

        return {
          id: doc.id,
          lokasi: item.lokasi || deviceData.lokasi || "Sensor Pusat",
          // Sesuaikan variabel dengan database (distance & rain)
          tinggi_air: `${item.distance || 0} cm`,
          curah_hujan: `${item.rain || 0} mm`,
          // Logika status: Kalau dari alat ngirim "Ya" berarti Bahaya, sisanya hitung dari getStatus
          status: item.status_rain === "Ya" ? "Bahaya" : getStatus(Number(item.distance || 0)),
          update_terakhir: lastSeen.toLocaleString("id-ID"),
        };
      });

      console.log("📊 Data Riwayat berhasil di-mapping:", result.length, "item");
      setDataHistory(result);
      setLoading(false);
    });

    return () => unsubHistory();
  });

  return () => unsubDevices();
}, []);

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={[
        { title: "Dasbor", link: "/dashboard/" },
        { title: "Riwayat", link: "/history" },
      ]}
      account={true}
      accountName={session?.user?.fullname || "Admin"}
      accountImage={`https://ui-avatars.com/api/?name=${session?.user?.fullname || "Admin"}`}
      accountRole="Admin"
      header="Riwayat"
    >
      <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Riwayat dalam 30 hari</h2>
          <button className="px-4 py-2 bg-white border border-cyan-700 text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors">
            Unduh CSV
          </button>
        </div>
      <History
        tbody={dataHistory}
        thead={[
          { title: "Lokasi" },
          { title: "Tinggi Air (cm)" },
          { title: "Curah Hujan" },
          { title: "Status Alarm" },
          { title: "Update Terakhir" },
        ]}
      />
      </div>
    </AceUITemplateWithSidebar>
  );
}

export default HistoryPage;