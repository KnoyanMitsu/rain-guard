import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/dashboard/Dashboard";
import { useSession } from "next-auth/react";

function index() {
  const {data}:any = useSession();
  console.log(data);
  return (
    <>
      <AceUITemplateWithSidebar
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
        <Dashboard />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
