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

function Index() {
  const { data: session }: any = useSession();
  
  // State terpisah untuk Firebase (Tabel & Grafik) dan WebSocket (4 Kartu Status)
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [wsData, setWsData] = useState<any>(null);

  // 1. useEffect untuk FIREBASE (Data Riwayat)
  useEffect(() => {
    const q = query(
      collection(db, "history"),
      orderBy("timestamp", "desc"),
      limit(10) 
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
          // Menyimpan nilai original untuk grafik/kebutuhan lain
          distance: item.distance || 0,
          rain: item.rain || 0,
          status: item.status_rain === "Ya" ? "Bahaya" : "Aman", 
          update_terakhir: lastSeen.toLocaleString("id-ID"),
        };
      });
      
      setFirebaseData(data);
    }, (error) => {
      console.error("❌ Gagal mengambil data Firebase:", error);
    });

    return () => unsubscribe();
  }, []);

  // 2. useEffect untuk WEBSOCKET (Data Real-time khusus Status Card)
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://4.145.113.15:1880";
    const wsUrl = baseUrl.endsWith("/") ? `${baseUrl}ws/getIot` : `${baseUrl}/ws/getIot`;
    
    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("✅ WebSocket Connected to: " + wsUrl);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          // Set state wsData hanya dengan data terbaru
          setWsData({
            distance: data.distance ?? 0,
            rain: data.rain ?? 0,
            status_rain: data.status_rain ?? "-",
            buzzer: data.buzzer ?? "Non Aktif",
            update_terakhir: new Date().toLocaleTimeString("id-ID"),
          });
        } catch (err) {
          console.error("❌ Gagal baca JSON WebSocket:", err);
        }
      };

      socket.onerror = (error) => {
        console.error("⚠️ WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket Disconnected. Reconnecting in 5s...");
        setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (socket) socket.close();
    };
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
        // Lempar data WebSocket khusus ke props latestWsData
        latestWsData={wsData} 
        // Lempar data Firebase ke tabel dan grafik
        tbody={firebaseData}
        thead={[
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status Alarm" },
          { title: "Update Terakhir" },
        ]}
        graph={firebaseData.map((item) => ({
          time: item.update_terakhir.split(",")[1]?.trim() || item.update_terakhir, 
          // Menggunakan nilai distance murni yang sudah kita mapping di Firebase map atas
          tinggiAir: typeof item.distance === 'number' ? item.distance : parseFloat(item.tinggi_air), 
        })).reverse()} 
      />
    </AceUITemplateWithSidebar>
  );
}

export default Index;