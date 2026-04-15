import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/dashboard/Dashboard";
import { signOut, useSession } from "next-auth/react";

function index() {
  const handleLogout = async () => {
    const res = await signOut({
      redirect: true,
      callbackUrl: "/auth/login",
    });
  };

  const tbody = [
    {
      lokasi: "Sungai Ciliwung",
      tinggi_air: "85 cm",
      curah_hujan: "12.5 mm/jam",
      status: "Waspada",
      update_terakhir: "5 menit lalu",
    },
    {
      lokasi: "Sungai Cisadane",
      tinggi_air: "45 cm",
      curah_hujan: "5.2 mm/jam",
      status: "Aman",
      update_terakhir: "8 menit lalu",
    },
    {
      lokasi: "Bendungan Katulampa",
      tinggi_air: "120 cm",
      curah_hujan: "25.8 mm/jam",
      status: "Bahaya",
      update_terakhir: "2 menit lalu",
    },
    {
      lokasi: "Kali Pesanggrahan",
      tinggi_air: "62 cm",
      curah_hujan: "8.3 mm/jam",
      status: "Aman",
      update_terakhir: "10 menit lalu",
    },
  ];

  const dummyData = [
    { time: "00:00", tinggiAir: 50 },
    { time: "04:00", tinggiAir: 80 },
    { time: "08:00", tinggiAir: 150 },
    { time: "12:00", tinggiAir: 320 },
    { time: "16:00", tinggiAir: 380 },
    { time: "20:00", tinggiAir: 250 },
    { time: "24:00", tinggiAir: 120 },
  ];

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
            link: "/dashboard/history",
          },
        ]}
        account={true}
        accountName={data?.user?.fullname}
        accountImage={`https://ui-avatars.com/api/?name=${data?.user?.fullname}`}
        accountRole="Admin"
        header="Dashboard"
      >
        <Dashboard
          tbody={tbody}
          thead={[
            { title: "Lokasi" },
            { title: "Tinggi Air" },
            { title: "Curah Hujan" },
            { title: "Status" },
            { title: "Update Terakhir" },
          ]}
          graph={dummyData}
        />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
