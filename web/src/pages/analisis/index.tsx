import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import db from "@/utils/db/firebase";
import Analisis from "@/views/analisis/analisis";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SIDEBAR_MENU = [
  { title: "Dashboard", link: "/dashboard/" },
  { title: "Riwayat", link: "/history" },
  { title: "Analisis Data", link: "/analisis" },
  { title: "Hadoop Backup", link: "/hadoop" },
  { title: "Pengaturan", link: "/settings" },
];

function AnalyticsPage() {
  const { data: session }: any = useSession();
  const displayName = session?.user?.name || session?.user?.fullname || session?.user?.nama || "Admin";

  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => await signOut({ redirect: true, callbackUrl: "/auth/login" });

  useEffect(() => {
    const q = query(collection(db, "history"), orderBy("timestamp", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map((doc) => {
        const item = doc.data();
        const lastSeen = item.timestamp ? new Date(item.timestamp) : new Date();
        const distance = Number(item.distance || 0);
        return {
          tinggi_air: `${distance.toFixed(2)} cm`,
          curah_hujan: `${item.rain || 0} mm`,
          status: distance > 10 ? "Bahaya" : distance >= 5 ? "Waspada" : "Aman",
          update_terakhir: lastSeen.toISOString(),
        };
      });

      setDataHistory(result);
      setLoading(false);
    }, (error) => {
      console.error("Gagal mengambil data analisis:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={SIDEBAR_MENU}
      account={true}
      accountName={displayName}
      accountImage={`https://ui-avatars.com/api/?name=${displayName}`}
      accountRole="Admin"
      header="Analisis Data"
    >
      <Analisis tbody={dataHistory} loading={loading} />
    </AceUITemplateWithSidebar>
  );
}

export default AnalyticsPage;
