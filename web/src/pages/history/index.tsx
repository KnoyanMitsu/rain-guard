import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import History from "@/views/guest/history/history";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
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

    // 2. Listen ke History HANYA SETELAH deviceMap terisi (atau berjalan bersamaan)
    const q = query(collection(db, "history"));
    const unsubHistory = onSnapshot(q, (historySnapshot) => {
      if (historySnapshot.empty) {
        console.warn("⚠️ Firestore mengembalikan koleksi history kosong.");
        setDataHistory([]);
        setLoading(false);
        return;
      }

      const result = historySnapshot.docs.map((doc) => {
        const item = doc.data();
        // Mengambil data device dari map yang baru saja diupdate
        const deviceData = map[item.device_id] || {};
        
        const lastSeen = item.last_seen instanceof Timestamp 
          ? item.last_seen.toDate() 
          : new Date();

        return {
          id: doc.id,
          lokasi: item.lokasi || deviceData.lokasi || "Lokasi tidak ditemukan",
          tinggi_air: `${item.tinggi_air || 0} cm`,
          curah_hujan: `${item.curah_hujan || 0} mm`,
          status: getStatus(Number(item.tinggi_air || 0)),
          update_terakhir: lastSeen.toLocaleString("id-ID"),
        };
      });

      console.log("📊 Data History berhasil di-mapping:", result.length, "item");
      setDataHistory(result);
      setLoading(false);
    });

    return () => unsubHistory();
  });

  return () => unsubDevices();
}, []); // Kosongkan dependency agar listener tidak duplikat

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="Rain Guard"
      listMenu={[
        { title: "Dashboard", link: "/dashboard/" },
        { title: "History", link: "/history" },
      ]}
      account={true}
      accountName={session?.user?.fullname || "Admin"}
      accountImage={`https://ui-avatars.com/api/?name=${session?.user?.fullname || "Admin"}`}
      accountRole="Admin"
      header="History"
    >
      <History
        tbody={dataHistory}
        thead={[
          { title: "Lokasi" },
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status" },
          { title: "Update Terakhir" },
        ]}
      />
    </AceUITemplateWithSidebar>
  );
}

export default HistoryPage;