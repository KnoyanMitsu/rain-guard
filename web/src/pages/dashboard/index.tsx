import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import Dashboard from "@/views/dashboard/Dashboard";
import { collection, limit, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function Index() {
  const { data: session }: any = useSession();
  const [dataDashboard, setDataDashboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fungsi Logout
  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
  };

  // 2. Helper untuk menentukan status (Sama dengan History)
  const getStatus = (tinggi: number): string => {
    if (tinggi >= 300) return "Bahaya";
    if (tinggi >= 100) return "Siaga";
    return "Aman";
  };

  // 3. Effect untuk Fetch Realtime Data (Sinkron dengan Logika History)
  useEffect(() => {
    console.log("🔄 Inisialisasi listener Dashboard...");

    // Listen ke Devices untuk mendapatkan mapping lokasi
    const unsubDevices = onSnapshot(collection(db, "devices"), (deviceSnapshot) => {
      const map: Record<string, any> = {};
      deviceSnapshot.forEach((doc) => {
        map[doc.id] = doc.data();
      });

      // Listen ke History dengan limit 10 (untuk Dashboard)
      const q = query(
        collection(db, "history"),
        orderBy("last_seen", "desc"),
        limit(10)
      );

      const unsubHistory = onSnapshot(q, (historySnapshot) => {
        const result = historySnapshot.docs.map((doc) => {
          const item = doc.data();
          const deviceData = map[item.device_id] || {};
          
          // Format waktu (disamakan dengan format tabel: jam:menit)
          let timeString = "Baru saja";
          if (item.last_seen instanceof Timestamp) {
            const date = item.last_seen.toDate();
            timeString = date.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });
          }

          return {
            id: doc.id,
            lokasi: item.lokasi || deviceData.lokasi || "Lokasi tidak ditemukan",
            tinggi_air_raw: Number(item.tinggi_air || 0), // Simpan angka murni untuk grafik
            tinggi_air: `${item.tinggi_air || 0} cm`,
            curah_hujan: `${item.curah_hujan || 0} mm`,
            status: getStatus(Number(item.tinggi_air || 0)),
            update_terakhir: timeString,
          };
        });

        setDataDashboard(result);
        setLoading(false);
      });

      return () => unsubHistory();
    });

    return () => unsubDevices();
  }, []);

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
      header="Dashboard"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 animate-pulse">Memuat data terbaru...</p>
        </div>
      ) : (
        <Dashboard
          thead={[
            { title: "Lokasi" },
            { title: "Tinggi Air" },
            { title: "Curah Hujan" },
            { title: "Status" },
            { title: "Update Terakhir" },
          ]}
          tbody={dataDashboard.map(item => ({
            lokasi: item.lokasi,
            tinggi_air: item.tinggi_air,
            curah_hujan: item.curah_hujan,
            status: item.status,
            update_terakhir: item.update_terakhir
          }))}
          graph={[...dataDashboard].reverse().map((item) => ({
            time: item.update_terakhir,
            tinggiAir: item.tinggi_air_raw,
          }))}
        />
      )}
    </AceUITemplateWithSidebar>
  );
}

export default Index;