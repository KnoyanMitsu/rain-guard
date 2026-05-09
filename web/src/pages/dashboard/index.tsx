import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/dashboard/Dashboard";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function index() {
  const { data: session }: any = useSession();
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  useEffect(() => {
    // Pastikan variabel environment menggunakan prefix NEXT_PUBLIC_
    // Gabungkan base URL dengan path /ws/getIot sesuai instruksi Anda
    const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://4.145.113.15:1880";
    const wsUrl = baseUrl.endsWith("/") ? `${baseUrl}ws/getIot` : `${baseUrl}/ws/getIot`;
    
    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("✅ WebSocket Connected to: " + wsUrl);
      };

      socket.onmessage = (event) => {
  // Jika ada data masuk, log ini PASTI muncul di Console
  console.log("📩 Pesan Mentah:", event.data); 

  try {
    const data = JSON.parse(event.data);
    const enrichedData = {
      distance: data.distance ?? 0,
      rain: data.rain ?? 0,
      status_rain: data.status_rain ?? "-",
      buzzer: data.buzzer ?? "Non Aktif",
      update_terakhir: new Date().toLocaleTimeString(),
    };
    setRealtimeData((prev) => [enrichedData, ...prev].slice(0, 20));
  } catch (err) {
    console.error("❌ Gagal baca JSON:", err);
  }
};

      socket.onerror = (error) => {
        console.error("⚠️ WebSocket Error:", error);
      };

      socket.onclose = () => {
        console.log("🔌 WebSocket Disconnected. Reconnecting in 5s...");
        setTimeout(connect, 5000); // Mencoba hubungkan kembali
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
      appname="Rain Guard"
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
          { title: "Tinggi Air (cm)" },
          { title: "Nilai Sensor Hujan" },
          { title: "Status Hujan" },
          { title: "Status Alarm" },
          { title: "Waktu" },
        ]}
        graph={realtimeData.map((item) => ({
          time: item.update_terakhir,
          tinggiAir: Number(item.distance),
        })).reverse()} 
      />
    </AceUITemplateWithSidebar>
  );
}

export default index;