import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import historyData from "@/data/history.json";
import History from "@/views/guest/history/history";
import { signOut, useSession } from "next-auth/react";

function HistoryPage() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  const { data }: any = useSession();

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="Rain Guard"
      listMenu={[
        { title: "Dashboard", link: "/dashboard/" },
        { title: "History", link: "/history" },
      ]}
      account={true}
      accountName={data?.user?.fullname}
      accountImage={`https://ui-avatars.com/api/?name=${data?.user?.fullname}`}
      accountRole="Admin"
      header="History"
    >
      <History
        tbody={historyData.map((item) => ({
          lokasi: item.lokasi,
          tinggi_air: item.tinggi_air.toString(),
          curah_hujan: item.curah_hujan.toString(),
          status: item.status,
          update_terakhir: item.update_terakhir,
        }))}
        thead={[
          { title: "Lokasi" },
          { title: "Tinggi Air" },
          { title: "Curah Hujan" },
          { title: "Status" },
          { title: "Update Terakhir" },
        ]}
      />
    </AceUITemplateWithSidebar>
  );
}

export default HistoryPage;