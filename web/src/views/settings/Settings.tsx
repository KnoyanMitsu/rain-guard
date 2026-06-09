import AceUIInput from "@/component/input/AceUIInput";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import db from "@/utils/db/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Database, Loader2, MapPin, Save, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function Settings() {
  const [websocketIp, setWebsocketIp] = useState("");
  const [hadoopIp, setHadoopIp] = useState("");
  const [lokasi, setLokasi] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string; type: "success" | "error" }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const docSnap = await getDoc(doc(db, "settings", "config"));

        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.websocket_ip) setWebsocketIp(data.websocket_ip);
          if (data.hadoop_ip) setHadoopIp(data.hadoop_ip);
          if (data.lokasi) setLokasi(data.lokasi);
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, []);

  const sendLocationToEsp = () => {
    return new Promise<void>((resolve, reject) => {
      let baseUrl = websocketIp.trim();

      if (!baseUrl) {
        reject(new Error("WebSocket URL kosong"));
        return;
      }

      baseUrl = baseUrl.replace(/\/$/, "");

      const socketUrl = `${baseUrl}/ws/iot`;

      console.log("Connecting WebSocket to:", socketUrl);

      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        const payload = {
          type: "set_location",
          location: lokasi,
        };

        console.log("Sending location to ESP:", payload);

        ws.send(JSON.stringify(payload));

        setTimeout(() => {
          ws.close();
          resolve();
        }, 500);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      await setDoc(
        doc(db, "settings", "config"),
        {
          websocket_ip: websocketIp,
          hadoop_ip: hadoopIp,
          lokasi: lokasi,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      await sendLocationToEsp();

      setToast({
        show: true,
        title: "Sukses",
        message: "Konfigurasi berhasil disimpan dan dikirim ke ESP!",
        type: "success",
      });

      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    } catch (error) {
      console.error("Gagal menyimpan/mengirim pengaturan:", error);

      setToast({
        show: true,
        title: "Gagal",
        message: "Konfigurasi tersimpan ke Firebase, tapi gagal dikirim ke ESP.",
        type: "error",
      });

      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <AceUIFloatingWarning show={toast.show} title={toast.title} message={toast.message} type={toast.type} />

      <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-xl p-8 shadow-sm">
        <div className="mb-8 border-b border-secondary/30 pb-6">
          <h2 className="text-2xl font-bold text-text mb-2">Konfigurasi Sistem</h2>
          <p className="text-text/70 text-sm">
            Sesuaikan IP WebSocket, koneksi Hadoop, dan nama Lokasi pemantau secara dinamis.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 pt-2 text-primary">
              <Wifi size={24} />
            </div>
            <div className="flex-grow">
              <AceUIInput
                label="WebSocket URL / IP"
                placeholder="ws://4.145.113.15:1880"
                type="text"
                value={websocketIp}
                onChange={(e) => setWebsocketIp(e.target.value)}
              />
              <p className="text-xs text-text/50 mt-2">Gunakan ws://4.145.113.15:1880</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 pt-2 text-primary">
              <Database size={24} />
            </div>
            <div className="flex-grow">
              <AceUIInput
                label="Hadoop Host / IP"
                placeholder="localhost"
                type="text"
                value={hadoopIp}
                onChange={(e) => setHadoopIp(e.target.value)}
              />
              <p className="text-xs text-text/50 mt-2">Alamat IP WebHDFS NameNode (Default: localhost)</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 pt-2 text-primary">
              <MapPin size={24} />
            </div>
            <div className="flex-grow">
              <AceUIInput
                label="Lokasi Pemantauan"
                placeholder="Malang"
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
              />
              <p className="text-xs text-text/50 mt-2">Akan dikirim ke ESP dan ditampilkan pada Dashboard utama</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-primary text-background hover:bg-primary/90 px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} />
                Simpan Konfigurasi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}