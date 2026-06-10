import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import HadoopFiles from "@/views/hadoop/HadoopFiles";
import { signOut, useSession } from "next-auth/react";

const SIDEBAR_MENU = [
  { title: "Dashboard", link: "/dashboard/" },
  { title: "Riwayat", link: "/history" },
  { title: "Analisis Data", link: "/analisis" },
  { title: "Hadoop Backup", link: "/hadoop" },
  { title: "Pengaturan", link: "/settings" },
];

function HadoopPage() {
  const { data: session }: any = useSession();
  const displayName =
    session?.user?.name || session?.user?.fullname || session?.user?.nama || "Admin";

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <AceUITemplateWithSidebar
      logoutfunc={handleLogout}
      appname="RainGuard"
      listMenu={SIDEBAR_MENU}
      account={true}
      accountName={displayName}
      accountImage={`https://ui-avatars.com/api/?name=${displayName}`}
      accountRole="Admin"
      header="Hadoop Backup"
    >
      <HadoopFiles />
    </AceUITemplateWithSidebar>
  );
}

export default HadoopPage;
