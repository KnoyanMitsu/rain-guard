import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/dashboard/Dashboard";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import db from "@/utils/db/firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";

function getStatus(tinggiAir: number) {
  if (tinggiAir <= 100) return "Aman";
  if (tinggiAir <= 200) return "Siaga";
  return "Bahaya";
}

function index() {
  const { data: session }: any = useSession();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "history"),
      orderBy("timestamp", "desc"),
      limit(5) 
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("✅ Jumlah data dari Firebase:", snapshot.docs.length); 
      
      const data = snapshot.docs.map((doc) => {
        const item = doc.data();
        
        const lastSeen = item.timestamp ? new Date(item.timestamp) : new Date();

        return {
          id: doc.id,
          tinggi_air: `${item.distance || 0} cm`,
          curah_hujan: `${item.rain || 0} mm`,    
          // Jika status_rain "Ya" anggap Bahaya, jika tidak anggap Aman (Bisa disesuaikan)
          status: item.status_rain === "Ya" ? "Bahaya" : "Aman", 
          update_terakhir: lastSeen.toLocaleString("id-ID"),
        };
      });
      
      setRealtimeData(data);
    }, (error) => {
      console.error("❌ Gagal mengambil data Firebase:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

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
      header="Dasbor"
    >
      <Dashboard
        tbody={realtimeData}
        thead={[
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status Alarm" },
          { title: "Update Terakhir" },
        ]}
        graph={realtimeData.map((item) => ({
          // Mengambil jam saja untuk grafik agar sumbu X tidak terlalu penuh
          time: item.update_terakhir.split(",")[1] || item.update_terakhir, 
          // Parse string "15 cm" kembali jadi angka murni 15 untuk grafik
          tinggiAir: parseFloat(item.tinggi_air), 
        })).reverse()} 
      />
    </AceUITemplateWithSidebar>
  );
}

export default index;