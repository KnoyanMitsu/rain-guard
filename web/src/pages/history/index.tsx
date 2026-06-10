import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import History from "@/views/history/history";
import { collection, onSnapshot, orderBy, query, doc } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function HistoryPage() {
  const { data: session }: any = useSession();
  const displayName =
    session?.user?.name || session?.user?.fullname || session?.user?.nama || "Admin";
  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const getStatus = (distance: number): string => {
    if (distance > 10) return "Bahaya";
    if (distance >= 5) return "Waspada";
    return "Aman";
  };

  useEffect(() => {
    let unsubDevices: (() => void) | undefined;
    let unsubHistory: (() => void) | undefined;

    // Listen ke Settings untuk mendapatkan lokasi aktif
    const unsubSettings = onSnapshot(doc(db, "settings", "config"), (settingsSnapshot) => {
      const configData = settingsSnapshot.exists() ? settingsSnapshot.data() : {};
      const currentLokasi = configData.lokasi || "";

      // 1. Listen ke Devices secara real-time
      if (unsubDevices) unsubDevices();
      unsubDevices = onSnapshot(collection(db, "devices"), (deviceSnapshot) => {
        const map: Record<string, any> = {};
        deviceSnapshot.forEach((doc) => {
          map[doc.id] = doc.data();
        });

        // 2. Listen ke History (Ditambah orderBy agar data terbaru di atas)
        if (unsubHistory) unsubHistory();
        const q = query(collection(db, "history"), orderBy("timestamp", "desc"));
        unsubHistory = onSnapshot(q, (historySnapshot) => {
          if (historySnapshot.empty) {
            setDataHistory([]);
            setLoading(false);
            return;
          }

          // Filter data history berdasarkan lokasi dari settings
          const result = historySnapshot.docs
            .filter((doc) => {
              const item = doc.data();
              // Memastikan hanya menampilkan data riwayat yang memiliki lokasi yang sama dengan settings
              return item.lokasi === currentLokasi;
            })
            .map((doc) => {
              const item = doc.data();
              
              const lastSeen = item.timestamp 
                ? new Date(item.timestamp) 
                : new Date();

              return {
                id: doc.id,
                lokasi: item.lokasi || "-",
                tinggi_air: `${Number(item.distance || 0).toFixed(2)} cm`,
                curah_hujan: `${item.rain || 0} mm`,
                status: getStatus(Number(item.distance || 0)),
                update_terakhir: lastSeen.toISOString(), 
              };
            });

          setDataHistory(result);
          setLoading(false);
        });
      });
    });

    return () => {
      unsubSettings();
      if (unsubDevices) unsubDevices();
      if (unsubHistory) unsubHistory();
    };
  }, []);

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={[
        { title: "Dasbor", link: "/dashboard" },
        { title: "Riwayat", link: "/history" },
        { title: "Analisis Data", link: "/analisis" },
        { title: "Hadoop Backup", link: "/hadoop" },
        { title: "Pengaturan", link: "/settings" },
      ]}
      account={true}
      accountName={displayName}
      accountImage={`https://ui-avatars.com/api/?name=${displayName}`}
      accountRole="Admin"
      header="Riwayat"
    >
      <div>
        <div className="flex justify-between items-center mb-4">
        </div>
        
        {loading ? (
          <div className="text-center py-10 text-text text-sm">
            Memuat data sensor...
          </div>
        ) : (
          <History
            tbody={dataHistory}
            thead={[
              { title: "Lokasi" },
              { title: "Tinggi Air" },
              { title: "Curah Hujan" },
              { title: "Status Alarm" },
              { title: "Update Terakhir" },
            ]}
          />
        )}
      </div>
    </AceUITemplateWithSidebar>
  );
}

export default HistoryPage;