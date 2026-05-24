import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function AnalyticsPage() {
  const { data: session }: any = useSession();
  const displayName = session?.user?.name || "Admin";
  const [dataAnalytics, setDataAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => await signOut({ redirect: true, callbackUrl: "/auth/login" });

  useEffect(() => {
    // Mengambil 20 data terakhir untuk keperluan analisis grafik
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"), limit(20));
    
    const unsub = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => {
        const item = doc.data();
        return {
          timestamp: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tinggi_air: Number(item.distance || 0),
          curah_hujan: Number(item.rain || 0),
        };
      }).reverse(); // Dibalik agar urutan waktu kiri ke kanan

      setDataAnalytics(result);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={[
        { title: "Dasbor", link: "/dashboard/" },
        { title: "Riwayat", link: "/history" },
        { title: "Analisis Data", link: "/analisis" }
      ]}
      account={true}
      accountName={displayName}
      accountImage={`https://ui-avatars.com/api/?name=${displayName}`}
      header="Analisis Data"
    >
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Tren Tinggi Air & Curah Hujan</h2>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center">Memuat grafik...</div>
        ) : (
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tinggi_air" stroke="#0891b2" name="Tinggi Air (cm)" strokeWidth={2} />
                <Line type="monotone" dataKey="curah_hujan" stroke="#ef4444" name="Curah Hujan (mm)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </AceUITemplateWithSidebar>
  );
}

export default AnalyticsPage;