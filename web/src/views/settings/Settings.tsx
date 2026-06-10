import AceUIInput from "@/component/input/AceUIInput";
import AceUIFloatingWarning from "@/component/feedback/AceUIFloatingWarning";
import db from "@/utils/db/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Database, Loader2, MapPin, Save, Wifi, Server, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Settings() {
  const [websocketIp, setWebsocketIp] = useState("");
  const [hadoopIp, setHadoopIp] = useState("");
  const [datanodes, setDatanodes] = useState<string[]>([]);
  const [lokasi, setLokasi] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
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
          if (data.datanodes && Array.isArray(data.datanodes)) {
            const parsed = data.datanodes.map((dn: any) => typeof dn === 'string' ? dn : (dn.external || ""));
            setDatanodes(parsed.filter(Boolean));
          } else if (data.datanode_ip) {
            setDatanodes([data.datanode_ip]);
          }
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

      const ws = new WebSocket(socketUrl);

      ws.onopen = () => {
        const payload = {
          type: "set_location",
          location: lokasi,
        };

        ws.send(JSON.stringify(payload));

        setTimeout(() => {
          ws.close();
          resolve();
        }, 500);
      };

      ws.onerror = (error) => {
        const errStr = String(error).replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, "***.***.***.***");
        console.error("WebSocket error:", errStr);
        reject(error);
      };

      ws.onclose = () => {
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
          datanodes: datanodes,
          lokasi: lokasi,
          updated_at: new Date().toISOString(),
        },
        { merge: true },
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
        message:
          "Konfigurasi tersimpan ke Firebase, tapi gagal dikirim ke ESP.",
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
      <AceUIFloatingWarning
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />

      <div className="rounded-2xl border border-secondary bg-background/80 backdrop-blur-xl p-8 shadow-sm">
        <div className="mb-8 border-b border-secondary/30 pb-6">
          <h2 className="text-2xl font-bold text-text mb-2">
            Konfigurasi Sistem
          </h2>
          <p className="text-text/70 text-sm">
            Sesuaikan IP WebSocket, koneksi Hadoop, dan nama Lokasi pemantau
            secara dinamis.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-6">
            <div className="flex-shrink-0 pt-2 text-primary">
              <Wifi size={24} />
            </div>
            <div className="flex-grow">
              <AceUIInput
                label="WebSocket URL / IP"
                placeholder="ws://[IP_ADDRESS]"
                type="text"
                value={websocketIp}
                onChange={(e) => setWebsocketIp(e.target.value)}
              />
              <p className="text-xs text-text/50 mt-2">
                Gunakan ws://[IP_ADDRESS]
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-6">
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
              <p className="text-xs text-text/50 mt-2">
                Alamat IP WebHDFS NameNode (Default: localhost)
              </p>
            </div>
          </div>

          <div className="flex flex-row gap-6">
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
              <p className="text-xs text-text/50 mt-2">
                Akan dikirim ke ESP dan ditampilkan pada Dashboard utama
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 border-t border-secondary/30 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Server className="text-primary" size={24} />
                <h3 className="text-lg font-semibold text-text">Daftar DataNode</h3>
              </div>
              <button
                type="button"
                onClick={() => setDatanodes([...datanodes, ""])}
                className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-medium transition-all text-sm"
              >
                <Plus size={16} />
                Tambah DataNode
              </button>
            </div>
            
            <p className="text-sm text-text/70 mb-2">
              Masukkan daftar URL atau IP publik DataNode yang bisa diakses dari luar.
            </p>

            {datanodes.length === 0 && (
              <div className="text-center py-6 bg-secondary/10 rounded-xl text-text/50 text-sm border border-secondary/20 border-dashed">
                Belum ada DataNode yang ditambahkan. Sistem akan mencoba melakukan deteksi otomatis.
              </div>
            )}

            {datanodes.map((dn, index) => (
              <div key={index} className="flex flex-row gap-4 items-center bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                <div className="flex-grow w-full">
                  <AceUIInput
                    label={`External Host / URL (Akses Publik) ${index + 1}`}
                    placeholder="Contoh: https://datanode1.domain.com"
                    type="text"
                    value={dn}
                    onChange={(e) => {
                      const newDn = [...datanodes];
                      newDn[index] = e.target.value;
                      setDatanodes(newDn);
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDatanodes(datanodes.filter((_, i) => i !== index))}
                  className="mt-6 p-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all"
                  title="Hapus DataNode"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
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
