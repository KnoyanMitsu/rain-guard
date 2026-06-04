import db from "@/utils/db/firebase";
import GuestDashboard from "@/views/guest/dashboard/Dashboard";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

function GuestPage() {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [wsData, setWsData] = useState<any>(null);

  // 1. Firebase History
  useEffect(() => {
    const q = query(
      collection(db, "history"),
      orderBy("timestamp", "desc"),
      limit(360),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => {
          const item = doc.data();
          const lastSeen = item.timestamp ? new Date(item.timestamp) : new Date();
          return {
            id: doc.id,
            tinggi_air: `${item.distance || 0} cm`,
            curah_hujan: `${item.rain || 0} mm`,
            distance: item.distance || 0,
            rain: item.rain || 0,
            status: item.status_rain === "Ya" ? "Bahaya" : "Aman",
            update_terakhir: lastSeen.toLocaleString("id-ID"),
          };
        });
        setFirebaseData(data);
      },
      (error) => {
        console.error("Firebase Error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  // 2. WebSocket — same config as admin
  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://4.145.113.15:1880";
    const wsUrl = baseUrl.endsWith("/") ? `${baseUrl}ws/getIot` : `${baseUrl}/ws/getIot`;

    let socket: WebSocket;

    function connect() {
      socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket Connected: " + wsUrl);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setWsData({
            distance: data.distance ?? 0,
            rain: data.rain ?? 0,
            status_rain: data.status_rain ?? "-",
            buzzer: data.buzzer ?? "Non Aktif",
          });
        } catch (err) {
          console.error("WebSocket parse error:", err);
        }
      };

      socket.onerror = () => {};

      socket.onclose = () => {
        setTimeout(connect, 5000);
      };
    }

    connect();
    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary/10">
      <div className="md:p-10 p-5">
        <h1 className="text-3xl font-bold text-text mb-6">RainGuard</h1>
        <GuestDashboard
          latestWsData={wsData}
          tbody={firebaseData}
          thead={[
            { title: "Tinggi Air" },
            { title: "Curah Hujan" },
            { title: "Status Alarm" },
            { title: "Update Terakhir" },
          ]}
          graph={firebaseData
            .filter((item) => item.distance >= 0)
            .map((item) => ({
              time: item.update_terakhir.split(",")[1]?.trim() || item.update_terakhir,
              tinggiAir:
                typeof item.distance === "number"
                  ? item.distance
                  : parseFloat(item.tinggi_air),
            }))
            .reverse()}
        />
      </div>
    </div>
  );
}

export default GuestPage;
