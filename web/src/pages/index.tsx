import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/dashboard/Dashboard";

function index() {
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
        accountName="Admin"
        accountImage="https://ui-avatars.com/api/?name=Admin"
        accountRole="Admin"
      >
        <Dashboard />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
