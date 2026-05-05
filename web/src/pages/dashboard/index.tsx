import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import history from '@/data/history.json';
import Dashboard from "@/views/dashboard/Dashboard";
import { signOut, useSession } from "next-auth/react";

function index() {
  const handleLogout = async () => {
    const res = await signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
  };

  const { data }: any = useSession();
  console.log(data);
  return (
    <>
      <AceUITemplateWithSidebar
        logoutfunc={handleLogout}
        appname="Rain Guard"
        listMenu={[
          {
            title: "Dashboard",
            link: "/dashboard/",
          },
          {
            title: "History",
            link: "/history",
          },
        ]}
        account={true}
        accountName={data?.user?.fullname}
        accountImage={`https://ui-avatars.com/api/?name=${data?.user?.fullname}`}
        accountRole="Admin"
        header="Dashboard"
      >
        <Dashboard
          tbody={history.map((item) => ({
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
          graph={history.map((item) => ({
            time: item.update_terakhir,
            tinggiAir: item.tinggi_air,
          }))}
        />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
