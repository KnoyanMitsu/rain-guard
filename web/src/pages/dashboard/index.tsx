import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import Dashboard from "@/views/dashboard/Dashboard";
import { collection, doc, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function getStatus(tinggiAir: number) {
  if (tinggiAir <= 100) return "Aman";
  if (tinggiAir <= 200) return "Siaga";
  return "Bahaya";
}

function Index() {
  const { data: session }: any = useSession();
  const displayName =
    session?.user?.name || session?.user?.fullname || session?.user?.nama || "Admin";
  
  // State terpisah untuk Firebase (Tabel & Grafik) dan WebSocket (4 Kartu Status)
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [wsData, setWsData] = useState<any>(null);
  const [deviceList, setDeviceList] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  
  // 1. useEffect utama untuk Setting, Devices, dan Firebase Data
  useEffect(() => {
    let unsubHistory: (() => void) | undefined;
    let unsubDevices: (() => void) | undefined;

    const unsubSettings = onSnapshot(doc(db, "settings", "config"), (docSnap) => {
      const configData = docSnap.exists() ? docSnap.data() : {};
      setSettings(configData);
      const currentLokasi = configData.lokasi || "";

      if (unsubDevices) unsubDevices();
      unsubDevices = onSnapshot(collection(db, "devices"), (snapshot) => {
        const devs = snapshot.docs.map((doc) => ({
          device_id: doc.data().device_id || doc.id,
          lokasi: doc.data().lokasi || "Lokasi Tidak Diketahui",
        }));
        setDeviceList(devs);

        if (unsubHistory) unsubHistory();
        const qHistory = query(
          collection(db, "history"),
          orderBy("timestamp", "desc"),
          limit(360)
        );
        unsubHistory = onSnapshot(qHistory, (historySnapshot) => {
          const data = historySnapshot.docs
            .filter((doc) => {
              const item = doc.data();
              return item.lokasi === currentLokasi;
            })
            .map((doc) => {
              const item = doc.data();
              const lastSeen = item.timestamp ? new Date(item.timestamp) : new Date();

              return {
                id: doc.id,
                lokasi: item.lokasi || "-",
                tinggi_air: `${Number(item.distance || 0).toFixed(2)} cm`,
                curah_hujan: `${Number(item.rain || 0).toFixed(2)} mm`,
                distance: parseFloat(Number(item.distance || 0).toFixed(2)),
                rain: parseFloat(Number(item.rain || 0).toFixed(2)),
                status: item.status_rain === "Ya" ? "Bahaya" : "Aman",
                update_terakhir: lastSeen.toLocaleString("id-ID"),
              };
            });
          setFirebaseData(data);
        }, (error) => {
          const errStr = String(error).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
          console.error("❌ Gagal mengambil data Firebase:", errStr);
        });
      });
    });

    return () => {
      unsubSettings();
      if (unsubDevices) unsubDevices();
      if (unsubHistory) unsubHistory();
    };
  }, []);

  // 3. useEffect untuk WEBSOCKET (Data Real-time khusus Status Card)
  useEffect(() => {
    const wsIp = settings?.websocket_ip || process.env.NEXT_PUBLIC_WEBSOCKET_URL || "";
    if (!wsIp || !wsIp.trim()) return; // Tunggu sampai konfigurasi IP tersedia

    let formattedWsUrl = wsIp.trim();
    if (!formattedWsUrl.startsWith("ws://") && !formattedWsUrl.startsWith("wss://")) {
      formattedWsUrl = `wss://${formattedWsUrl}`;
    }
    const wsUrl = formattedWsUrl.endsWith("/") ? `${formattedWsUrl}ws/getIot` : `${formattedWsUrl}/ws/getIot`;
    
    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
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
          const errStr = String(err).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
          console.error("❌ Gagal baca JSON WebSocket:", errStr);
        }
      };

      socket.onerror = (error) => {
        const errStr = String(error).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
        console.error("⚠️ WebSocket Error:", errStr);
      };

      socket.onclose = () => {
        setTimeout(connect, 5000);
      };
    }

    connect();

    return () => {
      if (socket) socket.close();
    };
  }, [settings?.websocket_ip]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={[
        { title: "Dashboard", link: "/dashboard" },
        { title: "Riwayat", link: "/history" },
        { title: "Analisis Data", link: "/analisis" },
        { title: "Hadoop Backup", link: "/hadoop" },
        { title: "Pengaturan", link: "/settings" },
      ]}
      account={true}
      accountName={displayName}
      accountImage={`https://ui-avatars.com/api/?name=${displayName}`}
      accountRole="Admin"
      header="Dashboard"
    >
      <Dashboard
        // Lempar data lokasi dinamis dari settings
        lokasi={settings?.lokasi}
        // Lempar data WebSocket khusus ke props latestWsData
        latestWsData={wsData} 
        // Lempar daftar perangkat ke header untuk dropdown
        devices={deviceList}
        // Lempar data Firebase ke tabel dan grafik
        tbody={firebaseData}
        thead={[
          { title: "Lokasi" },
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status Alarm" },
          { title: "Update Terakhir" },
        ]}
        graph={firebaseData
        .filter((item) => item.distance >= 0) // hanya data >= 0
        .map((item) => ({
          time: item.update_terakhir.split(",")[1]?.trim() || item.update_terakhir,
          tinggiAir: parseFloat(
            (typeof item.distance === "number" ? item.distance : parseFloat(item.tinggi_air)).toFixed(2)
          ),
        }))
        .reverse()}
      />
    </AceUITemplateWithSidebar>
  );
}

export default Index;