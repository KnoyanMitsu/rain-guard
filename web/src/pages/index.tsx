import Dashboard from "@/views/guest/dashboard/Dashboard";
import { useEffect, useState } from "react";

import db from "@/utils/db/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";

function index() {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);

  // WEBSOCKET DATA
  const [wsData, setWsData] = useState({
    distance: 0,
    rain: 0,
    status_rain: "-",
    buzzer: "-",
  });

  // WEBSOCKET
  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://4.145.113.15:1880";
    const wsUrl = baseUrl.endsWith("/")
      ? `${baseUrl}ws/getIot`
      : `${baseUrl}/ws/getIot`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      setWsData({
        distance: data.distance || 0,
        rain: data.rain || 0,
        status_rain: data.status_rain || "-",
        buzzer: data.buzzer || "-",
      });
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket Error:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket Closed");
    };

    return () => ws.close();
  }, []);

  // FIREBASE
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

          const lastSeen = item.timestamp
            ? new Date(item.timestamp)
            : new Date();

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

            update_terakhir: lastSeen.toLocaleString("id-ID"),

            // GRAPH
            time: lastSeen.toLocaleTimeString("id-ID"),

            tinggiAir: parseFloat(item.distance || 0),
          };
        });

        setRealtimeData(data);
      },
      (error) => {
        console.error("❌ Firebase Error:", error);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <Dashboard
      websocketData={wsData} // Kirim data WS
      thead={[
        // Tambahkan thead
        { title: "Tinggi Air" },
        { title: "Curah Hujan" },
        { title: "Status Alarm" },
        { title: "Update Terakhir" },
      ]}
      tbody={realtimeData} // Tambahkan tbody dari Firebase
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
