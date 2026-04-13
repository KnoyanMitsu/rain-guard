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
            link: "/",
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
      >
        <Dashboard />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
