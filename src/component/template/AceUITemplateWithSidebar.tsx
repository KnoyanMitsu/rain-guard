import React from "react";

type AceUITemplateWithSidebarProps = {
  appname: string;
  children: React.ReactNode;
};

function AceUITemplateWithSidebar({
  appname,
  children,
}: AceUITemplateWithSidebarProps) {
  return (
    <>
      <div className="grid grid-cols-5 h-screen">
        <div className="col-span-1 p-4">
          <h1 className="text-2xl font-bold">{appname}</h1>
        </div>
        <div className="col-span-4 p-10 bg-[#f0f7ff] rounded-l-3xl">
          {children}
        </div>
      </div>
    </>
  );
}

export default AceUITemplateWithSidebar;
