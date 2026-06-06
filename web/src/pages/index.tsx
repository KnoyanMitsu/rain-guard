import db from "@/utils/db/firebase";
import Dashboard from "@/views/guest/dashboard/Dashboard";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

function index() {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  // WEBSOCKET DATA
  const [wsData, setWsData] = useState({
    distance: 0,
    rain: 0,
    status_rain: "-",
    buzzer: "-",
  });

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
          const distanceValue = Number(item.distance || 0);
          const lastSeen = item.timestamp ? new Date(item.timestamp) : new Date();
          return {
            id: doc.id,
            tinggi_air: `${item.distance || 0} cm`,
            curah_hujan: `${item.rain || 0} mm`,

            status:
              distanceValue > 10
                ? "Bahaya"
                : distanceValue >= 5
                  ? "Waspada"
                  : "Aman",

            update_terakhir:
              lastSeen.toLocaleString("id-ID"),

            // GRAPH
            time:
              lastSeen.toLocaleTimeString("id-ID"),

            tinggiAir:
              parseFloat(item.distance || 0),
          };
        });
        setRealtimeData(data);
      },
      (error) => {
        console.error(
          "❌ Firebase Error:",
          error
        );
      }
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
    <Dashboard
      latestWsData={wsData} // Kirim data WS
      thead={[               // Tambahkan thead
        { title: "Tinggi Air" },
        { title: "Curah Hujan" },
        { title: "Status Alarm" },
        { title: "Update Terakhir" },
      ]}
      tbody={realtimeData}   // Tambahkan tbody dari Firebase
      graph={realtimeData
        .map((item) => ({
          time: item.time,
          tinggiAir: item.tinggiAir,
        }))
        .reverse()}
    />
  );
}

export default index;