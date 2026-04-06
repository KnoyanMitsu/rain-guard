import AceUITemplateWithSidebar from "@/component/template/AceUITemplateWithSidebar";
import Dashboard from "@/views/Dashboard";
import React from "react";

function index() {
  return (
    <>
      <AceUITemplateWithSidebar appname="Rain Guard">
        <Dashboard />
      </AceUITemplateWithSidebar>
    </>
  );
}

export default index;
